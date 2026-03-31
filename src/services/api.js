import axios from 'axios';

// Usamos la URL de Railway directamente para producción
const API_BASE_URL = 'https://petrolink-backend-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;