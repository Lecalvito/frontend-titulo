<template>
  <section class="card">
    <h1>Dashboard Docente</h1>
    <p>Bienvenido {{ auth.usuario?.nombre_usuario }}</p>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
</script>