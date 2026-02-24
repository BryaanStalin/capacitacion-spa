import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios'

export const useRolesStore = defineStore('roles', () => {
  // State
  const roles = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchRoles(page = 1, perPage = 20) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/roles', {
        params: {
          page: page,
          per_page: perPage
        }
      })
      roles.value = response.data
      return roles.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar roles'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    roles.value = []
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    roles,
    isLoading,
    error,
    // Actions
    fetchRoles,
    clearError,
    resetStore
  }
})