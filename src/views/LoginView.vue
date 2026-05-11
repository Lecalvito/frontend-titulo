<template>
  <main class="login-page">
    <section class="login-card">
      <div class="login-header">
        <h1>Sistema de Laboratorios</h1>
        <p>Inicia sesión para continuar</p>
      </div>

      <form @submit.prevent="procesarLogin" class="login-form">
        <div>
          <label>Correo electrónico</label>
          <input
            v-model="correo_usuario"
            type="email"
            class="input"
            placeholder="correo@ejemplo.cl"
            required
          />
        </div>

        <div>
          <label>Contraseña</label>
          <input
            v-model="password_usuario"
            type="password"
            class="input"
            placeholder="Ingrese su contraseña"
            required
          />
        </div>

        <p v-if="mensajeError" class="error-message">
          {{ mensajeError }}
        </p>

        <button class="button login-button" type="submit" :disabled="cargando">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const correo_usuario = ref('')
const password_usuario = ref('')
const mensajeError = ref('')
const cargando = ref(false)

async function procesarLogin() {
  try {
    mensajeError.value = ''
    cargando.value = true

    await authStore.login(correo_usuario.value, password_usuario.value)

    const rol = authStore.rolUsuario

    if (rol === 'Administrador') {
      router.push('/dashboard-admin')
    } else if (rol === 'Auxiliar') {
      router.push('/dashboard-auxiliar')
    } else if (rol === 'Docente') {
      router.push('/dashboard-docente')
    } else {
      router.push('/login')
    }
  } catch (error) {
    mensajeError.value = error.message
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-white);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-header h1 {
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #6b7280;
}

.login-form label {
  display: block;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.login-button {
  width: 100%;
  margin-top: 0.5rem;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>