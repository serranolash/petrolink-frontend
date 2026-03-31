// En tu frontend, crea un archivo src/config/api.js
const isProduction = import.meta.env.PROD;

export const API_URL = isProduction 
    ? 'https://petrolink-backend-production.up.railway.app/api'  // Producción
    : 'http://localhost:3001/api';  // Desarrollo

export default API_URL;