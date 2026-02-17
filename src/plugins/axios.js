import axios from 'axios'

// Configuración base de Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8050/capacitacion-api/public',
  withCredentials: true, // Importante para Sanctum
  withXSRFToken: true, // Importante para CSRF protection
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const loginView = window.location.pathname === '/login';

    if (error.response?.status === 401 && !loginView) {
      // Redirigir al login si no está autenticado
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance