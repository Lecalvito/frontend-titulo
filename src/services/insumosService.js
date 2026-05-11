import { apiRequest } from '@/services/apiService'

export function listarInsumos() {
  return apiRequest('/insumos')
}

export function obtenerInsumo(id) {
  return apiRequest(`/insumos/${id}`)
}

export function crearInsumo(datos) {
  return apiRequest('/insumos', {
    method: 'POST',
    body: JSON.stringify(datos)
  })
}

export function actualizarInsumo(id, datos) {
  return apiRequest(`/insumos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos)
  })
}

export function eliminarInsumo(id) {
  return apiRequest(`/insumos/${id}`, {
    method: 'DELETE'
  })
}