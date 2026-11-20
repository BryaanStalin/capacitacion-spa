<template>
  <!-- Renderiza el layout elegido por la ruta actual -->
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import LayoutDefault from '@/layouts/LayoutDefault.vue'
import LayoutAuth from '@/layouts/LayoutAuth.vue'

const route = useRoute()

// Elegimos layout por meta.layout. Valor por defecto: 'default'
const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'default'
  if (layout === 'auth') return LayoutAuth
  return LayoutDefault
})
</script>