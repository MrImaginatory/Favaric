import axios from 'axios';

const api = axios.create({
    headers: { 'Content-Type': 'application/json' }
});

const formData = new FormData();
formData.append('brandName', 'Nike');

api.interceptors.request.use((config) => {
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    return config;
});

api.post('http://localhost:5000/test', formData).catch(() => {});
