<template>
    <nav class="navbar">
    <div class="navbar-content">
        <h1 class="navbar-title">SISTEMA DE GESTIÓN DE CAPACITACIÓN</h1>
        <div class="navbar-actions">
        <span class="user-avatar">{{ getInitials(userName) }}</span>
        <span class="user-name">{{ userName }} - {{ roleTitle }}</span>
        <button @click="handleLogout" class="btn-logout" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? 'Cerrando...' : 'Cerrar Sesión' }}
        </button>
        </div>
    </div>
    </nav>
</template>

<script setup>
import { useDataHeader } from '@/composables/useDataHeader'
const { authStore, userName, roleTitle, getInitials, handleLogout } = useDataHeader()
</script>

<style scoped>
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
</style>
