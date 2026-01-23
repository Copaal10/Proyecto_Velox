// script/login.js
function mostrarRegistro() {
  document.querySelector('.login-card').style.display = 'none';
  document.getElementById('cardRegistro').style.display = 'block';
}

function volverLogin() {
  document.querySelector('.login-card').style.display = 'block';
  document.getElementById('cardRegistro').style.display = 'none';
}



// Esperamos a que todo el HTML esté cargado antes de ejecutar el JS
document.addEventListener('DOMContentLoaded', function() {

    // 1. Seleccionamos el formulario por su ID
    const formLogin = document.getElementById('formLogin');

    // 2. Escuchamos el evento cuando el usuario hace clic en "Ingresar" (Submit)
    formLogin.addEventListener('submit', function(evento) {

        // IMPORTANTE: Esto evita que la página se recargue automáticamente
        evento.preventDefault();

        // 3. Obtenemos lo que el usuario escribió
        const emailIngresado = document.getElementById('email').value;
        const passwordIngresada = document.getElementById('password').value;

        // ==========================================================
        // LÓGICA DE VALIDACIÓN (La "Función" que mencionas)
        // ==========================================================
        
        // Definimos cuál es el correo del ADMIN
        const correoAdmin = "admin@velox.com";
        const passAdmin   = "admin123"; // Pon aquí la contraseña que quieras para admin

        // Definimos cuál es el correo del USUARIO normal
        const correoUser = "usuario@velox.com";
        const passUser   = "user123";  // Pon aquí la contraseña para usuario

        // CONDICIONAL: Si el correo coincide con el de Admin...
        if (emailIngresado === correoAdmin && passwordIngresada === passAdmin) {
            
            // A. (Opcional) Guardamos el rol en localStorage para que otras páginas sepan quién es
            localStorage.setItem('usuarioRol', 'admin');

            // B. Redirigimos a la página de Admin
            // Asegúrate de que tengas un archivo llamado admin.html en tu carpeta
            window.location.href = "admin.html"; 
        
        } 
        // Si el correo coincide con el de Usuario...
        else if (emailIngresado === correoUser && passwordIngresada === passUser) {
            
            // A. Guardamos rol en localStorage
            localStorage.setItem('usuarioRol', 'user');

            // B. Redirigimos a la página de Usuario
            window.location.href = "user.html";

        } 
        // Si no coincide ninguno...
        else {
            const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
Toast.fire({
  icon: "error",
  title: "Error: Correo o contraseña incorrectos."
});
            
        }
    });
});