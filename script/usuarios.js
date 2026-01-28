
console.log("👥 usuarios.js cargado");

// ==================== CARGAR USUARIOS DESDE API ====================
async function cargarUsuarios() {
    const tablaBody = document.getElementById('tabla-usuarios');
    if (!tablaBody) return;

    try {
        const token = localStorage.getItem('jwt');

        const response = await fetch('http://localhost:8080/usuarios', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        const usuarios = await response.json();

        tablaBody.innerHTML = '';

        if (usuarios.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        <i class="bi bi-inbox"></i> No hay usuarios registrados
                    </td>
                </tr>
            `;
            return;
        }

        usuarios.forEach(usuario => {
            const fila = document.createElement('tr');

            // Determinar badge del rol
            const badgeRol = usuario.rol === 'admin'
                ? '<span class="badge bg-danger">Admin</span>'
                : '<span class="badge bg-primary">Cliente</span>';

            fila.innerHTML = `
                <td>${usuario.id_usuario}</td>
                <td>${usuario.nombre} ${usuario.apellido}</td>
                <td>${usuario.email}</td>
                <td>${badgeRol}</td>
                <td>${usuario.direccion && usuario.direccion.trim() !== '' ? usuario.direccion : '<span class="text-muted">Sin dirección</span>'}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-ver-detalle" data-id="${usuario.id_usuario}" title="Ver detalles" data-bs-toggle="tooltip">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${usuario.rol !== 'admin' ? `
                        <button class="btn btn-sm btn-warning btn-cambiar-rol" data-id="${usuario.id_usuario}" data-rol="${usuario.rol}" title="Cambiar rol" data-bs-toggle="tooltip" style="background-color: #3c3c3c; color: white; border-color: #3c3c3c;">
                            <i class="bi bi-arrow-repeat"></i>
                        </button>
                        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${usuario.id_usuario}" title="Eliminar usuario" data-bs-toggle="tooltip">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : '<span class="badge bg-secondary" title="Los administradores no se pueden modificar" data-bs-toggle="tooltip">Protegido</span>'}
                </td>
            `;

            tablaBody.appendChild(fila);
        });

        // Agregar event listeners a los botones
        document.querySelectorAll('.btn-ver-detalle').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                verDetalleUsuario(id);
            });
        });

        document.querySelectorAll('.btn-cambiar-rol').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                const rol = this.getAttribute('data-rol');
                cambiarRol(id, rol);
            });
        });

        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                eliminarUsuario(id);
            });
        });
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

    } catch (error) {
        console.error('Error:', error);
        tablaBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle"></i> Error al cargar usuarios
                </td>
            </tr>
        `;
    }
}

// ==================== AGREGAR NUEVO USUARIO ====================
async function agregarUsuario(usuarioData) {
    try {
        const token = localStorage.getItem('jwt');

        console.log("📤 Enviando nuevo usuario:", usuarioData);

        const response = await fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear usuario');
        }

        const data = await response.json();
        console.log("✅ Usuario creado:", data);

        Swal.fire({
            icon: 'success',
            title: '¡Usuario creado!',
            text: `${usuarioData.nombre} ${usuarioData.apellido} ha sido agregado al sistema`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        // Recargar tabla y limpiar formulario
        cargarUsuarios();
        document.getElementById('formAgregarUsuario').reset();

        // Limpiar validaciones
        document.querySelectorAll('#formAgregarUsuario .form-control, #formAgregarUsuario .form-select').forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });

        return data;

    } catch (error) {
        console.error('❌ Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al crear usuario',
            text: error.message,
            confirmButtonColor: '#65ABEA'
        });
        throw error;
    }
}

// ==================== VER DETALLE DE USUARIO ====================
async function verDetalleUsuario(id) {
    try {
        const token = localStorage.getItem('jwt');

        const response = await fetch(`http://localhost:8080/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error al obtener usuario');

        const usuario = await response.json();

        Swal.fire({
            title: `${usuario.nombre} ${usuario.apellido}`,
            html: `
                <div class="text-start">
                    <p><strong>ID:</strong> ${usuario.id_usuario}</p>
                    <p><strong>Email:</strong> ${usuario.email}</p>
                    <p><strong>Rol:</strong> ${usuario.rol}</p>
                    <p><strong>Dirección:</strong> ${usuario.direccion && usuario.direccion.trim() !== '' ? usuario.direccion : '<span class="text-muted">No especificada</span>'}</p>
                    <p><strong>Pedidos:</strong> ${usuario.pedidos ? usuario.pedidos.length : 0}</p>
                </div>
            `,
            icon: 'info',
            confirmButtonColor: '#65ABEA'
        });

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la información del usuario',
            confirmButtonColor: '#65ABEA'
        });
    }
}

async function cambiarRol(id, rolActual) {
    const nuevoRol = rolActual === 'admin' ? 'cliente' : 'admin';

    const resultado = await Swal.fire({
        title: '¿Cambiar rol de usuario?',
        text: `El usuario pasará de ${rolActual} a ${nuevoRol}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#65ABEA',
        cancelButtonColor: '#dc3545',
        confirmButtonText: 'Sí, cambiar',
        cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    try {
        const token = localStorage.getItem('jwt');

        // Obtener usuario actual
        const getResponse = await fetch(`http://localhost:8080/usuarios/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!getResponse.ok) {
            throw new Error('No se pudo obtener el usuario');
        }

        const usuario = await getResponse.json();

        console.log("👤 Usuario obtenido:", usuario);

        // Crear objeto EXACTAMENTE como el backend espera
        const datosActualizados = {
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            rol: nuevoRol,  // AQUÍ cambiamos el rol
            direccion: usuario.direccion ? usuario.direccion : "",
            clave: ""  // STRING VACÍO para que NO se actualice
        };

        console.log("📤 Enviando actualización:", datosActualizados);

        // Actualizar usuario
        const updateResponse = await fetch(`http://localhost:8080/usuarios/editar/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        console.log("📡 Status de respuesta:", updateResponse.status);

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            console.error("❌ Error del servidor:", errorText);
            throw new Error(`Error del servidor: ${updateResponse.status}`);
        }

        const usuarioActualizado = await updateResponse.json();
        console.log("✅ Usuario actualizado:", usuarioActualizado);

        Swal.fire({
            icon: 'success',
            title: '¡Rol actualizado!',
            text: `El usuario ahora es ${nuevoRol}`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });

        // Recargar la tabla
        cargarUsuarios();

    } catch (error) {
        console.error('❌ Error completo:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al cambiar rol',
            text: error.message || 'No se pudo cambiar el rol del usuario',
            confirmButtonColor: '#65ABEA'
        });
    }
}

// ==================== ELIMINAR USUARIO ====================
async function eliminarUsuario(id) {
    const resultado = await Swal.fire({
        title: '¿Eliminar usuario?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#65ABEA',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (!resultado.isConfirmed) return;

    try {
        const token = localStorage.getItem('jwt');

        const response = await fetch(`http://localhost:8080/usuarios/eliminar/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Error al eliminar usuario');

        Swal.fire({
            icon: 'success',
            title: 'Usuario eliminado',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });

        cargarUsuarios(); // Recargar tabla

    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el usuario',
            confirmButtonColor: '#65ABEA'
        });
    }
}

// ==================== VALIDACIONES DEL FORMULARIO ====================
function validarPasswordAdmin(password) {
    return {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/.test(password)
    };
}

function setIndicatorAdmin(el, ok) {
    el.classList.toggle('text-success', ok);
    el.classList.toggle('text-danger', !ok);
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar nombre del admin en el navbar
    const adminWelcome = document.getElementById('admin-welcome');
    if (adminWelcome) {
        const nombre = localStorage.getItem('usuarioNombre');
        const apellido = localStorage.getItem('usuarioApellido');

        if (nombre && apellido) {
            adminWelcome.textContent = `Bienvenido, ${nombre} ${apellido}`;
        }
    }

    // Cargar usuarios cuando se entra a la sección
    const navUsuarios = document.querySelector('[data-section="usuarios"]');
    if (navUsuarios) {
        navUsuarios.addEventListener('click', cargarUsuarios);
    }

    // ==================== FORM AGREGAR USUARIO ====================
    const formAgregarUsuario = document.getElementById('formAgregarUsuario');
    if (formAgregarUsuario) {
        const passwordInput = document.getElementById('usuarioClave');
        const passwordHelp = document.getElementById('passwordHelpAdmin');

        // Mostrar/ocultar ayuda de contraseña
        passwordInput.addEventListener('focus', () => {
            passwordHelp.style.display = 'block';
        });

        passwordInput.addEventListener('blur', () => {
            if (passwordInput.value === '') {
                passwordHelp.style.display = 'none';
            }
        });

        // Validación en tiempo real de contraseña
        passwordInput.addEventListener('input', () => {
            const checks = validarPasswordAdmin(passwordInput.value);

            setIndicatorAdmin(document.getElementById('admin-rule-length'), checks.length);
            setIndicatorAdmin(document.getElementById('admin-rule-upper'), checks.upper);
            setIndicatorAdmin(document.getElementById('admin-rule-lower'), checks.lower);
            setIndicatorAdmin(document.getElementById('admin-rule-number'), checks.number);
            setIndicatorAdmin(document.getElementById('admin-rule-special'), checks.special);

            const allValid = Object.values(checks).every(Boolean);
            passwordInput.classList.toggle('is-valid', allValid);
            passwordInput.classList.toggle('is-invalid', !allValid && passwordInput.value.length > 0);
        });

        // Submit del formulario
        formAgregarUsuario.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('usuarioNombre').value.trim();
            const apellido = document.getElementById('usuarioApellido').value.trim();
            const email = document.getElementById('usuarioEmail').value.trim();
            const clave = document.getElementById('usuarioClave').value;
            const direccion = document.getElementById('usuarioDireccion').value.trim();
            const rol = document.getElementById('usuarioRol').value;

            // Validaciones
            if (!nombre || !apellido || !email || !clave || !direccion) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Campos incompletos',
                    text: 'Por favor completa todos los campos',
                    confirmButtonColor: '#65ABEA'
                });
                return;
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Email inválido',
                    text: 'Por favor ingresa un email válido',
                    confirmButtonColor: '#65ABEA'
                });
                return;
            }

            // Validar contraseña
            const passChecks = validarPasswordAdmin(clave);
            if (!Object.values(passChecks).every(Boolean)) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Contraseña inválida',
                    text: 'La contraseña no cumple con los requisitos mínimos',
                    confirmButtonColor: '#65ABEA'
                });
                return;
            }

            // Validar dirección
            if (direccion.length < 10) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Dirección inválida',
                    text: 'La dirección debe tener al menos 10 caracteres',
                    confirmButtonColor: '#65ABEA'
                });
                return;
            }

            const usuarioData = {
                nombre,
                apellido,
                email,
                clave,
                direccion,
                rol
            };

            await agregarUsuario(usuarioData);
        });
    }
});

console.log("✅ usuarios.js listo");