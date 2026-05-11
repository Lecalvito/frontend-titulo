<template>
  <section class="card">
    <div class="view-header">
      <div>
        <h1>{{ esDocente ? 'Mis Reservas' : 'Reservas' }}</h1>
        <p>Listado de reservas de laboratorios de simulación clínica.</p>
      </div>

      <button
        v-if="puedeCrearReserva"
        class="button"
        type="button"
        @click="abrirFormularioNuevo"
      >
        Nueva reserva
      </button>
    </div>

    <form
      v-if="mostrarFormulario && puedeCrearReserva"
      class="form-card"
      @submit.prevent="guardarReserva"
    >
      <h2>{{ reservaEditando ? 'Editar reserva' : 'Nueva reserva' }}</h2>

      <label>Asignatura</label>
      <input v-model="formulario.asignatura_reserva" class="input" type="text" required />

      <label>Sección</label>
      <input v-model="formulario.seccion_reserva" class="input" type="text" />

      <label>Laboratorio</label>
      <select v-model="formulario.det_laboratorio" class="input" required>
        <option value="">Seleccione laboratorio</option>
        <option
          v-for="laboratorio in laboratorios"
          :key="laboratorio.id_laboratorio"
          :value="laboratorio.id_laboratorio"
        >
          {{ laboratorio.nombre_laboratorio }}
        </option>
      </select>

      <label>Fecha</label>
      <input
        v-model="formulario.fecha_reserva"
        class="input"
        type="date"
        :min="fechaMinimaReserva"
        required
      />

      <label>Hora inicio</label>
      <input v-model="formulario.hora_inicio_reserva" class="input" type="time" required />

      <label>Hora fin</label>
      <input v-model="formulario.hora_fin_reserva" class="input" type="time" required />

      <label>Tipo de fidelidad</label>
      <select v-model="formulario.tipo_fidelidad_reserva" class="input" required>
        <option value="">Seleccione tipo</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>

      <label>Documento de planificación</label>
      <input class="input" type="file" @change="seleccionarArchivo" />

      <div class="form-actions">
        <button class="button" type="submit">
          {{ reservaEditando ? 'Actualizar' : 'Guardar' }}
        </button>

        <button class="button button-secondary" type="button" @click="cerrarFormulario">
          Cancelar
        </button>
      </div>
    </form>

    <section v-if="mostrarPanelInsumos" class="form-card">
      <div class="panel-header">
        <div>
          <h2>Insumos de reserva #{{ reservaSeleccionada?.id_reserva }}</h2>
          <p>{{ reservaSeleccionada?.asignatura_reserva }}</p>
        </div>

        <button class="button button-secondary" type="button" @click="cerrarPanelInsumos">
          Cerrar
        </button>
      </div>

      <form
        v-if="puedeGestionarInsumos"
        class="insumo-form"
        @submit.prevent="guardarInsumoReserva"
      >
        <label>Insumo</label>
        <select
          v-model="formInsumo.det_insumo"
          class="input"
          :disabled="insumoEditando"
          required
        >
          <option value="">Seleccione insumo</option>
          <option
            v-for="insumo in insumos"
            :key="insumo.id_insumo"
            :value="insumo.id_insumo"
          >
            {{ insumo.nombre_insumo }} - Stock: {{ insumo.stock_actual_insumo }}
          </option>
        </select>

        <label>Cantidad solicitada</label>
        <input
          v-model="formInsumo.cantidad_solicitada_reserva_insumo"
          class="input"
          type="number"
          min="1"
          required
        />

        <label>Observación</label>
        <input
          v-model="formInsumo.observacion_reserva_insumo"
          class="input"
          type="text"
        />

        <div class="form-actions">
          <button class="button" type="submit">
            {{ insumoEditando ? 'Actualizar insumo' : 'Agregar insumo' }}
          </button>

          <button
            v-if="insumoEditando"
            class="button button-secondary"
            type="button"
            @click="limpiarFormularioInsumo"
          >
            Cancelar edición
          </button>
        </div>
      </form>

      <div class="table-wrapper">
        <table class="table">
          <thead>
            <tr>
              <th>Insumo</th>
              <th>Unidad</th>
              <th>Stock actual</th>
              <th>Cantidad solicitada</th>
              <th>Observación</th>
              <th v-if="puedeGestionarInsumos">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-if="insumosReserva.length === 0">
              <td :colspan="puedeGestionarInsumos ? 6 : 5">
                No hay insumos asociados a esta reserva.
              </td>
            </tr>

            <tr v-for="item in insumosReserva" :key="`${item.det_reserva}-${item.det_insumo}`">
              <td>{{ item.nombre_insumo }}</td>
              <td>{{ item.unidad_medida_insumo }}</td>
              <td>{{ item.stock_actual_insumo }}</td>
              <td>{{ item.cantidad_solicitada_reserva_insumo }}</td>
              <td>{{ item.observacion_reserva_insumo || 'Sin observación' }}</td>

              <td v-if="puedeGestionarInsumos">
                <div class="acciones">
                  <button class="btn-small" type="button" @click="editarInsumoReserva(item)">
                    Editar
                  </button>

                  <button class="btn-small btn-danger" type="button" @click="confirmarEliminarInsumo(item)">
                    Quitar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <p v-if="cargando" class="info-message">Cargando reservas...</p>
    <p v-if="mensajeError" class="error-message">{{ mensajeError }}</p>
    <p v-if="mensajeExito" class="success-message">{{ mensajeExito }}</p>

    <div v-if="!cargando" class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Asignatura</th>
            <th>Laboratorio</th>
            <th>Docente</th>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="reservasFiltradas.length === 0">
            <td colspan="8">No hay reservas registradas.</td>
          </tr>

          <tr v-for="reserva in reservasFiltradas" :key="reserva.id_reserva">
            <td>{{ reserva.id_reserva }}</td>
            <td>{{ reserva.asignatura_reserva }}</td>
            <td>{{ reserva.nombre_laboratorio }}</td>
            <td>{{ reserva.nombre_usuario }}</td>
            <td>{{ formatearFecha(reserva.fecha_reserva) }}</td>
            <td>{{ reserva.hora_inicio_reserva }} - {{ reserva.hora_fin_reserva }}</td>
            <td>
              <span :class="['estado', claseEstado(reserva.estado_actual_reserva)]">
                {{ reserva.estado_actual_reserva }}
              </span>
            </td>

            <td>
              <div class="acciones">
                <button class="btn-small" type="button" @click="abrirPanelInsumos(reserva)">
                  Insumos
                </button>

                <button
                  class="btn-small"
                  type="button"
                  @click="verHistorial(reserva.id_reserva)"
                >
                  Historial
                </button>

                <button
                  v-if="puedeEditarReserva(reserva)"
                  class="btn-small"
                  type="button"
                  @click="abrirFormularioEditar(reserva)"
                >
                  Editar
                </button>

                <button
                  v-if="esAdministrador"
                  class="btn-small btn-success"
                  type="button"
                  @click="actualizarEstado(reserva.id_reserva, 'aprobada')"
                >
                  Aprobar
                </button>

                <button
                  v-if="esAdministrador"
                  class="btn-small btn-warning"
                  type="button"
                  @click="actualizarEstado(reserva.id_reserva, 'rechazada')"
                >
                  Rechazar
                </button>

                <button
                  v-if="esAdministrador"
                  class="btn-small btn-danger"
                  type="button"
                  @click="confirmarEliminar(reserva.id_reserva)"
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { listarLaboratorios } from '@/services/laboratoriosService'
import { listarInsumos } from '@/services/insumosService'
import {
  listarReservas,
  crearReserva,
  actualizarReserva,
  cambiarEstadoReserva,
  eliminarReserva
} from '@/services/reservasService'
import {
  listarInsumosPorReserva,
  agregarInsumoAReserva,
  actualizarInsumoReserva,
  eliminarInsumoDeReserva
} from '@/services/reservaInsumosService'

const auth = useAuthStore()
const router = useRouter()

const reservas = ref([])
const laboratorios = ref([])
const insumos = ref([])
const insumosReserva = ref([])

const cargando = ref(false)
const mensajeError = ref('')
const mensajeExito = ref('')

const mostrarFormulario = ref(false)
const reservaEditando = ref(null)
const archivoPlanificacion = ref(null)

const mostrarPanelInsumos = ref(false)
const reservaSeleccionada = ref(null)
const insumoEditando = ref(false)

const fechaMinimaReserva = computed(() => {
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
})

const formulario = ref({
  asignatura_reserva: '',
  seccion_reserva: '',
  fecha_reserva: '',
  hora_inicio_reserva: '',
  hora_fin_reserva: '',
  tipo_fidelidad_reserva: '',
  estado_actual_reserva: 'pendiente',
  det_laboratorio: '',
  det_usuario: auth.usuario?.id_usuario || ''
})

const formInsumo = ref({
  det_insumo: '',
  cantidad_solicitada_reserva_insumo: 1,
  observacion_reserva_insumo: ''
})

const esAdministrador = computed(() => auth.rolUsuario === 'Administrador')
const esDocente = computed(() => auth.rolUsuario === 'Docente')
const puedeCrearReserva = computed(() => esAdministrador.value || esDocente.value)

const puedeGestionarInsumos = computed(() => {
  if (!reservaSeleccionada.value) return false
  if (esAdministrador.value) return true

  return esDocente.value &&
    reservaSeleccionada.value.det_usuario === auth.usuario?.id_usuario &&
    reservaSeleccionada.value.estado_actual_reserva === 'pendiente'
})

const reservasFiltradas = computed(() => {
  if (esDocente.value) {
    return reservas.value.filter((reserva) => reserva.det_usuario === auth.usuario?.id_usuario)
  }

  return reservas.value
})

async function cargarDatos() {
  try {
    cargando.value = true
    limpiarMensajes()

    const [reservasData, laboratoriosData, insumosData] = await Promise.all([
      listarReservas(),
      listarLaboratorios(),
      listarInsumos()
    ])

    reservas.value = reservasData
    laboratorios.value = laboratoriosData
    insumos.value = insumosData
  } catch (error) {
    mensajeError.value = error.message
  } finally {
    cargando.value = false
  }
}

function abrirFormularioNuevo() {
  limpiarMensajes()
  reservaEditando.value = null
  archivoPlanificacion.value = null

  formulario.value = {
    asignatura_reserva: '',
    seccion_reserva: '',
    fecha_reserva: '',
    hora_inicio_reserva: '',
    hora_fin_reserva: '',
    tipo_fidelidad_reserva: '',
    estado_actual_reserva: 'pendiente',
    det_laboratorio: '',
    det_usuario: auth.usuario?.id_usuario || ''
  }

  mostrarFormulario.value = true
}

function abrirFormularioEditar(reserva) {
  limpiarMensajes()
  reservaEditando.value = reserva.id_reserva
  archivoPlanificacion.value = null

  formulario.value = {
    asignatura_reserva: reserva.asignatura_reserva,
    seccion_reserva: reserva.seccion_reserva || '',
    fecha_reserva: normalizarFechaInput(reserva.fecha_reserva),
    hora_inicio_reserva: reserva.hora_inicio_reserva,
    hora_fin_reserva: reserva.hora_fin_reserva,
    tipo_fidelidad_reserva: reserva.tipo_fidelidad_reserva,
    estado_actual_reserva: reserva.estado_actual_reserva,
    det_laboratorio: reserva.det_laboratorio,
    det_usuario: reserva.det_usuario
  }

  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
  reservaEditando.value = null
  archivoPlanificacion.value = null
}

function seleccionarArchivo(evento) {
  archivoPlanificacion.value = evento.target.files[0] || null
}

function construirFormData() {
  const formData = new FormData()

  formData.append('asignatura_reserva', formulario.value.asignatura_reserva)
  formData.append('seccion_reserva', formulario.value.seccion_reserva)
  formData.append('fecha_reserva', formulario.value.fecha_reserva)
  formData.append('hora_inicio_reserva', formulario.value.hora_inicio_reserva)
  formData.append('hora_fin_reserva', formulario.value.hora_fin_reserva)
  formData.append('tipo_fidelidad_reserva', formulario.value.tipo_fidelidad_reserva)
  formData.append('estado_actual_reserva', formulario.value.estado_actual_reserva)
  formData.append('det_laboratorio', formulario.value.det_laboratorio)
  formData.append('det_usuario', formulario.value.det_usuario)

  if (archivoPlanificacion.value) {
    formData.append('documento_planificacion', archivoPlanificacion.value)
  }

  return formData
}

function validarFechaReserva() {
  if (!formulario.value.fecha_reserva) {
    mensajeError.value = 'Debe seleccionar una fecha para la reserva.'
    return false
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)

  const [anio, mes, dia] = formulario.value.fecha_reserva.split('-').map(Number)
  const fechaReserva = new Date(anio, mes - 1, dia)
  fechaReserva.setHours(0, 0, 0, 0)

  if (fechaReserva < hoy) {
    mensajeError.value = 'La fecha de reserva no puede ser anterior a la fecha actual.'
    return false
  }

  return true
}

async function guardarReserva() {
  try {
    limpiarMensajes()

    if (!validarFechaReserva()) return

    const formData = construirFormData()

    if (reservaEditando.value) {
      await actualizarReserva(reservaEditando.value, formData)
      mensajeExito.value = 'Reserva actualizada correctamente.'
    } else {
      await crearReserva(formData)
      mensajeExito.value = 'Reserva creada correctamente.'
    }

    cerrarFormulario()
    await cargarDatos()
  } catch (error) {
    mensajeError.value = error.message
  }
}

async function abrirPanelInsumos(reserva) {
  try {
    limpiarMensajes()
    reservaSeleccionada.value = reserva
    mostrarPanelInsumos.value = true
    limpiarFormularioInsumo()
    insumosReserva.value = await listarInsumosPorReserva(reserva.id_reserva)
  } catch (error) {
    mensajeError.value = error.message
  }
}

function cerrarPanelInsumos() {
  mostrarPanelInsumos.value = false
  reservaSeleccionada.value = null
  insumosReserva.value = []
  limpiarFormularioInsumo()
}

function limpiarFormularioInsumo() {
  insumoEditando.value = false
  formInsumo.value = {
    det_insumo: '',
    cantidad_solicitada_reserva_insumo: 1,
    observacion_reserva_insumo: ''
  }
}

function editarInsumoReserva(item) {
  insumoEditando.value = true
  formInsumo.value = {
    det_insumo: item.det_insumo,
    cantidad_solicitada_reserva_insumo: item.cantidad_solicitada_reserva_insumo,
    observacion_reserva_insumo: item.observacion_reserva_insumo || ''
  }
}

async function guardarInsumoReserva() {
  try {
    limpiarMensajes()

    const datos = {
      det_reserva: reservaSeleccionada.value.id_reserva,
      det_insumo: formInsumo.value.det_insumo,
      cantidad_solicitada_reserva_insumo: Number(formInsumo.value.cantidad_solicitada_reserva_insumo),
      observacion_reserva_insumo: formInsumo.value.observacion_reserva_insumo
    }

    if (insumoEditando.value) {
      await actualizarInsumoReserva(datos)
      mensajeExito.value = 'Insumo actualizado en la reserva.'
    } else {
      await agregarInsumoAReserva(datos)
      mensajeExito.value = 'Insumo agregado a la reserva.'
    }

    limpiarFormularioInsumo()
    insumosReserva.value = await listarInsumosPorReserva(reservaSeleccionada.value.id_reserva)
    await cargarDatos()
  } catch (error) {
    mensajeError.value = error.message
  }
}

async function confirmarEliminarInsumo(item) {
  const confirmar = window.confirm('¿Seguro que deseas quitar este insumo de la reserva?')

  if (!confirmar) return

  try {
    limpiarMensajes()

    await eliminarInsumoDeReserva({
      det_reserva: item.det_reserva,
      det_insumo: item.det_insumo
    })

    mensajeExito.value = 'Insumo quitado de la reserva.'
    insumosReserva.value = await listarInsumosPorReserva(reservaSeleccionada.value.id_reserva)
    await cargarDatos()
  } catch (error) {
    mensajeError.value = error.message
  }
}

async function actualizarEstado(idReserva, estadoNuevo) {
  const observacion = window.prompt('Ingrese una observación para el cambio de estado:')

  try {
    limpiarMensajes()

    await cambiarEstadoReserva(idReserva, {
      estado_nuevo_reserva: estadoNuevo,
      observacion_historial_reserva: observacion || null
    })

    mensajeExito.value = `Reserva ${estadoNuevo} correctamente.`
    await cargarDatos()
  } catch (error) {
    mensajeError.value = error.message
  }
}

async function confirmarEliminar(idReserva) {
  const confirmar = window.confirm('¿Seguro que deseas eliminar esta reserva?')

  if (!confirmar) return

  try {
    limpiarMensajes()
    await eliminarReserva(idReserva)
    mensajeExito.value = 'Reserva eliminada correctamente.'
    await cargarDatos()
  } catch (error) {
    mensajeError.value = error.message
  }
}

function verHistorial(idReserva) {
  router.push(`/historial-reservas/${idReserva}`)
}

function puedeEditarReserva(reserva) {
  if (esAdministrador.value) return true

  return esDocente.value &&
    reserva.det_usuario === auth.usuario?.id_usuario &&
    reserva.estado_actual_reserva === 'pendiente'
}

function claseEstado(estado) {
  if (estado === 'aprobada') return 'estado-aprobada'
  if (estado === 'rechazada') return 'estado-rechazada'
  if (estado === 'cancelada') return 'estado-rechazada'
  return 'estado-pendiente'
}

function formatearFecha(fecha) {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-CL')
}

function normalizarFechaInput(fecha) {
  if (!fecha) return ''
  return String(fecha).slice(0, 10)
}

function limpiarMensajes() {
  mensajeError.value = ''
  mensajeExito.value = ''
}

onMounted(() => {
  cargarDatos()
})
</script>