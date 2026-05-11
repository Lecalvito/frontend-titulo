import { apiRequest } from '@/services/apiService'

export function listarHistorialPorReserva(idReserva) {
  return apiRequest(`/historial-reservas/${idReserva}`)
}