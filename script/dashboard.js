console.log("📊 dashboard.js cargado");

// ==================== NAVEGACIÓN ENTRE SECCIONES ====================
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();

    // Actualizar links activos
    document.querySelectorAll('[data-section]').forEach(l =>
      l.classList.remove('active')
    );
    link.classList.add('active');

    // Mostrar sección correspondiente
    const target = link.getAttribute('data-section');
    document.querySelectorAll('.section').forEach(sec =>
      sec.classList.remove('active')
    );
    document.getElementById(target).classList.add('active');

    console.log("📍 Sección activa:", target);
  });
});

// ==================== CERRAR SESIÓN ====================
const btnCerrar = document.getElementById('btnCerrarSesion');
if (btnCerrar) {
  btnCerrar.addEventListener('click', () => {
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
        // Limpiar TODOS los datos de localStorage
        localStorage.removeItem('jwt');
        localStorage.removeItem('usuarioNombre');
        localStorage.removeItem('usuarioApellido');
        localStorage.removeItem('usuarioEmail');
        localStorage.removeItem('usuarioRol');
        localStorage.removeItem('velox-token');
        localStorage.removeItem('velox-usuario');
        // NO borrar las notas al cerrar sesión
        // localStorage.removeItem('velox-notas-admin');

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

// ==================== SISTEMA DE NOTAS ====================

// Obtener notas del localStorage
function obtenerNotas() {
  const notas = localStorage.getItem('velox-notas-admin');
  return notas ? JSON.parse(notas) : [];
}

// Guardar notas en localStorage
function guardarNotas(notas) {
  localStorage.setItem('velox-notas-admin', JSON.stringify(notas));
}

// Renderizar lista de notas
function renderizarNotas() {
  const listaNotas = document.getElementById('lista-notas');
  if (!listaNotas) return;

  const notas = obtenerNotas();

  if (notas.length === 0) {
    listaNotas.innerHTML = `
      <div class="text-center text-muted py-4">
        <i class="bi bi-journal-x" style="font-size: 3rem;"></i>
        <p class="mt-2">No hay notas guardadas</p>
        <p class="small">Haz clic en "Nueva Nota" para agregar una</p>
      </div>
    `;
    return;
  }

  listaNotas.innerHTML = '';

  notas.forEach((nota, index) => {
    const notaCard = document.createElement('div');
    notaCard.className = 'card mb-3 shadow-sm';
    notaCard.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <h6 class="card-subtitle mb-2 text-muted">
              <i class="bi bi-calendar3"></i> ${nota.fecha}
            </h6>
            <p class="card-text" style="white-space: pre-wrap;">${nota.texto}</p>
          </div>
          <div class="d-flex gap-1">
            <button class="btn btn-sm" style="background: #3c3c3c; color: white;" onclick="editarNota(${index})" title="Editar nota" data-bs-toggle="tooltip">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="eliminarNota(${index})" title="Eliminar nota" data-bs-toggle="tooltip">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    listaNotas.appendChild(notaCard);
  });

  // Inicializar tooltips
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltips].map(el => new bootstrap.Tooltip(el));
}

// Agregar nueva nota
function agregarNota() {
  Swal.fire({
    title: 'Nueva Nota',
    html: `
      <textarea id="swal-nota-texto" class="form-control" rows="5" placeholder="Escribe tu nota aquí..." style="resize: none;"></textarea>
    `,
    showCancelButton: true,
    confirmButtonColor: '#65ABEA',
    cancelButtonColor: '#dc3545',
    confirmButtonText: '<i class="bi bi-save"></i> Guardar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const texto = document.getElementById('swal-nota-texto').value.trim();
      if (!texto) {
        Swal.showValidationMessage('Por favor escribe algo en la nota');
        return false;
      }
      return texto;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const notas = obtenerNotas();
      const nuevaNota = {
        texto: result.value,
        fecha: new Date().toLocaleString('es-CO', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      notas.unshift(nuevaNota); // Agregar al inicio
      guardarNotas(notas);
      renderizarNotas();

      Swal.fire({
        icon: 'success',
        title: 'Nota guardada',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }
  });
}

// Editar nota existente
function editarNota(index) {
  const notas = obtenerNotas();
  const nota = notas[index];

  Swal.fire({
    title: 'Editar Nota',
    html: `
      <textarea id="swal-nota-texto" class="form-control" rows="5" style="resize: none;">${nota.texto}</textarea>
    `,
    showCancelButton: true,
    confirmButtonColor: '#65ABEA',
    cancelButtonColor: '#dc3545',
    confirmButtonText: '<i class="bi bi-save"></i> Guardar cambios',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const texto = document.getElementById('swal-nota-texto').value.trim();
      if (!texto) {
        Swal.showValidationMessage('La nota no puede estar vacía');
        return false;
      }
      return texto;
    }
  }).then((result) => {
    if (result.isConfirmed) {
      notas[index].texto = result.value;
      notas[index].fecha = new Date().toLocaleString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' (editado)';
      guardarNotas(notas);
      renderizarNotas();

      Swal.fire({
        icon: 'success',
        title: 'Nota actualizada',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }
  });
}

// Eliminar nota
function eliminarNota(index) {
  Swal.fire({
    title: '¿Eliminar nota?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#65ABEA',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      const notas = obtenerNotas();
      notas.splice(index, 1);
      guardarNotas(notas);
      renderizarNotas();

      Swal.fire({
        icon: 'success',
        title: 'Nota eliminada',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }
  });
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
  // Cargar notas al iniciar
  renderizarNotas();

  // Botón agregar nota
  const btnAgregarNota = document.getElementById('btnAgregarNota');
  if (btnAgregarNota) {
    btnAgregarNota.addEventListener('click', agregarNota);
  }
});

console.log("✅ dashboard.js inicializado correctamente");