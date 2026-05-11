import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { path: '/', redirect: '/login' },

  { path: '/login', component: LoginView },

  {
    path: '/',
    component: MainLayout,
    meta: { requiereAuth: true },
    children: [
      {
        path: 'dashboard-admin',
        component: () => import('@/views/DashboardAdminView.vue'),
        meta: { roles: ['Administrador'] }
      },
      {
        path: 'dashboard-auxiliar',
        component: () => import('@/views/DashboardAuxiliarView.vue'),
        meta: { roles: ['Auxiliar'] }
      },
      {
        path: 'dashboard-docente',
        component: () => import('@/views/DashboardDocenteView.vue'),
        meta: { roles: ['Docente'] }
      },
      {
        path: 'laboratorios',
        component: () => import('@/views/LaboratoriosView.vue'),
        meta: { roles: ['Administrador', 'Auxiliar', 'Docente'] }
      },
      {
        path: 'insumos',
        component: () => import('@/views/InsumosView.vue'),
        meta: { roles: ['Administrador', 'Auxiliar', 'Docente'] }
      },
      {
        path: 'reservas',
        component: () => import('@/views/ReservasView.vue'),
        meta: { roles: ['Administrador', 'Auxiliar'] }
      },
      {
        path: 'mis-reservas',
        component: () => import('@/views/ReservasView.vue'),
        meta: { roles: ['Docente'] }
      },
      {
        path: 'movimientos-stock',
        component: () => import('@/views/MovimientosStockView.vue'),
        meta: { roles: ['Administrador', 'Auxiliar'] }
      },
      {
        path: 'historial-reservas/:idReserva',
        component: () => import('@/views/HistorialReservasView.vue'),
        meta: { roles: ['Administrador', 'Auxiliar', 'Docente'] }
      },
      {
        path: 'usuarios',
        component: () => import('@/views/UsuariosView.vue'),
        meta: { roles: ['Administrador'] }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiereAuth && !auth.estaAutenticado) {
    return next('/login')
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.rolUsuario)) {
    return next('/login')
  }

  next()
})

export default router