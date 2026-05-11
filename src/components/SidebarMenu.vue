<template>
  <aside class="sidebar" :class="{ 'sidebar-open': menuAbierto }">
    <div class="sidebar-header">
      <h2>Laboratorios</h2>
      <p>{{ auth.usuario?.nombre_permiso }}</p>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in menuFiltrado"
        :key="item.path"
        :to="item.path"
        class="sidebar-link"
        active-class="sidebar-link-active"
        @click="$emit('cerrarMenu')"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

defineProps({
  menuAbierto: {
    type: Boolean,
    default: false
  }
})

defineEmits(['cerrarMenu'])

const auth = useAuthStore()

const menuItems = [
  {
    label: 'Dashboard',
    path: '/dashboard-admin',
    roles: ['Administrador']
  },
  {
    label: 'Dashboard',
    path: '/dashboard-auxiliar',
    roles: ['Auxiliar']
  },
  {
    label: 'Dashboard',
    path: '/dashboard-docente',
    roles: ['Docente']
  },
  {
    label: 'Usuarios',
    path: '/usuarios',
    roles: ['Administrador']
  },
  {
    label: 'Laboratorios',
    path: '/laboratorios',
    roles: ['Administrador', 'Auxiliar', 'Docente']
  },
  {
    label: 'Insumos',
    path: '/insumos',
    roles: ['Administrador', 'Auxiliar', 'Docente']
  },
  {
    label: 'Reservas',
    path: '/reservas',
    roles: ['Administrador', 'Auxiliar']
  },
  {
    label: 'Mis Reservas',
    path: '/mis-reservas',
    roles: ['Docente']
  },
  {
    label: 'Movimientos Stock',
    path: '/movimientos-stock',
    roles: ['Administrador', 'Auxiliar']
  }
]

const menuFiltrado = computed(() => {
  return menuItems.filter((item) => item.roles.includes(auth.rolUsuario))
})
</script>

<style scoped>
.sidebar {
  width: 260px;
  min-height: 100vh;
  background: var(--color-primary);
  color: var(--color-white);
  position: fixed;
  left: -260px;
  top: 0;
  transition: left 0.3s ease;
  z-index: 20;
}

.sidebar-open {
  left: 0;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar-header h2 {
  font-size: 1.2rem;
  margin-bottom: 0.4rem;
}

.sidebar-header p {
  font-size: 0.9rem;
  opacity: 0.85;
}

.sidebar-nav {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sidebar-link {
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  color: var(--color-white);
  transition: background 0.2s ease;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.sidebar-link-active {
  background: var(--color-secondary);
}

@media (min-width: 1024px) {
  .sidebar {
    left: 0;
  }
}
</style>