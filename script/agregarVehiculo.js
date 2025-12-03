// Referencias al formulario y al contenedor de resultados
const form = document.getElementById('formVehiculo');
const resultado = document.getElementById('resultado');

// Recuperar vehículos guardados
let vehiculos = JSON.parse(localStorage.getItem('vehiculos')) || [];

// Guardar en localStorage
function guardarVehiculos() {
  localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
}

// Renderizar cards
function renderVehiculos() {
  resultado.innerHTML = ""; // limpiar antes de pintar

  vehiculos.forEach((v, index) => {
    const card = document.createElement("div");
    card.classList.add("vehiculo-card");

    // Si existe formulario (admin) → incluir botón eliminar
    card.innerHTML = `
      ${v.imagen ? `<img src="${v.imagen}" alt="Imagen del vehículo"/>` : ""}
      <h3>${v.marca} ${v.modelo} (${v.anio})</h3>
      <p><strong>Precio:</strong> $${v.precio}</p>
      <p>${v.descripcion}</p>
      ${form ? `
        <div class="d-flex justify-content-end mt-2">
          <button class="btn btn-danger btn-sm eliminar">Eliminar</button>
        </div>` : ""}
    `;

    // Solo en admin: evento eliminar
    if (form) {
      card.querySelector(".eliminar").addEventListener("click", () => {
        vehiculos.splice(index, 1);
        guardarVehiculos();
        mostrarMensaje("❌ Vehículo eliminado");
        renderVehiculos();
      });
    }

    resultado.appendChild(card);
  });
}

// Submit del formulario (solo si existe → admin)
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const anio = document.getElementById('anio').value;
    const precio = document.getElementById('precio').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const imagenInput = document.getElementById('imagen');

    const registrar = (imagenBase64 = "") => {
      const vehiculo = { marca, modelo, anio, precio, descripcion, imagen: imagenBase64 };
      vehiculos.push(vehiculo);
      guardarVehiculos();

      form.reset();
      imagenInput.value = ""; // limpiar input file
      mostrarMensaje("✅ Vehículo agregado correctamente");
      renderVehiculos();

      // Mostrar también en otro lado si existe preview
      if (document.getElementById("previewVehiculo")) {
        mostrarEnOtroLado(vehiculo);
      }
    };

    if (imagenInput.files && imagenInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        registrar(ev.target.result);
      };
      reader.readAsDataURL(imagenInput.files[0]);
    } else {
      registrar("");
    }
  });
}

// Mostrar mensaje (solo admin)
function mostrarMensaje(texto) {
  const mensaje = document.createElement("div");
  mensaje.textContent = texto;
  mensaje.className = "alert alert-info mt-3";
  resultado.prepend(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}

// Función para mostrar el último vehículo en otro lado (preview)
function mostrarEnOtroLado(vehiculo) {
  const preview = document.getElementById("previewVehiculo");
  if (!preview) return;

  preview.innerHTML = ""; // limpiar antes de pintar

  const card = document.createElement("div");
  card.classList.add("vehiculo-card");

  card.innerHTML = `
    ${vehiculo.imagen ? `<img src="${vehiculo.imagen}" alt="Imagen del vehículo"/>` : ""}
    <h3>${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio})</h3>
    <p><strong>Precio:</strong> $${vehiculo.precio}</p>
    <p>${vehiculo.descripcion}</p>
  `;

  preview.appendChild(card);
}

// Inicializar renderizado
renderVehiculos();