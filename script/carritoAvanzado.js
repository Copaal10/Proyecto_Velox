// ==========================================
// CARRITO AVANZADO.JS - VERSIÓN UNIFICADA
// Funciona para: Admin, Catálogo, Carrito
// ==========================================

console.log("🚗 carritoAvanzado.js cargado correctamente");

// -----------------------------
// FUNCIONES DE LOCALSTORAGE
// -----------------------------
function getLS(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error al leer localStorage:", error);
    return [];
  }
}

function setLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("Error al guardar en localStorage:", error);
    return false;
  }
}

// -----------------------------
// CATÁLOGO BASE (10 vehículos fijos)
// -----------------------------
const vehiculosBase = [
  { id: 1, marca: "Koenigsegg", modelo: "Jesko Absolut Velox", anio: "2025", precio: "4800000", descripcion: "Una bestia aerodinámica.", imagen: "../img/Koenigsegg/Koenigsegg1.png" },
  { id: 2, marca: "Bugatti", modelo: "Chiron SS Mansory Centuria", anio: "2024", precio: "5200000", descripcion: "Transformación agresiva.", imagen: "../img/Chiron/Chiron1.png" },
  { id: 3, marca: "Pagani", modelo: "Huayra Roadster BC Titanium", anio: "2024", precio: "4500000", descripcion: "Escape en titanio puro.", imagen: "../img/Pagani/Pagani1.png" },
  { id: 4, marca: "Lamborghini", modelo: "Revuelto Liberty Walk", anio: "2025", precio: "3200000", descripcion: "Estilo de tuning agresivo.", imagen: "../img/Lamborghini/Lamborghini1.png" },
  { id: 5, marca: "Ferrari", modelo: "SF90 XX Stradale", anio: "2024", precio: "1200000", descripcion: "Versión extremista híbrida.", imagen: "../img/Ferrari/Ferrari1.png" },
  { id: 6, marca: "Rolls-Royce", modelo: "Boat Tail Sapphire", anio: "2024", precio: "28000000", descripcion: "La cumbre del lujo.", imagen: "../img/Roll/Roll1.png" },
  { id: 7, marca: "Porsche", modelo: "911 GT2 RS Brabus 900", anio: "2025", precio: "1800000", descripcion: "Modificado por Brabus.", imagen: "../img/Porche/Porche1.png" },
  { id: 8, marca: "McLaren", modelo: "P1 LM Restomod", anio: "2025", precio: "3500000", descripcion: "Tecnología actualizada.", imagen: "../img/McLaren/McLaren1.png" },
  { id: 9, marca: "Mercedes-Benz", modelo: "G 63 6x6 Brabus 800", anio: "2025", precio: "2200000", descripcion: "Monstruo todoterreno.", imagen: "../img/Mercedes/Mercedes1.jpg" },
  { id: 10, marca: "Rimac", modelo: "Nevera Time Attack", anio: "2025", precio: "2400000", descripcion: "Eléctrico más rápido.", imagen: "../img/Rimac/Rimac1.jpg" }
];

// -----------------------------
// OBTENER INVENTARIO COMPLETO
// -----------------------------
function obtenerInventarioCompleto() {
  const nuevos = getLS("vehiculos");
  const inventario = [...vehiculosBase, ...nuevos];

  // Filtrar datos corruptos
  return inventario.filter(v => v && v.marca && v.modelo && v.id);
}

// -----------------------------
// CREAR TARJETA DE VEHÍCULO
// -----------------------------
function crearTarjetaVehiculo(v, esBorrable = false) {
  const card = document.createElement("div");
  card.className = "card m-2";
  card.style.width = "26rem";

  let htmlBoton = "";
  if (esBorrable) {
    htmlBoton = `<button class="btn btn-danger btn-sm w-100 mt-2 eliminar-registro" data-id="${v.id}">
      <i class="bi bi-trash"></i> Eliminar
    </button>`;
  }

  card.innerHTML = `
    ${v.imagen ? `<img src="${v.imagen}" class="card-img-top" style="height:250px; object-fit:cover;" alt="${v.marca}">` : ""}
    <div class="card-body">
      <h5 class="card-title text-truncate">${v.marca} ${v.modelo}</h5>
      <p class="card-text">Año: ${v.anio} · $${Number(v.precio).toLocaleString()}</p>
      <p class="card-text small text-muted">${v.descripcion}</p>
      ${htmlBoton}
    </div>
  `;

  return card;
}

// ========================================
// FUNCIONES PARA VISTA ADMIN (admin.html)
// ========================================
function mostrarVehiculosAdmin() {
  const contenedorFijos = document.getElementById("contenedor-fijos");
  const contenedorNuevos = document.getElementById("contenedor-nuevos");

  // Mostrar vehículos base
  if (contenedorFijos) {
    contenedorFijos.innerHTML = "";
    vehiculosBase.forEach(v => {
      const tarjeta = crearTarjetaVehiculo(v, false);
      contenedorFijos.appendChild(tarjeta);
    });
  }

  // Mostrar vehículos agregados
  if (contenedorNuevos) {
    const nuevos = getLS("vehiculos");
    contenedorNuevos.innerHTML = "";

    if (nuevos.length === 0) {
      contenedorNuevos.innerHTML = `
        <div class="empty-state">
          <i class="bi bi-inbox"></i>
          <p>No hay vehículos agregados aún</p>
        </div>
      `;
    } else {
      nuevos.forEach(v => {
        const tarjeta = crearTarjetaVehiculo(v, true);
        contenedorNuevos.appendChild(tarjeta);
      });

      // Agregar eventos de eliminar
      contenedorNuevos.querySelectorAll(".eliminar-registro").forEach(btn => {
        btn.addEventListener("click", function() {
          const id = parseInt(this.getAttribute("data-id"));
          eliminarVehiculo(id);
        });
      });
    }
  }

  // Actualizar estadísticas
  actualizarEstadisticasAdmin();
}

function actualizarEstadisticasAdmin() {
  const nuevos = getLS("vehiculos");
  const totalVehiculos = document.getElementById("totalVehiculos");
  const totalAgregados = document.getElementById("totalAgregados");

  if (totalVehiculos) {
    totalVehiculos.textContent = vehiculosBase.length + nuevos.length;
  }

  if (totalAgregados) {
    totalAgregados.textContent = nuevos.length;
  }
}

function agregarVehiculoNuevo(vehiculoData) {
  let vehiculos = getLS("vehiculos");

  // Generar ID único
  const ultimoId = vehiculos.length > 0
    ? Math.max(...vehiculos.map(v => v.id || 0))
    : 1000;

  const nuevoVehiculo = {
    id: ultimoId + 1,
    ...vehiculoData
  };

  vehiculos.push(nuevoVehiculo);
  setLS("vehiculos", vehiculos);

  console.log("✅ Vehículo agregado:", nuevoVehiculo);

  // Actualizar vistas
  mostrarVehiculosAdmin();
  mostrarCatalogoPublico();

  return nuevoVehiculo;
}

function eliminarVehiculo(id) {
  if (!confirm("¿Eliminar este vehículo del sistema?")) return;

  let vehiculos = getLS("vehiculos");
  const vehiculoEliminado = vehiculos.find(v => v.id === id);

  vehiculos = vehiculos.filter(v => v.id !== id);
  setLS("vehiculos", vehiculos);

  console.log("🗑️ Vehículo eliminado:", vehiculoEliminado);

  // Actualizar vistas
  mostrarVehiculosAdmin();
  mostrarCatalogoPublico();
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
  icon: "success",
  title: "Vehículo eliminado correctamente."
});
}

// =============================================
// FUNCIONES PARA CATÁLOGO PÚBLICO (catalog.html)
// =============================================
function mostrarCatalogoPublico() {
  const contenedorCatalogo = document.getElementById("resultado");
  if (!contenedorCatalogo) return;

  contenedorCatalogo.innerHTML = "";
  const inventario = obtenerInventarioCompleto();

  console.log("📋 Mostrando inventario:", inventario.length, "vehículos");

  inventario.forEach(v => {
    const tarjeta = crearTarjetaVehiculo(v, false);

    // Agregar botón de compra (AZUL del carrito)
    const btnComprar = document.createElement("button");
    btnComprar.className = "btn btn-carrito-personalizado btn-sm w-100 mt-2";
    btnComprar.innerHTML = '<i class="bi bi-cart-plus"></i> Agregar al carrito';
    btnComprar.onclick = () => agregarAlCarrito(v);

    tarjeta.querySelector(".card-body").appendChild(btnComprar);
    contenedorCatalogo.appendChild(tarjeta);
  });
}

// =====================================
// FUNCIONES DE CARRITO DE COMPRAS
// =====================================
function agregarAlCarrito(vehiculo) {
  // Validación de seguridad
  if (!vehiculo || !vehiculo.marca || !vehiculo.modelo) {
    console.error("❌ Vehículo inválido:", vehiculo);
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
  title: "Error: El vehículo no tiene datos válidos."
});
    return;
  }

  let carrito = getLS("carrito");

  // Buscar si ya existe en el carrito
  const indice = carrito.findIndex(item =>
    item.id === vehiculo.id ||
    (item.marca === vehiculo.marca && item.modelo === vehiculo.modelo)
  );

  if (indice >= 0) {
    // Ya existe: aumentar cantidad
    carrito[indice].cantidad++;
    console.log("📈 Cantidad actualizada:", carrito[indice]);
  } else {
    // Nuevo: agregar al carrito
    carrito.push({ ...vehiculo, cantidad: 1 });
    console.log("🆕 Nuevo en carrito:", vehiculo.marca, vehiculo.modelo);
  }

  setLS("carrito", carrito);

  // Actualizar interfaz
  actualizarContadorCarrito();
  mostrarCarrito();
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
  icon: "success",
  title: "Producto agregado al carrito"
});

}

function mostrarCarrito() {
  const listaCarrito = document.getElementById("lista-carrito");
  const totalCarrito = document.getElementById("total-carrito");

  if (!listaCarrito || !totalCarrito) return;

  const carrito = getLS("carrito");
  listaCarrito.innerHTML = "";
  let sumaTotal = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = `
      <div class="text-center text-muted py-4">
        <i class="bi bi-cart-x" style="font-size: 3rem;"></i>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    totalCarrito.textContent = "Total: $0";
    return;
  }

  carrito.forEach((v, indice) => {
    const precioNum = Number(v.precio) || 0;
    const subtotal = precioNum * v.cantidad;
    sumaTotal += subtotal;

    const item = document.createElement("div");
    item.className = "card mb-2";
    item.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <h6 class="mb-1">${v.marca} ${v.modelo}</h6>
            <small class="text-muted">Año: ${v.anio}</small>
            <p class="mb-1 mt-2"><strong>Precio:</strong> $${precioNum.toLocaleString()}</p>
            <p class="mb-0"><strong>Cantidad:</strong> ${v.cantidad}</p>
            <p class="mb-0 text-primary"><strong>Subtotal:</strong> $${subtotal.toLocaleString()}</p>
          </div>
          <div class="d-flex flex-column gap-1">
            <button class="btn btn-sm btn-carrito-personalizado btn-mas" data-index="${indice}">
              <i class="bi bi-plus"></i>
            </button>
            <button class="btn btn-sm btn-outline-secondary btn-menos" data-index="${indice}">
              <i class="bi bi-dash"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger btn-borrar" data-index="${indice}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    listaCarrito.appendChild(item);
  });

  totalCarrito.innerHTML = `Total: $${sumaTotal.toLocaleString()}`;

  // Crear botón de proceder al pago
  const contenedorBotones = totalCarrito.parentElement;

  // Verificar si ya existe el botón de pago para evitar duplicados
  let btnPagoExistente = contenedorBotones.querySelector('.btn-proceder-pago');
  if (btnPagoExistente) {
    btnPagoExistente.remove();
  }

  const btnProcederPago = document.createElement("button");
  btnProcederPago.className = "btn btn-carrito-personalizado w-100 mt-3 btn-proceder-pago";
  btnProcederPago.innerHTML = '<i class="bi bi-credit-card"></i> Proceder al Pago';
  btnProcederPago.onclick = () => procesarPagoCarrito();

  // Insertar el botón antes del botón de vaciar carrito
  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) {
    contenedorBotones.insertBefore(btnProcederPago, btnVaciar);
  } else {
    contenedorBotones.appendChild(btnProcederPago);
  }

  // Agregar eventos a los botones
  document.querySelectorAll(".btn-mas").forEach(btn => {
    btn.addEventListener("click", function() {
      cambiarCantidad(parseInt(this.getAttribute("data-index")), 1);
    });
  });

  document.querySelectorAll(".btn-menos").forEach(btn => {
    btn.addEventListener("click", function() {
      cambiarCantidad(parseInt(this.getAttribute("data-index")), -1);
    });
  });

  document.querySelectorAll(".btn-borrar").forEach(btn => {
    btn.addEventListener("click", function() {
      borrarItemCarrito(parseInt(this.getAttribute("data-index")));
    });
  });
}

function cambiarCantidad(indice, delta) {
  let carrito = getLS("carrito");

  if (carrito[indice]) {
    carrito[indice].cantidad += delta;

    // Si la cantidad llega a 0, eliminar el item
    if (carrito[indice].cantidad <= 0) {
      carrito.splice(indice, 1);
    }

    setLS("carrito", carrito);
    mostrarCarrito();
    actualizarContadorCarrito();
  }
}

function borrarItemCarrito(indice) {
  Swal.fire({
    title: "¿Eliminar vehículo?",
    text: "Se quitará este auto del carrito de compras.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ea6565",
    cancelButtonColor: "#65ABEA",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "No, mantenerlo",
    reverseButtons: true
  }).then((result) => {
    // Si el usuario confirma la eliminación
    if (result.isConfirmed) {
      // Lógica para borrar el item
      let carrito = getLS("carrito");
      carrito.splice(indice, 1);
      setLS("carrito", carrito);

      // Actualizar
      mostrarCarrito();
      actualizarContadorCarrito();

      // Notificación de éxito
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

function procesarPagoCarrito() {
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

function vaciarCarrito() {
  Swal.fire({
    title: "¿Vaciar todo el carrito?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ea6565",
    cancelButtonColor: "#65ABEA",
    confirmButtonText: "Sí, vaciar todo",
    cancelButtonText: "Cancelar",
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      setLS("carrito", []);
      mostrarCarrito();
      actualizarContadorCarrito();

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });

      Toast.fire({
        icon: "success",
        title: "Carrito vaciado con éxito"
      });
    }
  });
}

function actualizarContadorCarrito() {
  const badge = document.getElementById("contador-carrito");
  if (!badge) return;

  const carrito = getLS("carrito");
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  if (totalItems > 0) {
    badge.style.display = "flex";
    badge.style.alignItems = "center";
    badge.style.justifyContent = "center";
    badge.textContent = totalItems;

    // Estilos mejorados para mejor visualización en todos los HTML
    badge.style.position = "absolute";
    badge.style.top = "-5px";
    badge.style.right = "-10px";
    badge.style.minWidth = "22px";
    badge.style.minHeight = "22px";
    badge.style.padding = "4px 6px";
    badge.style.fontSize = "0.7rem";
    badge.style.fontWeight = "700";
    badge.style.borderRadius = "50%";
    badge.style.lineHeight = "1";
    badge.style.textAlign = "center";
    badge.style.transform = "none";
    badge.style.backgroundColor = "#dc3545";
    badge.style.color = "#fff";
    badge.style.border = "2px solid #fff";
    badge.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  } else {
    badge.style.display = "none";
  }
}

// =====================================
// INICIALIZACIÓN AUTOMÁTICA
// =====================================
document.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 Inicializando carritoAvanzado.js");

  // Detectar qué página estamos viendo
  const esAdmin = window.location.pathname.includes("admin.html");
  const esCatalogo = document.getElementById("resultado") !== null;
  const esCarrito = document.getElementById("lista-carrito") !== null;

  if (esAdmin) {
    console.log("📍 Modo: ADMIN");
    mostrarVehiculosAdmin();

    // Configurar formulario de registro
    const formVehiculo = document.getElementById("formVehiculo");
    if (formVehiculo) {
      formVehiculo.addEventListener("submit", function(e) {
        e.preventDefault();

        const marca = document.getElementById("marca").value.trim();
        const modelo = document.getElementById("modelo").value.trim();
        const anio = document.getElementById("anio").value;
        const precio = document.getElementById("precio").value;
        const descripcion = document.getElementById("descripcion").value.trim();
        const imagenInput = document.getElementById("imagen");

        // Validaciones
        if (!marca || !modelo || !anio || !precio || !descripcion) {
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
  icon: "warning",
  title: "Por favor completa todos los campos"
});

          return;
        }

        if (!imagenInput.files || !imagenInput.files[0]) {
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
  icon: "warning",
  title: "Por favor selecciona una imagen"
});
          return;
        }

        // Leer la imagen
        const reader = new FileReader();
        reader.onload = function(ev) {
          const vehiculoData = {
            marca,
            modelo,
            anio,
            precio,
            descripcion,
            imagen: ev.target.result
          };

          agregarVehiculoNuevo(vehiculoData);
          formVehiculo.reset();
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
  icon: "success",
  title: "Vehículo agregado correctamente"
});
        };

        reader.readAsDataURL(imagenInput.files[0]);
      });
    }
  }

  if (esCatalogo) {
    console.log("📍 Modo: CATÁLOGO");
    mostrarCatalogoPublico();
  }

  if (esCarrito) {
    console.log("📍 Modo: CARRITO");
    mostrarCarrito();

    // Configurar botón de vaciar carrito
    const btnVaciar = document.getElementById("vaciar-carrito");
    if (btnVaciar) {
      btnVaciar.addEventListener("click", vaciarCarrito);
    }
  }

  // Actualizar contador siempre
  actualizarContadorCarrito();

  // Escuchar evento de offcanvas del carrito
  const offcanvas = document.getElementById("carritoOffcanvas");
  if (offcanvas) {
    offcanvas.addEventListener("show.bs.offcanvas", mostrarCarrito);
  }

  // Escuchar eventos personalizados
  document.addEventListener("vehiculoAgregado", function() {
    console.log("🔄 Evento vehiculoAgregado detectado");
    mostrarVehiculosAdmin();
    mostrarCatalogoPublico();
  });
});

console.log("✅ carritoAvanzado.js listo para usar");