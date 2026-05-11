<template>
  <section class="card">
    <div class="view-header">
      <div>
        <h1>Usuarios</h1>
        <p>Gestión de usuarios del sistema.</p>
      </div>

      <button class="button" @click="abrirFormulario">
        Nuevo usuario
      </button>
    </div>

    <form v-if="mostrarFormulario" class="form-card" @submit.prevent="guardar">
      <h2>{{ editando ? 'Editar usuario' : 'Nuevo usuario' }}</h2>

      <label>Nombre</label>
      <input v-model="form.nombre_usuario" class="input" required />

      <label>Correo</label>
      <input v-model="form.correo_usuario" class="input" required />

      <label>Password</label>
      <input v-model="form.password_usuario" type="password" class="input" required />

      <label>Estado</label>
      <select v-model="form.estado_usuario" class="input">
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>

      <label>Rol</label>
      <select v-model="form.det_permiso" class="input" required>
        <option value="">Seleccione rol</option>
        <option
          v-for="p in permisos"
          :key="p.id_permiso"
          :value="p.id_permiso"
        >
          {{ p.nombre_permiso }}
        </option>
      </select>

      <div class="form-actions">
        <button class="button">Guardar</button>
        <button type="button" class="button button-secondary" @click="cerrarFormulario">
          Cancelar
        </button>
      </div>
    </form>

    <p v-if="cargando" class="info-message">Cargando usuarios...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="exito" class="success-message">{{ exito }}</p>

    <div v-if="!cargando && !error" class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="usuarios.length === 0">
            <td colspan="6">No hay usuarios registrados.</td>
          </tr>

          <tr v-for="u in usuarios" :key="u.id_usuario">
            <td>{{ u.id_usuario }}</td>
            <td>{{ u.nombre_usuario }}</td>
            <td>{{ u.correo_usuario }}</td>
            <td>{{ u.estado_usuario }}</td>
            <td>{{ u.nombre_permiso }}</td>

            <td>
              <div class="acciones">
                <button class="btn-small" @click="editar(u)">Editar</button>
                <button class="btn-small btn-danger" @click="eliminar(u.id_usuario)">
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listarUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario } from '@/services/usuariosService'
import { listarPermisos } from '@/services/permisosService'

const usuarios = ref([])
const permisos = ref([])
const mostrarFormulario = ref(false)
const editando = ref(null)
const cargando = ref(false)
const error = ref('')
const exito = ref('')

const form = ref({
  nombre_usuario: '',
  correo_usuario: '',
  password_usuario: '',
  estado_usuario: 'activo',
  det_permiso: ''
})

async function cargar() {
  try {
    cargando.value = true
    error.value = ''

    usuarios.value = await listarUsuarios()
    permisos.value = await listarPermisos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function abrirFormulario() {
  limpiarMensajes()
  mostrarFormulario.value = true
  editando.value = null
  form.value = {
    nombre_usuario: '',
    correo_usuario: '',
    password_usuario: '',
    estado_usuario: 'activo',
    det_permiso: ''
  }
}

function cerrarFormulario() {
  mostrarFormulario.value = false
}

function editar(u) {
  limpiarMensajes()
  mostrarFormulario.value = true
  editando.value = u.id_usuario
  form.value = {
    nombre_usuario: u.nombre_usuario,
    correo_usuario: u.correo_usuario,
    password_usuario: '',
    estado_usuario: u.estado_usuario,
    det_permiso: u.det_permiso
  }
}

async function guardar() {
  try {
    limpiarMensajes()

    if (editando.value) {
      await actualizarUsuario(editando.value, form.value)
      exito.value = 'Usuario actualizado correctamente.'
    } else {
      await crearUsuario(form.value)
      exito.value = 'Usuario creado correctamente.'
    }

    cerrarFormulario()
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

async function eliminar(id) {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return

  try {
    limpiarMensajes()
    await eliminarUsuario(id)
    exito.value = 'Usuario eliminado correctamente.'
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

function limpiarMensajes() {
  error.value = ''
  exito.value = ''
}

onMounted(cargar)
</script>