import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchUsers(page = 1, perPage = 20) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/usuarios', {
        params: {
          page: page,
          per_page: perPage
        }
      })
      users.value = response.data
      return users.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar usuarios'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    users.value = []
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    users,
    isLoading,
    error,
    // Actions
    fetchUsers,
    clearError,
    resetStore
  }
})