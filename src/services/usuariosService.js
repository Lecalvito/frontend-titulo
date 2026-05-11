import { apiRequest } from '@/services/apiService'

export function listarUsuarios() {
  return apiRequest('/usuarios')
}

export function crearUsuario(datos) {
  return apiRequest('/usuarios', {
    method: 'POST',
    body: JSON.stringify(datos)
  })
}

export function actualizarUsuario(id, datos) {
  return apiRequest(`/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos)
  })
}

export function eliminarUsuario(id) {
  return apiRequest(`/usuarios/${id}`, {
    method: 'DELETE'
  })
}