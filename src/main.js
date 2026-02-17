import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from '@/stores/auth'
import axios from '@/plugins/axios'


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

// Hidratar ANTES de instalar el router
const auth = useAuthStore()
try {
    await auth.ensureAuthReady()
} catch (e) {
    // Ignorar; no autenticado es un estado válido
}

app.use(router)
app.mount('#app')
