import { apiRequest } from '@/services/apiService'

export function listarReservas() {
  return apiRequest('/reservas')
}

export function obtenerReserva(id) {
  return apiRequest(`/reservas/${id}`)
}

export function crearReserva(formData) {
  return apiRequest('/reservas', {
    method: 'POST',
    body: formData
  })
}

export function actualizarReserva(id, formData) {
  return apiRequest(`/reservas/${id}`, {
    method: 'PUT',
    body: formData
  })
}

export function cambiarEstadoReserva(id, datos) {
  return apiRequest(`/reservas/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify(datos)
  })
}

export function eliminarReserva(id) {
  return apiRequest(`/reservas/${id}`, {
    method: 'DELETE'
  })
}