console.log("👤 userPanel.js cargado");

// ==================== VERIFICAR ACCESO ====================
function verificarAccesoUsuario() {
    const token = localStorage.getItem('jwt');
    const rol = localStorage.getItem('usuarioRol');

    // Si no hay token, redirigir a login
    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'Acceso Denegado',
            text: 'Debes iniciar sesión para acceder a esta página',
            confirmButtonColor: '#65ABEA'
        }).then(() => {
            window.location.href = 'login.html';
        });
        return false;
    }

    // Si el usuario es admin, redirigir a su panel
    if (rol === 'admin') {
        Swal.fire({
            icon: 'info',
            title: 'Redirigiendo...',
            text: 'Eres administrador, te llevaremos a tu panel',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'admin.html';
        });
        return false;
    }

    return true;
}

// ==================== OBTENER DATOS DE LOCALSTORAGE ====================
function getLS(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer localStorage:", error);
    return [];
  }
}

// ==================== NAVEGACIÓN ENTRE SECCIONES ====================
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Actualizar links activos
    document.querySelectorAll('[data-section]').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Mostrar sección
    const sectionId = link.getAttribute('data-section');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');

    // Si es la sección de pedidos, cargar pedidos
    if (sectionId === 'mis-pedidos') {
      cargarPedidosUsuario();
    }
  });
});

// ==================== CERRAR SESIÓN ====================
const btnCerrarSesion = document.getElementById('cerrar-sesion');
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener('click', () => {
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
        // Limpiar datos de sesión (NO el carrito)
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
          timer: 2000,
          timerProgressBar: true
        }).then(() => {
          window.location.href = '../index.html';
        });
      }
    });
  });
}

// ==================== ACTUALIZAR ESTADÍSTICAS ====================
function actualizarEstadisticas() {
  const carrito = getLS("carrito");
  const totalItems = carrito.reduce((total, item) => total + (item.cantidad || 1), 0);

  const totalCarritoEl = document.getElementById('totalCarrito');
  if (totalCarritoEl) {
    totalCarritoEl.textContent = totalItems;
  }
}

// ==================== CARGAR PEDIDOS DEL USUARIO ====================
function cargarPedidosUsuario() {
  const contenedor = document.getElementById('contenedor-pedidos');
  if (!contenedor) return;

  const carrito = getLS("carrito");

  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    // NO HAY PRODUCTOS EN EL CARRITO
    contenedor.innerHTML = `
      <div class="empty-state text-center py-5">
        <i class="bi bi-cart-x" style="font-size: 4rem; color: #999;"></i>
        <h4 class="mt-3 mb-2">No tienes productos en tu carrito</h4>
        <p class="text-muted mb-4">Explora nuestro catálogo exclusivo y encuentra el vehículo de tus sueños</p>
        <a href="catalog.html" class="btn btn-velox">
          <i class="bi bi-grid-3x3"></i> Explorar Catálogo
        </a>
      </div>
    `;
    return;
  }

  // HAY PRODUCTOS - MOSTRAR GRID DE TARJETAS
  const gridContainer = document.createElement('div');
  gridContainer.className = 'vehiculos-container';

  carrito.forEach((item, index) => {
    const precioNum = Number(item.precio) || 0;
    const cantidad = item.cantidad || 1;
    const subtotal = precioNum * cantidad;

    const card = document.createElement('div');
    card.className = 'vehiculo-item';
    card.innerHTML = `
      ${item.imagen ? `<img src="${item.imagen}" alt="${item.marca} ${item.modelo}">` : '<div style="height:200px; background:#f0f0f0; display:flex; align-items:center; justify-content:center;"><i class="bi bi-image" style="font-size:3rem; color:#ccc;"></i></div>'}

      <div class="vehiculo-info">
        <h5>${item.marca} ${item.modelo}</h5>
        <p class="marca">Año: ${item.anio}</p>
        <p class="precio">$${precioNum.toLocaleString()}</p>
        <p class="detalles">
          <i class="bi bi-box"></i> Cantidad: ${cantidad}
        </p>
        <p class="detalles">
          <i class="bi bi-cash-stack"></i> Subtotal: <strong>$${subtotal.toLocaleString()}</strong>
        </p>

        <div class="d-flex gap-2 mt-3">
          <button class="btn btn-sm btn-outline-danger w-100" onclick="eliminarDelPedido(${index})">
            <i class="bi bi-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;

    gridContainer.appendChild(card);
  });

  contenedor.appendChild(gridContainer);

  // RESUMEN TOTAL
  const totalGeneral = carrito.reduce((total, item) => {
    const precio = Number(item.precio) || 0;
    const cantidad = item.cantidad || 1;
    return total + (precio * cantidad);
  }, 0);

  const resumenDiv = document.createElement('div');
  resumenDiv.className = 'card content-card mt-4';
  resumenDiv.innerHTML = `
    <div class="card-header" style="background: linear-gradient(135deg, #28a745 0%, #20873a 100%);">
      <i class="bi bi-calculator"></i> Resumen del Pedido
    </div>
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Total de productos:</h5>
        <h5 class="mb-0">${carrito.length}</h5>
      </div>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">Total a pagar:</h5>
        <h4 class="mb-0 text-success">$${totalGeneral.toLocaleString()}</h4>
      </div>
      <hr>
      <div class="d-grid gap-2">
        <button class="btn btn-velox" onclick="procesarPedido()">
          <i class="bi bi-check-circle"></i> Proceder al Pago
        </button>
        <a href="catalog.html" class="btn btn-outline-primary">
          <i class="bi bi-plus-circle"></i> Seguir Comprando
        </a>
      </div>
    </div>
  `;

  contenedor.appendChild(resumenDiv);
}

// ==================== ELIMINAR DEL PEDIDO ====================
function eliminarDelPedido(index) {
  Swal.fire({
    title: '¿Eliminar vehículo?',
    text: 'Se quitará este auto de tu pedido.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ea6565',
    cancelButtonColor: '#65ABEA',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      let carrito = getLS("carrito");
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));

      // Recargar vista
      cargarPedidosUsuario();
      actualizarEstadisticas();

      // Actualizar contador del carrito si existe
      if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
      }

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });
      Toast.fire({
        icon: "success",
        title: "Producto eliminado"
      });
    }
  });
}

// ==================== PROCESAR PEDIDO ====================
function procesarPedido() {
  Swal.fire({
    title: 'Funcionalidad en Desarrollo',
    html: `
      <p>El sistema de pagos está en desarrollo.</p>
      <p class="text-muted small" style="color: #ffffff !important;">Pronto podrás completar tu compra de forma segura.</p>
    `,
    icon: 'info',
    confirmButtonColor: '#65ABEA',
    confirmButtonText: 'Entendido'
  });
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log("🚀 Inicializando userPanel.js");

  // Verificar acceso antes de continuar
  if (!verificarAccesoUsuario()) {
    return;
  }

  // Mostrar nombre del usuario
  const userWelcome = document.getElementById('user-welcome');
  if (userWelcome) {
    const nombre = localStorage.getItem('usuarioNombre');
    const apellido = localStorage.getItem('usuarioApellido');

    if (nombre && apellido) {
      userWelcome.textContent = `Bienvenido, ${nombre} ${apellido}`;
    }
  }

  // Actualizar estadísticas
  actualizarEstadisticas();

  // Cargar pedidos si estamos en esa sección
  const seccionActual = document.querySelector('.section.active');
  if (seccionActual && seccionActual.id === 'mis-pedidos') {
    cargarPedidosUsuario();
  }

  // Evento para botones de navegación rápida
  document.querySelectorAll('.btn-ver-pedidos').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Cambiar a sección de pedidos
      document.querySelectorAll('[data-section]').forEach(l => l.classList.remove('active'));
      document.querySelector('[data-section="mis-pedidos"]').classList.add('active');

      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      document.getElementById('mis-pedidos').classList.add('active');

      cargarPedidosUsuario();
    });
  });
});

console.log("✅ userPanel.js listo");