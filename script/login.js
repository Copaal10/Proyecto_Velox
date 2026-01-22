// script/login.js

// Funciones para alternar entre Login y Registro
function mostrarRegistro() {
  document.querySelector('.login-card').style.display = 'none';
  document.getElementById('cardRegistro').style.display = 'block';
}

function volverLogin() {
  document.querySelector('.login-card').style.display = 'block';
  document.getElementById('cardRegistro').style.display = 'none';
}

// Lógica de Login conectado al Backend
document.addEventListener('DOMContentLoaded', function() {

    const formLogin = document.getElementById('formLogin');

    formLogin.addEventListener('submit', async function(evento) {

        evento.preventDefault(); // Evita recarga de página

        // 1. Obtener datos del HTML
        const emailIngresado = document.getElementById('email').value;
        const passwordIngresada = document.getElementById('password').value;

        // 2. Enviar datos al Backend Java
        try {
            const respuesta = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // IMPORTANTE: El backend espera 'clave', no 'password'
                body: JSON.stringify({
                    email: emailIngresado,
                    clave: passwordIngresada
                })
            });

            // 3. Manejar la respuesta
            if (respuesta.ok) {
                const data = await respuesta.json();

                // A. Guardar el Token y el Rol en el navegador
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuarioRol', data.rol); // Será 'admin' o 'cliente'
                localStorage.setItem('usuarioEmail', data.email);

                // B. Mensaje de éxito y Redirección
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: `Has iniciado sesión como ${data.rol}`,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // C. Redirigir según el rol que devolvió la base de datos
                    if (data.rol === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        // Si es cliente, lo mandamos al inicio o a su perfil
                        window.location.href = 'user.html';
                    }
                });

            } else {
                // Si el usuario o contraseña son incorrectos (Error 401 u otro)
                Swal.fire({
                    icon: 'error',
                    title: 'Error de acceso',
                    text: 'Correo o contraseña incorrectos. Inténtalo de nuevo.'
                });
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Asegúrate de que el backend esté encendido.'
            });
        }
    });
});