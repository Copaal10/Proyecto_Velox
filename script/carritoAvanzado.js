// script/carritoAvanzado.js
// VERSIÓN FINAL: Validación estricta de datos para evitar autos corruptos.

// -----------------------------
// FUNCIONES ALMACENAMIENTO
// -----------------------------
function getLS(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// -----------------------------
// DATOS FIJOS
const vehiculosBase = [
  { id: 1, marca: "Koenigsegg", modelo: "Jesko Absolut Velox", anio: "2025", precio: "4800000", descripcion: "Una bestia aerodinámica.", imagen: "/img/Koenigsegg/Koenigsegg1.png" },
  { id: 2, marca: "Bugatti", modelo: "Chiron SS Mansory Centuria", anio: "2024", precio: "5200000", descripcion: "Transformación agresiva.", imagen: "/img/Chiron/Chiron1.png" },
  { id: 3, marca: "Pagani", modelo: "Huayra Roadster BC Titanium", anio: "2024", precio: "4500000", descripcion: "Escape en titanio puro.", imagen: "/img/pagani.jpg" },
  { id: 4, marca: "Lamborghini", modelo: "Revuelto Liberty Walk", anio: "2025", precio: "3200000", descripcion: "Estilo de tuning agresivo.", imagen: "/img/lamborghini.jpg" },
  { id: 5, marca: "Ferrari", modelo: "SF90 XX Stradale", anio: "2024", precio: "1200000", descripcion: "Versión extremista híbrida.", imagen: "/img/ferrari.jpg" },
  { id: 6, marca: "Rolls-Royce", modelo: "Boat Tail Sapphire", anio: "2024", precio: "28000000", descripcion: "La cumbre del lujo.", imagen: "/img/rollsroyce.jpg" },
  { id: 7, marca: "Porsche", modelo: "911 GT2 RS Brabus 900", anio: "2025", precio: "1800000", descripcion: "Modificado por Brabus.", imagen: "/img/porsche.jpg" },
  { id: 8, marca: "McLaren", modelo: "P1 LM Restomod", anio: "2025", precio: "3500000", descripcion: "Tecnología actualizada.", imagen: "/img/mclaren.jpg" },
  { id: 9, marca: "Mercedes-Benz", modelo: "G 63 6x6 Brabus 800", anio: "2025", precio: "2200000", descripcion: "Monstruo todoterreno.", imagen: "/img/mercedes.jpg" },
  { id: 10, marca: "Rimac", modelo: "Nevera Time Attack", anio: "2025", precio: "2400000", descripcion: "Eléctrico más rápido.", imagen: "/img/rimac.jpg" }
];

// Renderizado dinámico
const resultado = document.getElementById("resultado");

vehiculosBase.forEach(auto => {
  const card = document.createElement("div");
  card.classList.add("card", "m-3", "p-3", "shadow");
  card.style.width = "18rem";

  card.innerHTML = `
    <img src="${auto.imagen}" class="card-img-top" alt="${auto.modelo}">
    <div class="card-body">
      <h5 class="card-title">${auto.marca} ${auto.modelo}</h5>
      <p class="card-text">${auto.descripcion}</p>
      <p><strong>Año:</strong> ${auto.anio}</p>
      <p><strong>Precio:</strong> $${auto.precio}</p>
    </div>
  `;
  resultado.appendChild(card);
});
// MOSTRAR CATÁLOGO
// -----------------------------
function mostrarCatalogo() {
  const esAdmin = window.location.pathname.includes('admin.html');
  
  const contenedorFijos = document.getElementById("contenedor-fijos");
  const contenedorNuevos = document.getElementById("contenedor-nuevos");
  const contenedorCatalogo = document.getElementById("resultado"); 

  // --- MODO ADMIN ---
  if (esAdmin) {
    if (contenedorFijos) {
      contenedorFijos.innerHTML = "";
      vehiculosBase.forEach((v) => {
        const tarjeta = crearTarjetaVehiculo(v, false);
        contenedorFijos.appendChild(tarjeta);
      });
    }
    if (contenedorNuevos) {
      contenedorNuevos.innerHTML = "";
      const nuevos = getLS("vehiculos");
      console.log("Nuevos en Admin:", nuevos); // DEBUG
      nuevos.forEach((v) => {
        const tarjeta = crearTarjetaVehiculo(v, true);
        const btnEliminar = tarjeta.querySelector(".eliminar-registro");
        if (btnEliminar) btnEliminar.onclick = () => eliminarVehiculo(v.id);
        contenedorNuevos.appendChild(tarjeta);
      });
    }
  } 
  
  // --- MODO CATÁLOGO ---
  else if (contenedorCatalogo) {
    contenedorCatalogo.innerHTML = "";
    
    // UNIFICAR FIJOS + NUEVOS
    // FILTER: Quitamos cualquier auto que tenga datos nulos o corruptos
    const inventarioTotal = [...vehiculosBase, ...getLS("vehiculos")].filter(v => {
        return v && v.marca && v.modelo; // Seguro de que tiene datos validos
    });

    console.log("INVENTARIO TOTAL FILTRADO:", inventarioTotal); // DEBUG

    inventarioTotal.forEach((v) => {
      // Comprobación extra antes de crear tarjeta
      if (!v.marca) return; 

      const tarjeta = crearTarjetaVehiculo(v, false);
      
      // Crear botón
      const btnComprar = document.createElement("button");
      btnComprar.className = "btn btn-success btn-sm w-100 agregar-carrito";
      btnComprar.textContent = "Agregar al carrito";
      
      // Evento CLICK
      btnComprar.onclick = () => {
        agregarAlCarrito(v); // Aquí se guarda en LocalStorage
      };
      
      tarjeta.querySelector(".card-body").appendChild(btnComprar);
      contenedorCatalogo.appendChild(tarjeta);
    });
  }
}

// -----------------------------
// CREAR TARJETA
// -----------------------------
function crearTarjetaVehiculo(v, esBorrable) {
  const card = document.createElement("div");
  card.className = "card m-2";
  card.style.width = "18rem";

  let htmlBoton = "";
  if (esBorrable) {
    htmlBoton = `<button class="btn btn-danger btn-sm w-100 mt-2 eliminar-registro"><i class="bi bi-trash"></i> Eliminar</button>`;
  }

  card.innerHTML = `
    ${v.imagen ? `<img src="${v.imagen}" class="card-img-top" style="height:150px; object-fit:cover;">` : ""}
    <div class="card-body">
      <h5 class="card-title text-truncate">${v.marca} ${v.modelo}</h5>
      <p class="card-text">Año: ${v.anio} · $${Number(v.precio).toLocaleString()}</p>
      <p class="card-text small text-muted">${v.descripcion}</p>
      ${htmlBoton}
    </div>
  `;
  return card;
}

// -----------------------------
// ELIMINAR VEHÍCULO
// -----------------------------
function eliminarVehiculo(id) {
  if (!confirm("¿Eliminar este vehículo del sistema?")) return;
  let vehiculosPersonalizados = getLS("vehiculos");
  vehiculosPersonalizados = vehiculosPersonalizados.filter(v => v.id !== id);
  setLS("vehiculos", vehiculosPersonalizados);
  mostrarCatalogo();
  alert("Vehículo eliminado.");
}

// -----------------------------
// AGREGAR AL CARRITO (FUNCIÓN MAESTRA)
// -----------------------------
function agregarAlCarrito(v) {
  // 1. VERIFICACIÓN DE SEGURIDAD (Junior Level)
  if (!v) {
    alert("ERROR CRÍTICO: El objeto del vehículo es nulo (null).");
    console.error("Objeto nulo:", v);
    return;
  }
  if (!v.marca || !v.modelo) {
    alert(`ERROR: El vehículo guardado en LocalStorage está corrupto o le faltan datos.\nDatos: ${JSON.stringify(v)}`);
    return;
  }

  console.log(">>> AGREGANDO AL CARRITO: ", v);
  alert(`Agregando: ${v.marca} ${v.modelo}`);

  let carrito = getLS("carrito");
  
  // 2. BUSCAR SI YA EXISTE
  const idx = carrito.findIndex(i => i.marca === v.marca && i.modelo === v.modelo);

  if (idx >= 0) {
    // Ya existe: Actualizar cantidad
    carrito[idx].cantidad++;
    alert(`Actualizando cantidad de: ${v.marca}`);
  } else {
    // Nuevo: Crear
    carrito.push({ ...v, cantidad: 1 });
    alert(`Agregado nuevo al carrito: ${v.marca}`);
  }
  
  // 3. GUARDAR EN LOCALSTORAGE (Esto cumple tu requisito)
  setLS("carrito", carrito);
  console.log(">>> GUARDADO EN LOCALSTORAGE: ", getLS("carrito")); // Confirmación en consola
  
  // 4. ACTUALIZAR VISTAS (Visual)
  actualizarContadorCarrito();
  mostrarCarrito(); // Esto hace que aparezca en "Tu carrito"
}

// -----------------------------
// MOSTRAR CARRITO (Tu carrito visual)
// -----------------------------
function mostrarCarrito() {
  const carrito = getLS("carrito");
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total-carrito");
  
  if (!lista || !total) return;

  lista.innerHTML = "";
  let suma = 0;

  carrito.forEach((v, i) => {
    const precioNum = Number(v.precio) || 0;
    suma += precioNum * v.cantidad;
    const item = document.createElement("div");
    item.className = "card mb-2";
    item.innerHTML = `
      <div class="card-body d-flex justify-content-between align-items-center">
        <div>
          <h6>${v.marca} ${v.modelo} (${v.anio})</h6>
          <p>Precio: $${v.precio}</p>
          <p>Cantidad: ${v.cantidad}</p>
        </div>
        <div>
           <button class="btn btn-outline-secondary btn-sm mas">+</button>
           <button class="btn btn-outline-secondary btn-sm menos">-</button>
           <button class="btn btn-outline-danger btn-sm bor">X</button>
        </div>
      </div>`;
    item.querySelector(".mas").onclick = () => cambiarCant(i, 1);
    item.querySelector(".menos").onclick = () => cambiarCant(i, -1);
    item.querySelector(".bor").onclick = () => borrarItem(i);
    lista.appendChild(item);
  });
  total.textContent = "Total: $" + suma;
}

function cambiarCant(i, delta) {
  let carrito = getLS("carrito");
  carrito[i].cantidad = carrito[i].cantidad + delta;
  if (carrito[i].cantidad <= 0) carrito.splice(i, 1);
  setLS("carrito", carrito);
  mostrarCarrito();
  actualizarContadorCarrito();
}

function borrarItem(i) {
  let carrito = getLS("carrito");
  carrito.splice(i, 1);
  setLS("carrito", carrito);
  mostrarCarrito();
  actualizarContadorCarrito();
}

function vaciarCarrito() {
  setLS("carrito", []);
  mostrarCarrito();
  actualizarContadorCarrito();
}

// -----------------------------
// ACTUALIZAR BADGE Y LISTA
// -----------------------------
function actualizarContadorCarrito() {
  const carrito = getLS("carrito");
  const badge = document.getElementById("contador-carrito");
  if (!badge) return;

  const total = carrito.reduce((a, b) => a + b.cantidad, 0);
  badge.style.display = total > 0 ? "inline" : "none";
  badge.textContent = total;
}

// -----------------------------
// INICIALIZACIÓN
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  mostrarCatalogo();
  actualizarContadorCarrito();
  document.addEventListener('vehiculoAgregado', mostrarCatalogo);
  const offcanvas = document.getElementById("carritoOffcanvas");
  if (offcanvas) offcanvas.addEventListener("show.bs.offcanvas", mostrarCarrito);
  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) btnVaciar.onclick = vaciarCarrito;
});