<template>
  <div class="users-container">
    <nav class="navbar">
      <div class="navbar-content">
        <h1 class="navbar-title">SISTEMA DE GESTIÓN DE CAPACITACIÓN</h1>
        <div class="navbar-actions">
          <span class="user-avatar">{{ getInitials(authStore.currentUser?.user?.user || 'Usuario') }}</span>
          <span class="user-name">{{ authStore.currentUser?.user?.user || 'Usuario' }} - {{ authStore.currentUser?.user?.roles[0]?.titulo || 'Invitado'}}</span>
          <button @click="handleLogout" class="btn-logout" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Cerrando...' : 'Cerrar Sesión' }}
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <div class="header-section">
        <button @click="goBack" class="btn-back">← Volver</button>
        <h2 class="page-title">Listado de Usuarios</h2>
      </div>

      <div class="users-card">
        <!-- Loading state -->
        <div v-if="usersStore.isLoading" class="loading-container">
          <div class="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="usersStore.error" class="error-container">
          <p class="error-text">{{ usersStore.error }}</p>
          <button @click="loadUsers" class="btn-retry">Reintentar</button>
        </div>

        <!-- Users table -->
        <div v-else-if="usersStore.users?.total > 0" class="table-wrapper">
          <div class="table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                  <th>Email</th>
                  <th>Fecha de Registro</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in usersStore.users.data" :key="u.id" class="user-row" :class="{ 'is-desactivate': !u.status, 'is-normal': u.status }">
                  <td>{{ u.id }}</td>
                  <td>
                    <div class="user-cell">
                      <div class="user-avatar">{{ getInitials(u.nombre) }}</div>
                      <span>{{ u.nombre }}</span>
                    </div>
                  </td>
                  <td>{{ u.user }}</td>
                  <td>
                    <span v-for="rol in u.roles" :key="rol.id" class="badge">
                      {{ rol.titulo }}
                    </span>
                  </td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.created_at ? formatDate(u.created_at) : 'Sin fecha' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="pagination-container">
            <div class="pagination-info">
              <p>
                Mostrando 
                <strong>{{ usersStore.users.from }}</strong> a 
                <strong>{{ usersStore.users.to }}</strong> de 
                <strong>{{ usersStore.users.total }}</strong> usuarios
              </p>
            </div>

            <div class="pagination-controls">
              <!-- First Page Button -->
              <button 
                @click="goToPage(1)" 
                class="pagination-btn"
                :disabled="usersStore.users.current_page === 1 || usersStore.isLoading"
                title="Primera página"
              >
                <span class="pagination-icon">⟪</span>
              </button>

              <!-- Previous Page Button -->
              <button 
                @click="goToPage(usersStore.users.current_page - 1)" 
                class="pagination-btn"
                :disabled="!usersStore.users.prev_page_url || usersStore.isLoading"
                title="Página anterior"
              >
                <span class="pagination-icon">‹</span>
              </button>

              <!-- Page Numbers -->
              <div class="page-numbers">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  class="page-number-btn"
                  :class="{ active: page === usersStore.users.current_page }"
                  :disabled="usersStore.isLoading"
                >
                  {{ page }}
                </button>
              </div>

              <!-- Next Page Button -->
              <button 
                @click="goToPage(usersStore.users.current_page + 1)" 
                class="pagination-btn"
                :disabled="!usersStore.users.next_page_url || usersStore.isLoading"
                title="Página siguiente"
              >
                <span class="pagination-icon">›</span>
              </button>

              <!-- Last Page Button -->
              <button 
                @click="goToPage(usersStore.users.last_page)" 
                class="pagination-btn"
                :disabled="usersStore.users.current_page === usersStore.users.last_page || usersStore.isLoading"
                title="Última página"
              >
                <span class="pagination-icon">⟫</span>
              </button>
            </div>

            <!-- Items per page selector -->
            <div class="per-page-selector">
              <label for="perPage">Por página:</label>
              <select 
                id="perPage" 
                v-model="perPage" 
                @change="changePerPage"
                :disabled="usersStore.isLoading"
                class="per-page-select"
              >
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="empty-container">
          <p>No hay usuarios registrados</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'

const router = useRouter()
const authStore = useAuthStore()
const usersStore = useUsersStore()
const perPage = ref(20)

onMounted(async () => {
  await loadUsers()
})

const loadUsers = async (page = 1) => {
  try {
    await usersStore.fetchUsers(page, perPage.value)
  } catch (error) {
    console.error('Error al cargar usuarios:', error)
  }
}

const goToPage = async (page) => {
  if (page < 1 || page > usersStore.users.last_page) return
  await loadUsers(page)
}

const changePerPage = async () => {
  await loadUsers(1) // Volver a la primera página al cambiar items por página
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    usersStore.resetStore()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

const goBack = () => {
  router.push({ name: 'home' })
}

const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Computed property para mostrar números de página visibles
const visiblePages = computed(() => {
  if (!usersStore.users?.last_page) return []
  
  const current = usersStore.users.current_page
  const last = usersStore.users.last_page
  const delta = 2 // Cuántas páginas mostrar a cada lado de la actual
  
  const pages = []
  const rangeStart = Math.max(2, current - delta)
  const rangeEnd = Math.min(last - 1, current + delta)
  
  // Siempre mostrar la primera página
  pages.push(1)
  
  // Agregar "..." si hay un salto
  if (rangeStart > 2) {
    pages.push('...')
  }
  
  // Agregar páginas en el rango
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }
  
  // Agregar "..." si hay un salto
  if (rangeEnd < last - 1) {
    pages.push('...')
  }
  
  // Siempre mostrar la última página (si hay más de 1)
  if (last > 1) {
    pages.push(last)
  }
  
  return pages
})
</script>

<style scoped>
.users-container {
  min-height: 100vh;
  background-color: #f7fafc;
}

.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.navbar-title {
  font-size: 24px;
  font-weight: 700;
  color: #2d3748;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-name {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
}

.btn-logout {
  padding: 10px 20px;
  background-color: #f56565;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout:hover:not(:disabled) {
  background-color: #e53e3e;
  transform: translateY(-1px);
}

.btn-logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.btn-back {
  padding: 10px 20px;
  background-color: #e2e8f0;
  color: #2d3748;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-back:hover {
  background-color: #cbd5e0;
  transform: translateX(-2px);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
}

.users-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  min-height: 400px;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-text {
  color: #c53030;
  font-size: 16px;
}

.btn-retry {
  padding: 10px 24px;
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-retry:hover {
  background-color: #5568d3;
}

.table-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table-container {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  background-color: #f7fafc;
}

.users-table th {
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 2px solid #e2e8f0;
}

.users-table td {
  padding: 16px;
  font-size: 14px;
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
}

.users-table tbody tr {
  transition: background-color 0.2s;
}

.users-table tbody tr:hover {
  background-color: #f7fafc;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: #e6f2ff;
  color: #1a5490;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-right: 6px;
}

.empty-container p {
  color: #718096;
  font-size: 16px;
}

.user-row {
  /* Transición suave de 0.3 segundos */
  transition: background-color 0.3s ease, color 0.3s ease;
  border-bottom: 1px solid #eee;
}

.is-desactivate {
  background-color: #fee2e2; /* Un rojo pastel/suave */
  color: #991b1b;           /* Texto en rojo oscuro para contraste */
}

.is-normal {
  background-color: #ffffff;
  color: #374151;
}

.user-row:hover {
  filter: brightness(0.99);
  cursor: pointer;
}

/* Pagination Styles */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  color: #4a5568;
  font-size: 14px;
}

.pagination-info strong {
  color: #2d3748;
  font-weight: 600;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  min-width: 40px;
  height: 40px;
  padding: 8px 12px;
  background-color: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-icon {
  font-size: 18px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number-btn {
  min-width: 40px;
  height: 40px;
  padding: 8px;
  background-color: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number-btn:hover:not(:disabled):not(.active) {
  background-color: #f7fafc;
  border-color: #cbd5e0;
}

.page-number-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
}

.page-number-btn:disabled {
  cursor: not-allowed;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4a5568;
}

.per-page-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: white;
  color: #2d3748;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.per-page-select:hover:not(:disabled) {
  border-color: #cbd5e0;
}

.per-page-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.per-page-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .pagination-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .pagination-info {
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
  }
  
  .per-page-selector {
    justify-content: center;
  }
  
  .page-numbers {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>