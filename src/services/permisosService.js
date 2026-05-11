import { apiRequest } from '@/services/apiService'

export function listarPermisos() {
  return apiRequest('/permisos')
}