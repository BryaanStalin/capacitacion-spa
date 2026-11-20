import axios from 'axios'

const authUrls = [
  '/api/usuario',
  '/login',
  '/logout'
]

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export function setupAxiosInterceptors(router, authStore) {
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status
      const isAuthRequest = authUrls.includes(error.config?.url)
      const currentRoute = router.currentRoute.value

      if (status === 401 && !isAuthRequest && currentRoute.name !== 'login') {
        authStore.clearSession()

        await router.push({
          name: 'login',
          query: { redirect: currentRoute.fullPath }
        })
      }

      return Promise.reject(error)
    }
  )
}

export default axiosInstance