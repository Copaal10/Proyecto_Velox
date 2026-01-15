// catalogCarrito.js
// Catálogo + Carrito para catalog.html

// -----------------------------
// Utilidades de localStorage
// -----------------------------
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

  // Leer inventario guardado desde el admin
  const inventario = getLS("inventario");

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

    // Botón para agregar al carrito
    card.querySelector("button").addEventListener("click", () => agregarAlCarrito(v));
    cont.appendChild(card);
  });
}

// -----------------------------
// Carrito: agregar, listar, total, contador
// -----------------------------
function agregarAlCarrito(vehiculo) {
  const carrito = getLS("carrito");
  carrito.push(vehiculo);
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
    const item = document.createElement("div");
    item.className = "card mb-2";

    const precioNum = Number(v.precio) || 0;
    suma += precioNum;

    item.innerHTML = `
      <div class="card-body">
        <h6>${v.marca} ${v.modelo} (${v.anio})</h6>
        <p>Precio: $${v.precio}</p>
        <button class="btn btn-outline-danger btn-sm">Eliminar</button>
      </div>
    `;
    item.querySelector("button").addEventListener("click", () => eliminarDelCarrito(idx));
    lista.appendChild(item);
  });

  total.textContent = `Total: $${suma}`;
}

function eliminarDelCarrito(index) {
  const carrito = getLS("carrito");
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
    badge.style.display = "inline";
    badge.textContent = carrito.length;
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

  // Render del offcanvas cada vez que se abre
  const offcanvasEl = document.getElementById("carritoOffcanvas");
  if (offcanvasEl) {
    offcanvasEl.addEventListener("show.bs.offcanvas", mostrarCarrito);
  }

  const btnVaciar = document.getElementById("vaciar-carrito");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", vaciarCarrito);
  }
});