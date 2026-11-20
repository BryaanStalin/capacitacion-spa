import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useDataHeader() {
    const authStore = useAuthStore()

    const userName = computed(() => authStore.currentUser?.user?.user || 'Usuario')
    const roleTitle = computed(() => authStore.currentUser?.user?.roles?.[0]?.titulo || 'Invitado')

    function getInitials(name) {
        if (!name) return 'U'
        return name
        .trim()
        .split(/\s+/)
        .map(p => (p[0] || '').toUpperCase())
        .slice(0, 2)
        .join('') || 'U'
    }

    async function handleLogout() {
        try {
            await authStore.logout()
            rolesStore.resetStore()
            router.push({ name: 'login' })
        } catch (error) {
            console.error('Error al cerrar sesión:', error)
        }
    }

    return { authStore, userName, roleTitle, getInitials, handleLogout }
}