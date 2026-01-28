// script/login.js
function mostrarRegistro() {
  document.querySelector('.login-card').style.display = 'none';
  document.getElementById('cardRegistro').style.display = 'block';
}

function volverLogin() {
  document.querySelector('.login-card').style.display = 'block';
  document.getElementById('cardRegistro').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('formLogin');

    formLogin.addEventListener('submit', async function(evento) {
        evento.preventDefault();

        const emailIngresado = document.getElementById('email').value;
        const passwordIngresada = document.getElementById('password').value;

        try {
            // ✅ ENDPOINT CORRECTO según tu AuthController
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailIngresado,
                    clave: passwordIngresada
                })
            });

            if (response.ok) {
                const data = await response.json();

                // ✅ El backend devuelve { token, usuario }
                const token = data.token;
                const usuario = data.usuario;

                // Guardar en localStorage
                localStorage.setItem('jwt', token);
                localStorage.setItem('usuarioNombre', usuario.nombre);
                localStorage.setItem('usuarioApellido', usuario.apellido);
                localStorage.setItem('usuarioEmail', usuario.email);
                localStorage.setItem('usuarioRol', usuario.rol);

                // Redirigir según rol
                if (usuario.rol === 'admin') {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "user.html";
                }
            } else {
                const errorData = await response.json();
                const errorText = errorData.error || 'Error desconocido';

                if (errorText.includes("inválidas") || errorText.includes("no encontrado")) {
                    Swal.fire({
                        icon: "warning",
                        title: "Credenciales incorrectas",
                        text: "El correo o contraseña no son correctos. ¿Deseas registrarte?",
                        showCancelButton: true,
                        confirmButtonText: "Ir a registro",
                        cancelButtonText: "Cancelar",
                        confirmButtonColor: "#65ABEA",
                        cancelButtonColor: "#dc3545"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            mostrarRegistro();
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: errorText,
                        confirmButtonColor: "#65ABEA"
                    });
                }
            }
        } catch (error) {
            console.error('Error completo:', error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No se pudo conectar con el servidor. Asegúrate de que el backend esté ejecutándose en http://localhost:8080",
                confirmButtonColor: "#65ABEA"
            });
        }
    });
});