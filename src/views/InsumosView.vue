<template>
  <section class="card">
    <div class="view-header">
      <div>
        <h1>Insumos</h1>
        <p>Gestión de insumos del laboratorio.</p>
      </div>

      <button
        v-if="esAdministrador"
        class="button"
        @click="abrirFormularioNuevo"
      >
        Nuevo insumo
      </button>
    </div>

    <form v-if="mostrarFormulario && esAdministrador" class="form-card" @submit.prevent="guardar">
      <h2>{{ editando ? 'Editar insumo' : 'Nuevo insumo' }}</h2>

      <label>Nombre</label>
      <input v-model="form.nombre_insumo" class="input" required />

      <label>Descripción</label>
      <input v-model="form.descripcion_insumo" class="input" required />

      <label>Unidad</label>
      <input v-model="form.unidad_medida_insumo" class="input" required />

      <label>Stock actual</label>
      <input v-model="form.stock_actual_insumo" type="number" class="input" required />

      <label>Stock mínimo</label>
      <input v-model="form.stock_minimo_insumo" type="number" class="input" required />

      <label>Estado</label>
      <select v-model="form.estado_insumo" class="input">
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>

      <div class="form-actions">
        <button class="button">{{ editando ? 'Actualizar' : 'Guardar' }}</button>
        <button type="button" class="button button-secondary" @click="cerrarFormulario">
          Cancelar
        </button>
      </div>
    </form>

    <p v-if="cargando" class="info-message">Cargando...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="exito" class="success-message">{{ exito }}</p>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Unidad</th>
            <th>Stock</th>
            <th>Stock mín</th>
            <th>Estado</th>
            <th v-if="esAdministrador">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="insumos.length === 0">
            <td :colspan="esAdministrador ? 7 : 6">
              No hay insumos registrados.
            </td>
          </tr>

          <tr v-for="i in insumos" :key="i.id_insumo">
            <td>{{ i.id_insumo }}</td>
            <td>{{ i.nombre_insumo }}</td>
            <td>{{ i.unidad_medida_insumo }}</td>
            <td>{{ i.stock_actual_insumo }}</td>
            <td>{{ i.stock_minimo_insumo }}</td>
            <td>{{ i.estado_insumo }}</td>

            <td v-if="esAdministrador">
              <div class="acciones">
                <button class="btn-small" @click="editar(i)">Editar</button>
                <button class="btn-small btn-danger" @click="eliminar(i.id_insumo)">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import {
  listarInsumos,
  crearInsumo,
  actualizarInsumo,
  eliminarInsumo
} from '@/services/insumosService'

const auth = useAuthStore()

const insumos = ref([])
const cargando = ref(false)
const error = ref('')
const exito = ref('')
const mostrarFormulario = ref(false)
const editando = ref(null)

const form = ref({
  nombre_insumo: '',
  descripcion_insumo: '',
  unidad_medida_insumo: '',
  stock_actual_insumo: 0,
  stock_minimo_insumo: 0,
  estado_insumo: 'activo'
})

const esAdministrador = computed(() => auth.rolUsuario === 'Administrador')

async function cargar() {
  try {
    cargando.value = true
    error.value = ''
    insumos.value = await listarInsumos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function abrirFormularioNuevo() {
  limpiarMensajes()
  mostrarFormulario.value = true
  editando.value = null
  form.value = {
    nombre_insumo: '',
    descripcion_insumo: '',
    unidad_medida_insumo: '',
    stock_actual_insumo: 0,
    stock_minimo_insumo: 0,
    estado_insumo: 'activo'
  }
}

function editar(i) {
  limpiarMensajes()
  mostrarFormulario.value = true
  editando.value = i.id_insumo
  form.value = { ...i }
}

function cerrarFormulario() {
  mostrarFormulario.value = false
}

async function guardar() {
  try {
    limpiarMensajes()

    const datos = {
      ...form.value,
      stock_actual_insumo: Number(form.value.stock_actual_insumo),
      stock_minimo_insumo: Number(form.value.stock_minimo_insumo)
    }

    if (editando.value) {
      await actualizarInsumo(editando.value, datos)
      exito.value = 'Insumo actualizado correctamente.'
    } else {
      await crearInsumo(datos)
      exito.value = 'Insumo creado correctamente.'
    }

    cerrarFormulario()
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

async function eliminar(id) {
  if (!confirm('¿Seguro que deseas eliminar este insumo?')) return

  try {
    limpiarMensajes()
    await eliminarInsumo(id)
    exito.value = 'Insumo eliminado correctamente.'
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