<template>
  <div class="app-layout">
    <SidebarMenu :menu-abierto="menuAbierto" @cerrar-menu="cerrarMenu" />

    <div
      v-if="menuAbierto"
      class="layout-overlay"
      @click="cerrarMenu"
    ></div>

    <main class="main-content">
      <header class="main-header">
        <button class="menu-button" @click="alternarMenu">
          ☰
        </button>

        <div class="header-user">
          <span>{{ auth.usuario?.nombre_usuario }}</span>
          <button class="logout-button" @click="cerrarSesion">
            Cerrar sesión
          </button>
        </div>
      </header>

      <section class="content-area">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SidebarMenu from '@/components/SidebarMenu.vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const menuAbierto = ref(false)

function alternarMenu() {
  menuAbierto.value = !menuAbierto.value
}

function cerrarMenu() {
  menuAbierto.value = false
}

function cerrarSesion() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background: var(--color-bg);
}

.main-content {
  min-height: 100vh;
}

.main-header {
  height: 64px;
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.menu-button {
  background: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: var(--radius);
  padding: 0.5rem 0.8rem;
  cursor: pointer;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
}

.logout-button {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius);
  padding: 0.45rem 0.8rem;
  cursor: pointer;
}

.logout-button:hover {
  background: var(--color-primary);
  color: var(--color-white);
}

.content-area {
  padding: 1rem;
}

.layout-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 15;
}

@media (min-width: 1024px) {
  .main-content {
    margin-left: 260px;
  }

  .menu-button {
    display: none;
  }

  .layout-overlay {
    display: none;
  }

  .content-area {
    padding: 2rem;
  }
}
</style>