import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from '@/stores/auth'
import { setupAxiosInterceptors } from '@/plugins/axios'

async function bootstrap() {
    const app = createApp(App)
    const pinia = createPinia()

    app.use(pinia)

    const auth = useAuthStore()

    setupAxiosInterceptors(router, auth)

    await auth.ensureAuthReady()

    app.use(router)
    app.mount('#app')
}

bootstrap()
