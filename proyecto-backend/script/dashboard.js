
console.log("📊 dashboard.js cargado");

// ==================== NAVEGACIÓN ENTRE SECCIONES ====================
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    
    // Actualizar links activos
    document.querySelectorAll('[data-section]').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    
    // Mostrar sección correspondiente
    const target = link.getAttribute('data-section');
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(target).classList.add('active');
    
    console.log("📍 Sección activa:", target);
  });
});

// ==================== CERRAR SESIÓN ====================
const btnCerrar = document.getElementById('btnCerrarSesion');
if (btnCerrar) {
  btnCerrar.addEventListener('click', () => {
    if (confirm('¿Deseas cerrar sesión?')) {
      window.location.href = 'login.html';
    }
  });
}

// ==================== NOTAS RÁPIDAS ====================
const notasTexto = document.getElementById('notasTexto');
const btnGuardarNotas = document.getElementById('btnGuardarNotas');
const btnLimpiarNotas = document.getElementById('btnLimpiarNotas');

if (notasTexto && btnGuardarNotas && btnLimpiarNotas) {
  // Cargar notas al iniciar
  window.addEventListener('load', () => {
    const notasGuardadas = localStorage.getItem('velox-notas-admin');
    if (notasGuardadas) {
      notasTexto.value = notasGuardadas;
      console.log("📝 Notas cargadas");
    }
  });

  // Guardar notas
  btnGuardarNotas.addEventListener('click', () => {
    localStorage.setItem('velox-notas-admin', notasTexto.value);
    console.log("💾 Notas guardadas");
    
    const textoOriginal = btnGuardarNotas.innerHTML;
    btnGuardarNotas.innerHTML = '<i class="bi bi-check-circle"></i> ¡Guardado!';
    btnGuardarNotas.classList.add('btn-success');
    btnGuardarNotas.classList.remove('btn-velox');
    
    setTimeout(() => {
      btnGuardarNotas.innerHTML = textoOriginal;
      btnGuardarNotas.classList.remove('btn-success');
      btnGuardarNotas.classList.add('btn-velox');
    }, 2000);
  });

  // Limpiar notas
  btnLimpiarNotas.addEventListener('click', () => {
    if (confirm('¿Deseas limpiar todas las notas?')) {
      notasTexto.value = '';
      localStorage.removeItem('velox-notas-admin');
      console.log("🗑️ Notas eliminadas");
    }
  });
}

console.log("✅ dashboard.js inicializado correctamente");