// carritoAvanzado.js
// Catálogo + Carrito con cantidades y eliminar

function getLS(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}
function setLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// -----------------------------
// Renderizar catálogo con botón
// -----------------------------
function mostrarCatalogo() {
  const cont = document.getElementById("resultado");
  cont.innerHTML = "";

  const inventario = getLS("vehiculos"); // lee lo que guarda el admin

  inventario.forEach((v) => {
    const card = document.createElement("div");
    card.className = "card m-2";
    card.style.width = "18rem";

    card.innerHTML = `
      ${v.imagen ? `<img src="${v.imagen}" class="card-img-top" alt="${v.marca} ${v.modelo}">` : ""}
      <div class="card-body">
        <h5 class="card-title">${v.marca} ${v.modelo}</h5>
        <p class="card-text">Año: ${v.anio} · Precio: $${v.precio}</p>
        <p class="card-text">${v.descripcion || ""}</p>
        <button class="btn btn-success btn-sm">Agregar al carrito</button>
      </div>
    `;

    card.querySelector("button").addEventListener("click", () => agregarAlCarrito(v));
    cont.appendChild(card);
  });
}

// -----------------------------
// Carrito con cantidades
// -----------------------------
function agregarAlCarrito(vehiculo) {
  let carrito = getLS("carrito");

  // Buscar si ya existe el producto
  const index = carrito.findIndex(item => item.marca === vehiculo.marca && item.modelo === vehiculo.modelo);

  if (index >= 0) {
    carrito[index].cantidad += 1; // aumentar cantidad
  } else {
    carrito.push({ ...vehiculo, cantidad: 1 });
  }

  setLS("carrito", carrito);
  actualizarContadorCarrito();
}

function mostrarCarrito() {
  const carrito = getLS("carrito");
  const lista = document.getElementById("lista-carrito");
  const total = document.getElementById("total-carrito");

  lista.innerHTML = "";
  let suma = 0;

  carrito.forEach((v, idx) => {
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
          <button class="btn btn-outline-secondary btn-sm aumentar">+</button>
          <button class="btn btn-outline-secondary btn-sm disminuir">-</button>
          <button class="btn btn-outline-danger btn-sm eliminar">Eliminar</button>
        </div>
      </div>
    `;

    // Eventos de botones
    item.querySelector(".aumentar").addEventListener("click", () => cambiarCantidad(idx, 1));
    item.querySelector(".disminuir").addEventListener("click", () => cambiarCantidad(idx, -1));
    item.querySelector(".eliminar").addEventListener("click", () => eliminarDelCarrito(idx));

    lista.appendChild(item);
  });

  total.textContent = `Total: $${suma}`;
}

function cambiarCantidad(index, delta) {
  let carrito = getLS("carrito");
  carrito[index].cantidad += delta;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1); // eliminar si llega a 0
  }

  setLS("carrito", carrito);
  mostrarCarrito();
  actualizarContadorCarrito();
}

function eliminarDelCarrito(index) {
  let carrito = getLS("carrito");
  carrito.splice(index, 1);
  setLS("carrito", carrito);
  mostrarCarrito();
  actualizarContadorCarrito();
}

function vaciarCarrito() {
  setLS("carrito", []);
  mostrarCarrito();
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = getLS("carrito");
  const badge = document.getElementById("contador-carrito");
  if (!badge) return;

  if (carrito.length > 0) {
    let totalItems = carrito.reduce((acc, v) => acc + v.cantidad, 0);
    badge.style.display = "inline";
    badge.textContent = totalItems;
  } else {
    badge.style.display = "none";
  }
}

// -----------------------------
// Inicialización
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  mostrarCatalogo();
  actualizarContadorCarrito();

  const offcanvasEl = document.getElementById("carritoOffcanvas");
  if (offcanvasEl) {
    offcanvasEl.addEventListener("show.bs.offcanvas", mostrarCarrito);
  }

  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
  }
});