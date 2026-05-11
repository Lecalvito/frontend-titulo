import { apiRequest } from '@/services/apiService'

export function listarLaboratorios() {
  return apiRequest('/laboratorios')
}

export function obtenerLaboratorio(id) {
  return apiRequest(`/laboratorios/${id}`)
}

export function crearLaboratorio(datosLaboratorio) {
  return apiRequest('/laboratorios', {
    method: 'POST',
    body: JSON.stringify(datosLaboratorio)
  })
}

export function actualizarLaboratorio(id, datosLaboratorio) {
  return apiRequest(`/laboratorios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datosLaboratorio)
  })
}

export function eliminarLaboratorio(id) {
  return apiRequest(`/laboratorios/${id}`, {
    method: 'DELETE'
  })
}