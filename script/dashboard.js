// -------------------- Navegación entre secciones --------------------
document.querySelectorAll('.menu-item').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.menu-item').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    const target = link.getAttribute('data-section');
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('visible'));
    document.getElementById(target).classList.add('visible');
  });
});


// ==================== Notas rápidas ====================
const notasTextarea = document.getElementById('notas');
const guardarNotasBtn = document.getElementById('guardar-notas');
const limpiarNotasBtn = document.getElementById('limpiar-notas');
const notasList = document.createElement('div');
notasList.className = "mt-3";
document.getElementById('inicio').appendChild(notasList);

let notas = JSON.parse(localStorage.getItem('velox_notas')) || [];

function renderNotas() {
  notasList.innerHTML = "";
  notas.forEach((nota, idx) => {
    const card = document.createElement('div');
    card.className = "card p-2 mb-2";
    card.innerHTML = `
      <p>${nota}</p>
      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-warning" data-edit="${idx}">Editar</button>
        <button class="btn btn-sm btn-danger" data-del="${idx}">Eliminar</button>
      </div>
    `;
    notasList.appendChild(card);
  });
}

guardarNotasBtn.addEventListener('click', () => {
  if (notasTextarea.value.trim() !== "") {
    notas.push(notasTextarea.value.trim());
    localStorage.setItem('velox_notas', JSON.stringify(notas));
    notasTextarea.value = "";
    renderNotas();
  }
});

limpiarNotasBtn.addEventListener('click', () => {
  notas = [];
  localStorage.removeItem('velox_notas');
  renderNotas();
});

notasList.addEventListener('click', e => {
  if (e.target.dataset.del !== undefined) {
    notas.splice(e.target.dataset.del, 1);
    localStorage.setItem('velox_notas', JSON.stringify(notas));
    renderNotas();
  }
  if (e.target.dataset.edit !== undefined) {
    const idx = e.target.dataset.edit;
    notasTextarea.value = notas[idx]; // carga la nota en el textarea
    notas.splice(idx, 1); // la elimina temporalmente para re-guardar
    localStorage.setItem('velox_notas', JSON.stringify(notas));
    renderNotas();
  }
});

renderNotas();


// ==================== Vehículos ====================
const formVehiculo = document.getElementById("formVehiculo");
const resultado = document.getElementById("resultado");

let vehiculos = JSON.parse(localStorage.getItem("vehiculos")) || [];

function renderVehiculos() {
  resultado.innerHTML = "";
  if (vehiculos.length === 0) {
    resultado.innerHTML = "<p class='text-muted'>No hay vehículos registrados.</p>";
    return;
  }

  vehiculos.forEach((v, idx) => {
    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm";
    card.innerHTML = `
      <img src="${v.imagen}" alt="${v.marca} ${v.modelo}" class="card-img-top" style="max-height:200px;object-fit:cover;">
      <div class="card-body">
        <h5 class="card-title">${v.marca} ${v.modelo} (${v.anio})</h5>
        <p class="card-text">${v.descripcion}</p>
        <p class="card-text"><strong>Precio:</strong> $${v.precio}</p>
      </div>
      <div class="card-footer d-flex justify-content-end">
        <button class="btn btn-sm btn-danger" data-del="${idx}">Eliminar</button>
      </div>
    `;
    resultado.appendChild(card);
  });
}

if (formVehiculo) {
  formVehiculo.addEventListener("submit", e => {
    e.preventDefault();

    const marca = document.getElementById("marca").value.trim();
    const modelo = document.getElementById("modelo").value.trim();
    const anio = document.getElementById("anio").value.trim();
    const precio = document.getElementById("precio").value.trim();
    const imagenFile = document.getElementById("imagen").files[0];
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!marca || !modelo || !anio || !precio || !imagenFile || !descripcion) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const readerImg = new FileReader();
    readerImg.onload = () => {
      const imgData = readerImg.result;
      const vehiculo = { marca, modelo, anio, precio, imagen: imgData, descripcion };
      vehiculos.push(vehiculo);
      localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
      renderVehiculos();
      formVehiculo.reset();
      alert("✅ Vehículo registrado correctamente");
    };
    readerImg.readAsDataURL(imagenFile);
  });
}

resultado.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const delIndex = btn.dataset.del;
  if (delIndex !== undefined) {
    vehiculos.splice(Number(delIndex), 1);
    localStorage.setItem("vehiculos", JSON.stringify(vehiculos));
    renderVehiculos();
  }
});

renderVehiculos();


