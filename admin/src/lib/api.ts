import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL,
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle 401 Unauthorized globally here to force logout if needed.
    // if (error.response?.status === 401) { ... }
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
