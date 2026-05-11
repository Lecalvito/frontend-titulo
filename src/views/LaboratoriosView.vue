<template>
  <section class="card">
    <div class="view-header">
      <div>
        <h1>Laboratorios</h1>
        <p>Listado de laboratorios disponibles para simulación clínica.</p>
      </div>

      <button
        v-if="esAdministrador"
        class="button"
        type="button"
        @click="abrirFormularioNuevo"
      >
        Nuevo laboratorio
      </button>
    </div>

    <form
      v-if="mostrarFormulario && esAdministrador"
      class="form-card"
      @submit.prevent="guardarLaboratorio"
    >
      <h2>{{ laboratorioEditando ? 'Editar laboratorio' : 'Nuevo laboratorio' }}</h2>

      <label>Nombre</label>
      <input
        v-model="formulario.nombre_laboratorio"
        class="input"
        type="text"
        required
      />

      <label>Ubicación</label>
      <input
        v-model="formulario.ubicacion_laboratorio"
        class="input"
        type="text"
        required
      />

      <label>Capacidad</label>
      <input
        v-model="formulario.capacidad_laboratorio"
        class="input"
        type="number"
        min="1"
        required
      />

      <label>Estado</label>
      <select
        v-model="formulario.estado_laboratorio"
        class="input"
        required
      >
        <option value="disponible">Disponible</option>
        <option value="no disponible">No disponible</option>
      </select>

      <div class="form-actions">
        <button class="button" type="submit">
          {{ laboratorioEditando ? 'Actualizar' : 'Guardar' }}
        </button>

        <button
          class="button button-secondary"
          type="button"
          @click="cerrarFormulario"
        >
          Cancelar
        </button>
      </div>
    </form>

    <p v-if="cargando" class="info-message">Cargando laboratorios...</p>

    <p v-else-if="mensajeError" class="error-message">
      {{ mensajeError }}
    </p>

    <p v-if="mensajeExito" class="success-message">
      {{ mensajeExito }}
    </p>

    <div v-if="!cargando && !mensajeError" class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Ubicación</th>
            <th>Capacidad</th>
            <th>Estado</th>
            <th v-if="esAdministrador">Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="laboratorios.length === 0">
            <td :colspan="esAdministrador ? 6 : 5">
              No hay laboratorios registrados.
            </td>
          </tr>

          <tr
            v-for="laboratorio in laboratorios"
            :key="laboratorio.id_laboratorio"
          >
            <td>{{ laboratorio.id_laboratorio }}</td>
            <td>{{ laboratorio.nombre_laboratorio }}</td>
            <td>{{ laboratorio.ubicacion_laboratorio }}</td>
            <td>{{ laboratorio.capacidad_laboratorio }}</td>
            <td>{{ laboratorio.estado_laboratorio }}</td>

            <td v-if="esAdministrador">
              <div class="acciones">
                <button
                  class="btn-small"
                  type="button"
                  @click="abrirFormularioEditar(laboratorio)"
                >
                  Editar
                </button>

                <button
                  class="btn-small btn-danger"
                  type="button"
                  @click="confirmarEliminar(laboratorio.id_laboratorio)"
                >
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
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import {
  listarLaboratorios,
  crearLaboratorio,
  actualizarLaboratorio,
  eliminarLaboratorio
} from '@/services/laboratoriosService'

const auth = useAuthStore()

const laboratorios = ref([])
const cargando = ref(false)
const mensajeError = ref('')
const mensajeExito = ref('')
const mostrarFormulario = ref(false)
const laboratorioEditando = ref(null)

const formulario = ref({
  nombre_laboratorio: '',
  ubicacion_laboratorio: '',
  capacidad_laboratorio: '',
  estado_laboratorio: 'disponible'
})

const esAdministrador = computed(() => auth.rolUsuario === 'Administrador')

async function cargarLaboratorios() {
  try {
    cargando.value = true
    mensajeError.value = ''
    laboratorios.value = await listarLaboratorios()
  } catch (error) {
    mensajeError.value = error.message
  } finally {
    cargando.value = false
  }
}

function abrirFormularioNuevo() {
  limpiarMensajes()
  laboratorioEditando.value = null
  formulario.value = {
    nombre_laboratorio: '',
    ubicacion_laboratorio: '',
    capacidad_laboratorio: '',
    estado_laboratorio: 'disponible'
  }
  mostrarFormulario.value = true
}

function abrirFormularioEditar(laboratorio) {
  limpiarMensajes()
  laboratorioEditando.value = laboratorio.id_laboratorio
  formulario.value = {
    nombre_laboratorio: laboratorio.nombre_laboratorio,
    ubicacion_laboratorio: laboratorio.ubicacion_laboratorio,
    capacidad_laboratorio: laboratorio.capacidad_laboratorio,
    estado_laboratorio: laboratorio.estado_laboratorio
  }
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  laboratorioEditando.value = null
}

async function guardarLaboratorio() {
  try {
    limpiarMensajes()

    const datosLaboratorio = {
      ...formulario.value,
      capacidad_laboratorio: Number(formulario.value.capacidad_laboratorio)
    }

    if (laboratorioEditando.value) {
      await actualizarLaboratorio(laboratorioEditando.value, datosLaboratorio)
      mensajeExito.value = 'Laboratorio actualizado correctamente.'
    } else {
      await crearLaboratorio(datosLaboratorio)
      mensajeExito.value = 'Laboratorio creado correctamente.'
    }

    cerrarFormulario()
    await cargarLaboratorios()
  } catch (error) {
    mensajeError.value = error.message
  }
}

async function confirmarEliminar(idLaboratorio) {
  const confirmar = window.confirm('¿Seguro que deseas eliminar este laboratorio?')

  if (!confirmar) return

  try {
    limpiarMensajes()
    await eliminarLaboratorio(idLaboratorio)
    mensajeExito.value = 'Laboratorio eliminado correctamente.'
    await cargarLaboratorios()
  } catch (error) {
    mensajeError.value = error.message
  }
}

function limpiarMensajes() {
  mensajeError.value = ''
  mensajeExito.value = ''
}

onMounted(() => {
  cargarLaboratorios()
})
</script>