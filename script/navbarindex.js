document.addEventListener('DOMContentLoaded', function() {
    actualizarNavbar();
});

function actualizarNavbar() {
    const token = localStorage.getItem('jwt');
    const nombre = localStorage.getItem('usuarioNombre');
    const apellido = localStorage.getItem('usuarioApellido');
    const rol = localStorage.getItem('usuarioRol');

    // Buscar el elemento del navbar que dice "Iniciar Sesión"
    const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navbarLinks.forEach(link => {
        if (link.textContent.includes('Iniciar Sesión')) {
            if (token && nombre && apellido && rol) {
                // Usuario autenticado - mostrar nombre CLICKEABLE y botón de cerrar sesión

                // Determinar URL según el rol (ruta desde index.html)
                const dashboardUrl = rol === 'admin' ? 'html/admin.html' : 'html/user.html';

                link.innerHTML = `<i class="bi bi-person-circle"></i> ${nombre} ${apellido}`;
                link.href = dashboardUrl;
                link.style.cursor = "pointer";
                link.title = `Ir a mi panel (${rol})`;

                // Agregar botón de cerrar sesión al lado
                const liParent = link.parentElement;
                const navUl = liParent.parentElement;

                // Verificar si ya existe el botón de cerrar sesión
                if (!document.getElementById('btn-logout')) {
                    const logoutLi = document.createElement('li');
                    logoutLi.className = 'nav-item';
                    logoutLi.innerHTML = `
                        <a class="nav-link text-dark fw-bold" href="#" id="btn-logout">
                            <i class="bi bi-box-arrow-right"></i> Cerrar Sesión
                        </a>
                    `;
                    navUl.appendChild(logoutLi);

                    // Agregar evento de cerrar sesión
                    document.getElementById('btn-logout').addEventListener('click', function(e) {
                        e.preventDefault();
                        cerrarSesion();
                    });
                }
            } else {
                // Usuario no autenticado - mostrar "Iniciar Sesión"
                link.innerHTML = '<i class="bi bi-person-circle"></i> Iniciar Sesión';
                link.href = 'html/login.html';

                // Eliminar botón de cerrar sesión si existe
                const logoutBtn = document.getElementById('btn-logout');
                if (logoutBtn) {
                    logoutBtn.parentElement.remove();
                }
            }
        }
    });
}

function cerrarSesion() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: "Serás redirigido a la página principal",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#65ABEA',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar localStorage
            localStorage.removeItem('jwt');
            localStorage.removeItem('usuarioNombre');
            localStorage.removeItem('usuarioApellido');
            localStorage.removeItem('usuarioEmail');
            localStorage.removeItem('usuarioRol');
            localStorage.removeItem('velox-token');
            localStorage.removeItem('velox-usuario');

            Swal.fire({
                icon: 'success',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión correctamente',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                window.location.href = 'index.html';
            });
        }
    });
}