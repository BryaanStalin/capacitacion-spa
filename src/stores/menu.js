import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/plugins/axios'

export const useMenuStore = defineStore('menu', () => {
  // State
  const menus = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  // Actions
  async function fetchMenu(page = 1, perPage = 20) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await axios.get('/api/menus/all', {
        params: {
          page: page,
          per_page: perPage
        }
      })
      menus.value = response.data
      return menus.value
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al cargar menús'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function resetStore() {
    menus.value = []
    error.value = null
    isLoading.value = false
  }

  return {
    // State
    menus,
    isLoading,
    error,
    // Actions
    fetchMenu,
    clearError,
    resetStore
  }
})