// ==========================================
// LÓGICA PARA GESTIÓN DE USUARIOS
// Conexión al Backend Spring Boot
// ==========================================

const API_URL = 'http://localhost:8080/api/usuarios';
let usuarioModal; // Instancia del modal de Bootstrap

// Esperamos a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    usuarioModal = new bootstrap.Modal(document.getElementById('usuarioModal'));

    // Detectar cuando se hace clic en la pestaña "Usuarios" para cargar los datos
    const linkUsuarios = document.querySelector('a[data-section="usuarios"]');
    if (linkUsuarios) {
        linkUsuarios.addEventListener('click', (e) => {
            // Pequeño delay para que la sección sea visible antes de cargar (opcional pero visualmente mejor)
            setTimeout(cargarUsuarios, 100);
        });
    }
});

// 1. FUNCIÓN PARA OBTENER Y LISTAR USUARIOS (READ)
async function cargarUsuarios() {
    const tbody = document.getElementById('tablaUsuariosBody');
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Conectando con la base de datos...</td></tr>';

    try {
        const respuesta = await fetch(API_URL);
        
        if (!respuesta.ok) throw new Error('Error de conexión con el Servidor');
        
        const usuarios = await respuesta.json();
        
        tbody.innerHTML = ''; // Limpiar mensaje de carga

        if (usuarios.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No hay usuarios registrados.</td></tr>';
            return;
        }

        // Crear filas para cada usuario
        usuarios.forEach(u => {
            const badgeClass = u.rol === 'admin' ? 'bg-danger' : 'bg-success';
            
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${u.idUsuario}</td>
                <td>${u.email}</td>
                <td>${u.nombre} ${u.apellido}</td>
                <td><span class="badge ${badgeClass}">${u.rol}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="prepararEdicion(${u.idUsuario})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${u.idUsuario})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(fila);
        });

    } catch (error) {
        console.error(error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-danger py-4">
                    <i class="bi bi-exclamation-triangle-fill"></i> Error: ${error.message}<br>
                    <small>Verifica que Spring Boot esté corriendo en el puerto 8080</small>
                </td>
            </tr>`;
    }
}

// 2. FUNCIÓN PARA GUARDAR (CREATE o UPDATE)
async function guardarUsuario() {
    const idInput = document.getElementById('usuarioId');
    const esEdicion = idInput.value !== "";

    const usuarioData = {
        idUsuario: esEdicion ? parseInt(idInput.value) : null,
        email: document.getElementById('usuarioEmail').value,
        nombre: document.getElementById('usuarioNombre').value,
        apellido: document.getElementById('usuarioApellido').value,
        clave: document.getElementById('usuarioClave').value,
        rol: document.getElementById('usuarioRol').value
    };

    try {
        const metodo = esEdicion ? 'PUT' : 'POST';
        const url = esEdicion ? `${API_URL}/${usuarioData.idUsuario}` : API_URL;

        const respuesta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioData)
        });

        if (!respuesta.ok) throw new Error('Error al guardar en la base de datos');

        // Éxito
        usuarioModal.hide();
        cargarUsuarios(); // Recargar tabla
        mostrarAlerta('Usuario guardado correctamente', 'success');

    } catch (error) {
        console.error(error);
        mostrarAlerta('Error al guardar. Revisa la consola.', 'danger');
    }
}

// 3. FUNCIÓN PARA ELIMINAR (DELETE)
async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

        if (!respuesta.ok) throw new Error('No se pudo eliminar');

        cargarUsuarios();
        mostrarAlerta('Usuario eliminado', 'warning');

    } catch (error) {
        console.error(error);
        mostrarAlerta('Error: El usuario podría tener pedidos asociados (Restricción de BD)', 'danger');
    }
}

// Función auxiliar: Abrir Modal limpio (Crear)
function abrirModalUsuario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    document.getElementById('modalTitulo').innerText = 'Nuevo Usuario';
    usuarioModal.show();
}

// Función auxiliar: Preparar Edición (Simplificada para traer datos)
async function prepararEdicion(id) {
    try {
        // Primero traemos los datos frescos del servidor
        const respuesta = await fetch(`${API_URL}/${id}`);
        if (!respuesta.ok) throw new Error('Usuario no encontrado');
        const u = await respuesta.json();

        // Rellenamos el formulario
        document.getElementById('usuarioId').value = u.idUsuario;
        document.getElementById('usuarioEmail').value = u.email;
        document.getElementById('usuarioNombre').value = u.nombre;
        document.getElementById('usuarioApellido').value = u.apellido;
        document.getElementById('usuarioRol').value = u.rol;
        document.getElementById('usuarioClave').value = ''; // No mostramos la clave actual por seguridad
        
        document.getElementById('modalTitulo').innerText = 'Editar Usuario';
        usuarioModal.show();

    } catch (error) {
        mostrarAlerta('Error al cargar datos para edición', 'danger');
    }
}

// Función auxiliar para mostrar mensajes bonitos
function mostrarAlerta(mensaje, tipo) {
    const div = document.getElementById('mensajeUsuario');
    div.className = `alert alert-${tipo}`;
    div.innerHTML = mensaje;
    div.classList.remove('d-none');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        div.classList.add('d-none');
    }, 3000);
}