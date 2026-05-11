const API_URL = 'http://localhost:3000/api'

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token')

  const headers = {
    ...(options.headers || {})
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const respuesta = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    throw new Error(datos?.mensaje || 'Error en la solicitud')
  }

  return datos
}