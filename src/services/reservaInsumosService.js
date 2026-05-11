import { apiRequest } from '@/services/apiService'

export function listarInsumosPorReserva(idReserva) {
  return apiRequest(`/reserva-insumos/${idReserva}`)
}

export function agregarInsumoAReserva(datos) {
  return apiRequest('/reserva-insumos', {
    method: 'POST',
    body: JSON.stringify(datos)
  })
}

export function actualizarInsumoReserva(datos) {
  return apiRequest('/reserva-insumos', {
    method: 'PUT',
    body: JSON.stringify(datos)
  })
}

export function eliminarInsumoDeReserva(datos) {
  return apiRequest('/reserva-insumos', {
    method: 'DELETE',
    body: JSON.stringify(datos)
  })
}