<template>
  <section class="card">
    <div class="view-header">
      <div>
        <h1>Movimientos de Stock</h1>
        <p>Registro de entradas y salidas de insumos.</p>
      </div>

      <button
        v-if="esAdministrador"
        class="button"
        @click="abrirFormulario"
      >
        Nuevo movimiento
      </button>
    </div>

    <form
      v-if="mostrarFormulario && esAdministrador"
      class="form-card"
      @submit.prevent="guardarMovimiento"
    >
      <h2>Nuevo movimiento</h2>

      <label>Insumo</label>
      <select v-model="form.det_insumo" class="input" required>
        <option value="">Seleccione insumo</option>
        <option
          v-for="insumo in insumos"
          :key="insumo.id_insumo"
          :value="insumo.id_insumo"
        >
          {{ insumo.nombre_insumo }}
        </option>
      </select>

      <label>Tipo</label>
      <select v-model="form.tipo_movimiento_stock" class="input" required>
        <option value="entrada">Entrada</option>
        <option value="salida">Salida</option>
      </select>

      <label>Cantidad</label>
      <input v-model="form.cantidad_movimiento_stock" type="number" class="input" required />

      <label>Motivo</label>
      <input v-model="form.motivo_movimiento_stock" class="input" required />

      <label>Referencia</label>
      <input v-model="form.referencia_movimiento_stock" class="input" />

      <div class="form-actions">
        <button class="button">Guardar</button>
        <button type="button" class="button button-secondary" @click="cerrarFormulario">
          Cancelar
        </button>
      </div>
    </form>

    <p v-if="cargando" class="info-message">Cargando movimientos...</p>
    <p v-if="error" class="error-message">{{ error }}</p>

    <div v-if="!cargando && !error" class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Insumo</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Referencia</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="movimientos.length === 0">
            <td colspan="7">No hay movimientos registrados.</td>
          </tr>

          <tr v-for="m in movimientos" :key="m.id_movimiento_stock">
            <td>{{ m.id_movimiento_stock }}</td>
            <td>{{ m.nombre_insumo }}</td>
            <td>
              <span :class="['estado', m.tipo_movimiento_stock === 'entrada' ? 'estado-aprobada' : 'estado-rechazada']">
                {{ m.tipo_movimiento_stock }}
              </span>
            </td>
            <td>{{ m.cantidad_movimiento_stock }}</td>
            <td>{{ formatearFecha(m.fecha_movimiento_stock) }}</td>
            <td>{{ m.motivo_movimiento_stock }}</td>
            <td>{{ m.referencia_movimiento_stock || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { listarMovimientosStock, crearMovimientoStock } from '@/services/movimientosStockService'
import { listarInsumos } from '@/services/insumosService'

const auth = useAuthStore()

const movimientos = ref([])
const insumos = ref([])
const cargando = ref(false)
const error = ref('')
const mostrarFormulario = ref(false)

const form = ref({
  det_insumo: '',
  tipo_movimiento_stock: 'entrada',
  cantidad_movimiento_stock: 1,
  motivo_movimiento_stock: '',
  referencia_movimiento_stock: ''
})

const esAdministrador = computed(() => auth.rolUsuario === 'Administrador')

async function cargar() {
  try {
    cargando.value = true
    error.value = ''
    movimientos.value = await listarMovimientosStock()
    insumos.value = await listarInsumos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function abrirFormulario() {
  mostrarFormulario.value = true
}

function cerrarFormulario() {
  mostrarFormulario.value = false
}

async function guardarMovimiento() {
  try {
    error.value = ''
    await crearMovimientoStock({
      ...form.value,
      cantidad_movimiento_stock: Number(form.value.cantidad_movimiento_stock)
    })
    cerrarFormulario()
    await cargar()
  } catch (e) {
    error.value = e.message
  }
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString('es-CL')
}

onMounted(cargar)
</script>