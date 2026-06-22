import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach the auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If sending FormData, let the browser set the Content-Type with the proper boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!error.response) {
      return Promise.reject(error);
    }

    // Try to refresh token on any 401 Unauthorized response
    // But don't retry if the request was to login or refresh itself
    if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login') && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${baseURL}/user/auth/refresh`, {}, {
          withCredentials: true,
        });

        const newAccessToken = data?.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem('accessToken', newAccessToken);
          
          apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          
          processQueue(null, newAccessToken);
          
          return apiClient(originalRequest);
        } else {
           throw new Error("Invalid tokens received");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // If it's a 401 and we already retried, or it was a login/refresh request itself, log out.
    if (error.response.status === 401) {
       localStorage.clear();
       sessionStorage.clear();
       window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (data: any) => {
    const response = await apiClient.post('/user/auth/login', data);
    return response.data;
  },
  signup: async (data: any) => {
    const response = await apiClient.post('/user/auth/signup', data);
    return response.data;
  }
};
