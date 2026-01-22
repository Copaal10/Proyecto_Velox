
const notasTexto = document.getElementById('notasTexto');

window.addEventListener('load', () => {
  const notasGuardadas = localStorage.getItem('velox-notas-admin');
  if (notasGuardadas) {
    notasTexto.value = notasGuardadas;
  }
});

document.getElementById('btnGuardarNotas')?.addEventListener('click', () => {
  localStorage.setItem('velox-notas-admin', notasTexto.value);
  const btn = document.getElementById('btnGuardarNotas');
  const textoOriginal = btn.innerHTML;
  btn.innerHTML = '<i class="bi bi-check-circle"></i> ¡Guardado!';
  btn.classList.add('btn-success');
  btn.classList.remove('btn-velox');
  setTimeout(() => {
    btn.innerHTML = textoOriginal;
    btn.classList.remove('btn-success');
    btn.classList.add('btn-velox');
  }, 2000);
});

document.getElementById('btnLimpiarNotas')?.addEventListener('click', () => {
  if (confirm('¿Deseas limpiar todas las notas?')) {
    notasTexto.value = '';
    localStorage.removeItem('velox-notas-admin');
  }
});

// --- NAVEGACIÓN ENTRE SECCIONES ---
document.querySelectorAll('[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('[data-section]').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const sectionId = link.getAttribute('data-section');
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            sectionElement.classList.add('active');
            // Si entramos a la sección usuarios, cargamos la lista
            if (sectionId === 'usuarios') {
                cargarUsuarios();
            }
        }
    });
});

// --- CERRAR SESIÓN ---
document.getElementById('btnCerrarSesion')?.addEventListener('click', () => {
    if (confirm('¿Deseas cerrar sesión?')) {
        localStorage.removeItem('token'); // Importante: Borrar el token
        window.location.href = '../html/login.html'; // Ruta correcta para salir
    }
});

// --- GESTIÓN DE USUARIOS (CRUD) ---

// 1. Función Global para listar (Necesaria para el onclick del HTML)
async function cargarUsuarios() {
    console.log("📊 Cargando usuarios...");
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('tablaUsuariosBody');

    if (!token) {
        console.error("❌ No hay token, redirigiendo...");
        window.location.href = '../html/login.html';
        return;
    }

    try {
        const respuesta = await fetch('http://localhost:8080/api/admin/usuarios', {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (respuesta.ok) {
            const usuarios = await respuesta.json();
            console.log("✅ Usuarios recibidos:", usuarios);
            tbody.innerHTML = '';

            if (usuarios.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay usuarios registrados</td></tr>';
            } else {
                usuarios.forEach(user => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.id_usuario}</td>
                        <td>${user.email}</td>
                        <td><span class="badge bg-${user.rol === 'admin' ? 'danger' : 'primary'}">${user.rol}</span></td>
                        <td>${user.nombre} ${user.apellido}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${user.id_usuario})">
                                <i class="bi bi-trash"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                });
            }
        } else {
            console.error("❌ Error cargando usuarios:", respuesta.status);
        }
    } catch (error) {
        console.error("❌ Error de red:", error);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
}

// 2. Evento para Crear Usuario
const formCrearUsuario = document.getElementById('formCrearUsuario');
if (formCrearUsuario) {
    formCrearUsuario.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const nuevoUsuario = {
            email: document.getElementById('nuevoEmail').value,
            nombre: document.getElementById('nuevoNombre').value,
            apellido: document.getElementById('nuevoApellido').value,
            clave: document.getElementById('nuevaClave').value,
            rol: document.getElementById('nuevoRol').value
        };

        try {
            const respuesta = await fetch('http://localhost:8080/api/admin/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(nuevoUsuario)
            });

            if (respuesta.ok) {
                Swal.fire('¡Creado!', 'Usuario creado exitosamente', 'success');
                formCrearUsuario.reset();
                cargarUsuarios();
            } else {
                const errorTexto = await respuesta.text();
                console.error("Error del backend:", errorTexto);
                Swal.fire('Error del Servidor', errorTexto, 'error');
            }
        } catch (error) {
            console.error("Error de red:", error);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    });
}

// 3. Función Global para Eliminar (Para el botón en la tabla HTML)
window.eliminarUsuario = async function(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    const token = localStorage.getItem('token');

    try {
        const respuesta = await fetch(`http://localhost:8080/api/admin/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (respuesta.ok) {
            Swal.fire('Eliminado', 'Usuario eliminado', 'success');
            cargarUsuarios();
        } else {
            const errorTexto = await respuesta.text();
            console.error("Error al eliminar:", errorTexto);
            Swal.fire('Error', 'No se pudo eliminar: ' + errorTexto, 'error');
        }
    } catch (error) {
        console.error("Error de red:", error);
        Swal.fire('Error', 'Error de conexión', 'error');
    }
};