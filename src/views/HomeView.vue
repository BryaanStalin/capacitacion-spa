<template>
  <div class="home-container">
    <nav class="navbar">
      <div class="navbar-content">
        <h1 class="navbar-title">Mi Primera Aplicación en Vue3 + Laravel 12</h1>
        <div class="navbar-actions">
          <span class="user-name">{{ authStore.currentUser?.user?.user || 'Usuario' }} - {{ authStore.currentUser?.user?.roles[0]?.titulo || 'Invitado'}}</span>
          <button @click="handleLogout" class="btn-logout" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Cerrando...' : 'Cerrar Sesión' }}
          </button>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <div class="welcome-card">
        <h2 class="welcome-title">¡Bienvenido, {{ authStore.currentUser?.user?.nombre }}!</h2>
        <p class="welcome-text">Has iniciado sesión correctamente en el sistema.</p>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👤</div>
            <div class="stat-info">
              <p class="stat-label">Email</p>
              <p class="stat-value">{{ authStore.currentUser?.user?.email }}</p>
            </div>
          </div>
          
          <div class="stat-card clickable" @click="goToUsers">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <p class="stat-label">Ver Usuarios</p>
              <p class="stat-value">Click aquí →</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push({ name: 'login' })
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}

const goToUsers = () => {
  router.push({ name: 'usuarios' })
}
</script>

<style scoped>
.home-container {
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
  font-size: 14px;
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

.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 10px;
}

.welcome-text {
  font-size: 16px;
  color: #718096;
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
}

.stat-card.clickable {
  cursor: pointer;
}

.stat-card.clickable:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.stat-icon {
  font-size: 48px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: white;
}
</style>