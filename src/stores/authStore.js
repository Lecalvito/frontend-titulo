import { defineStore } from 'pinia'
import { iniciarSesion } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    usuario: JSON.parse(localStorage.getItem('usuario')) || null
  }),

  getters: {
    estaAutenticado: (state) => !!state.token,
    rolUsuario: (state) => state.usuario?.nombre_permiso || null
  },

  actions: {
    async login(correo_usuario, password_usuario) {
      const datos = await iniciarSesion(correo_usuario, password_usuario)

      this.token = datos.token
      this.usuario = datos.usuario

      localStorage.setItem('token', datos.token)
      localStorage.setItem('usuario', JSON.stringify(datos.usuario))
    },

    logout() {
      this.token = null
      this.usuario = null

      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
    }
  }
})