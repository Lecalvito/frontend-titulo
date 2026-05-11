import { apiRequest } from '@/services/apiService'

export function listarMovimientosStock() {
  return apiRequest('/movimientos-stock')
}

export function obtenerMovimientoStock(id) {
  return apiRequest(`/movimientos-stock/${id}`)
}

export function crearMovimientoStock(datos) {
  return apiRequest('/movimientos-stock', {
    method: 'POST',
    body: JSON.stringify(datos)
  })
}