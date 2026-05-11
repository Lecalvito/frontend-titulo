<template>
  <section class="card">
    <div class="view-header">
      <div>
        <h1>Historial de Reserva #{{ idReserva }}</h1>
        <p>Registro de cambios de estado de la reserva seleccionada.</p>
      </div>

      <button class="button button-secondary" type="button" @click="volverReservas">
        Volver
      </button>
    </div>

    <p v-if="cargando" class="info-message">Cargando historial...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-if="!cargando && !error" class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Estado anterior</th>
            <th>Estado nuevo</th>
            <th>Observación</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="historial.length === 0">
            <td colspan="4">No hay historial disponible.</td>
          </tr>

          <tr v-for="item in historial" :key="item.id_historial_reserva">
            <td>{{ formatearFecha(item.fecha_cambio_historial_reserva) }}</td>
            <td>{{ item.estado_anterior_historial_reserva }}</td>
            <td>
              <span :class="['estado', claseEstado(item.estado_nuevo_historial_reserva)]">
                {{ item.estado_nuevo_historial_reserva }}
              </span>
            </td>
            <td>{{ item.observacion_historial_reserva || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { listarHistorialPorReserva } from '@/services/historialReservasService'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()


const idReserva = route.params.idReserva
const historial = ref([])
const cargando = ref(false)
const error = ref('')

async function cargar() {
  try {
    cargando.value = true
    error.value = ''
    historial.value = await listarHistorialPorReserva(idReserva)
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function volverReservas() {
  if (auth.rolUsuario === 'Docente') {
    router.push('/mis-reservas')
  } else {
    router.push('/reservas')
  }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString('es-CL')
}

function claseEstado(estado) {
  if (estado === 'aprobada') return 'estado-aprobada'
  if (estado === 'rechazada') return 'estado-rechazada'
  return 'estado-pendiente'
}

onMounted(cargar)
</script>