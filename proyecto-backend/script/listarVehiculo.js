// archivo: listarVehiculos.js
//
const lista = document.getElementById("listaVehiculos");
let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

function renderVehiculos() {
    lista.innerHTML = "";

    vehiculos.forEach((v, index) => {
        const card = document.createElement("div");
        card.className = "producto-card";

        card.innerHTML = `
      <button class="btn-eliminar" onclick="eliminarVehiculo(${index})">✖</button>
      <img src="${v.imagen}" alt="vehiculo">
      <div>
        <h4>${v.marca} ${v.modelo} (${v.anio})</h4>
        <p><strong>Precio:</strong> $${v.precio}</p>
        <p>${v.descripcion}</p>
      </div>
    `;

        lista.appendChild(card);
    });
}

function eliminarVehiculo(index) {
    if (confirm("¿Eliminar este producto?")) {
        vehiculos.splice(index, 1);
        localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
        renderVehiculos();
    }
}

renderVehiculos();
