const API_URL = 'https://backend-titulo-nevk.onrender.com/'

export async function iniciarSesion(correo_usuario, password_usuario) {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      correo_usuario,
      password_usuario
    })
  })

  const datos = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'Error al iniciar sesión')
  }

  return datos
}
