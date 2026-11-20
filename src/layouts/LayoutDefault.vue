<template>
    <Navbar />
    <main class="layout-default">
        <slot />
    </main>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
.layout-default {
  /* estilos generales de página si quieres */
}
</style>