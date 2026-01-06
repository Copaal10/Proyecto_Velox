// -------------------------------------------------------------
// Referencias al formulario y al contenedor de resultados
// -------------------------------------------------------------
const form = document.getElementById("formVehiculo");
const resultado = document.getElementById("resultado");

// -------------------------------------------------------------
// Vehículos precargados (NO se guardan en localStorage)
// -------------------------------------------------------------
const vehiculosBase = [
  {
    marca: "Toyota",
    modelo: "Supra",
    anio: "1998",
    precio: "85000",
    descripcion: "Deportivo japonés turbo icónico.",
    imagen: "../img/car1.jpg",
  },
  {
    marca: "Nissan",
    modelo: "GT-R",
    anio: "2020",
    precio: "120000",
    descripcion: "Superdeportivo AWD de alto rendimiento.",
    imagen: "../img/car2.jpg",
  },
  {
    marca: "Mazda",
    modelo: "RX-7",
    anio: "1995",
    precio: "60000",
    descripcion: "Motor rotativo Wankel, ultra ligero.",
    imagen: "../img/car3.jpg",
  },
  {
    marca: "Ford",
    modelo: "Mustang",
    anio: "2022",
    precio: "55000",
    descripcion: "Clásico americano con motor V8.",
    imagen: "../img/car4.webp",
  },
  {
    marca: "Chevrolet",
    modelo: "Camaro",
    anio: "2022",
    precio: "52000",
    descripcion: "Deportivo moderno americano.",
    imagen: "../img/car5.webp",
  },
  {
    marca: "Porsche",
    modelo: "911",
    anio: "2021",
    precio: "150000",
    descripcion: "Deportivo alemán por excelencia.",
    imagen: "../img/car6.webp",
  },
  {
    marca: "BMW",
    modelo: "M4",
    anio: "2020",
    precio: "98000",
    descripcion: "Cupé de alto rendimiento.",
    imagen: "../img/car7.jpg",
  },
  {
    marca: "Audi",
    modelo: "R8",
    anio: "2019",
    precio: "180000",
    descripcion: "Supercar con motor V10.",
    imagen: "../img/car8.webp",
  },
  {
    marca: "Lamborghini",
    modelo: "Huracán",
    anio: "2018",
    precio: "250000",
    descripcion: "Máquina extrema de velocidad.",
    imagen: "../img/car9.webp",
  },
  {
    marca: "Ferrari",
    modelo: "488",
    anio: "2019",
    precio: "280000",
    descripcion: "Superdeportivo italiano de lujo.",
    imagen: "../img/car10.jpg",
  },
];

// -------------------------------------------------------------
// Vehículos guardados por el administrador (SÍ van en localStorage)
// -------------------------------------------------------------
let vehiculosGuardados = JSON.parse(localStorage.getItem("vehiculos")) || [];

// -------------------------------------------------------------
// Obtener lista final para mostrar (base + guardados)
// -------------------------------------------------------------
function obtenerListaVehiculos() {
  return [...vehiculosBase, ...vehiculosGuardados];
}

// -------------------------------------------------------------
// Guardar SOLO los vehículos agregados (NO los base)
// -------------------------------------------------------------
function guardarVehiculos() {
  localStorage.setItem("vehiculos", JSON.stringify(vehiculosGuardados));
}

// -------------------------------------------------------------
// Renderizar cards
// -------------------------------------------------------------
function renderVehiculos() {
  resultado.innerHTML = ""; // limpiar antes de pintar

  obtenerListaVehiculos().forEach((v, index) => {
    const card = document.createElement("div");
    card.classList.add("vehiculo-card");

    card.innerHTML = `
      ${v.imagen ? `<img src="${v.imagen}" alt="Imagen del vehículo"/>` : ""}
      <h3>${v.marca} ${v.modelo} (${v.anio})</h3>
      <p><strong>Precio:</strong> $${v.precio}</p>
      <p>${v.descripcion}</p>

      ${
        form
          ? `
      <div class="d-flex justify-content-end mt-2">
        <button class="btn btn-danger btn-sm eliminar">Eliminar</button>
      </div>`
          : ""
      }
    `;

    // Función eliminar SOLO si estás en la página admin
    if (form) {
      card.querySelector(".eliminar").addEventListener("click", () => {
        // Evitar que eliminen vehículos base
        if (index < vehiculosBase.length) {
          Swal.fire({
            icon: "error",
            title: "No permitido",
            text: "No puedes eliminar un vehículo base.",
            confirmButtonText: "Entendido",
          });
          return;
        }

        // Índice real dentro de vehiculosGuardados
        const realIndex = index - vehiculosBase.length;

        vehiculosGuardados.splice(realIndex, 1);
        guardarVehiculos();
        mostrarMensaje("❌ Vehículo eliminado");
        renderVehiculos();
      });
    }

    resultado.appendChild(card);
  });
}

// -------------------------------------------------------------
// Submit del formulario (solo admin)
// -------------------------------------------------------------
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const anio = document.getElementById("anio").value;
    const precio = document.getElementById("precio").value;
    const descripcion = document.getElementById("descripcion").value.trim();
    const imagenInput = document.getElementById("imagen");

    const registrar = (img = "") => {
      const vehiculo = {
        marca,
        modelo,
        anio,
        precio,
        descripcion,
        imagen: img,
      };

      vehiculosGuardados.push(vehiculo);
      guardarVehiculos();

      form.reset();
      imagenInput.value = "";
      mostrarMensaje("✅ Vehículo agregado correctamente");

      renderVehiculos();

      if (document.getElementById("previewVehiculo")) {
        mostrarEnOtroLado(vehiculo);
      }
    };

    if (imagenInput.files && imagenInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => registrar(ev.target.result);
      reader.readAsDataURL(imagenInput.files[0]);
    } else {
      registrar("");
    }
  });
}

// -------------------------------------------------------------
// Mostrar mensaje (solo admin)
// -------------------------------------------------------------
function mostrarMensaje(texto) {
  const mensaje = document.createElement("div");
  mensaje.textContent = texto;
  mensaje.className = "alert alert-info mt-3";
  resultado.prepend(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}

// -------------------------------------------------------------
// Mostrar último vehículo en otro lado (preview)
// -------------------------------------------------------------
function mostrarEnOtroLado(vehiculo) {
  const preview = document.getElementById("previewVehiculo");
  if (!preview) return;

  preview.innerHTML = "";

  const card = document.createElement("div");
  card.classList.add("vehiculo-card");

  card.innerHTML = `
    ${
      vehiculo.imagen
        ? `<img src="${vehiculo.imagen}" alt="Imagen del vehículo"/>`
        : ""
    }
    <h3>${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.anio})</h3>
    <p><strong>Precio:</strong> $${vehiculo.precio}</p>
    <p>${vehiculo.descripcion}</p>
  `;

  preview.appendChild(card);
}

// -------------------------------------------------------------
// Inicializar renderizado
// -------------------------------------------------------------
renderVehiculos();
