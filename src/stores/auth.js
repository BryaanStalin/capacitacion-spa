import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from '@/plugins/axios'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  // Getters
  const isAuthenticated = computed(() => user.value !== null)
  const currentUser = computed(() => user.value)

  // Actions
  async function initCsrf() {
    try {
      // Obtener cookie CSRF de Sanctum
      await axios.get('/sanctum/csrf-cookie')
    } catch (err) {
      console.error('Error al obtener CSRF cookie:', err)
    }
  }

  async function login(credentials) {
    isLoading.value = true
    error.value = null
    
    try {
      // Inicializar CSRF
      await initCsrf()      
      // Hacer login
      await axios.post('/login', credentials)      
      // Obtener datos del usuario autenticado
      await fetchUser()
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    error.value = null
    
    try {
      await axios.post('/logout')
      user.value = null
      initialized.value = false
      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cerrar sesión'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser() {
    try {
      const response = await axios.get('/api/usuario')
      user.value = response.data
    } catch (err) {
      user.value = null
      throw err
    }
  }
  
async function ensureAuthReady() {
    if (initialized.value) return
    initialized.value = true
    try {
      await initCsrf()
      await fetchUser()  // si cookie es válida, setea user
    } catch (err) {
      user.value = null  // no autenticado o error
      // no lanzamos error: dejamos que los guards decidan
    }
  }

  async function checkAuth() {
    try {
      await fetchUser()
      return true
    } catch (err) {
      user.value = null
      return false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    initCsrf,
    ensureAuthReady,
    login,
    logout,
    fetchUser,
    checkAuth,
    clearError
  }
})