import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true, layout: 'auth' } // sin navbar
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true, layout: 'default' } // con navbar
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('@/views/UsersView.vue'),
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('@/views/RolView.vue'),
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/menu',
      name: 'menu',
      component: () => import('@/views/MenuView.vue'),
      meta: { requiresAuth: true, layout: 'default' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { layout: 'auth' } // normalmente sin navbar
    }
  ]
})

// Guard de navegación global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  await authStore.ensureAuthReady()
    
  // Si está autenticado y trata de ir al login, redirigir a home
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next({ name: 'home' })
  }
  
  // Si requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'login' })
  }
  
  next()
})

export default router