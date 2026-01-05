// ====== ARCHIVO: script/main.js ======

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. CARGAR GALERÍA ---
  const galeriaContainer = document.getElementById('public-galeria-container');
  
  // Verificamos si hay datos guardados en el navegador
  try {
    const rawData = localStorage.getItem('galeria_db');
    // Si hay datos, convertimos el texto a un array de objetos JSON
    const imagenesGuardadas = rawData ? JSON.parse(rawData) : [];

    if (imagenesGuardadas.length > 0) {
      let htmlContent = ''; // Usamos un string vacío para acumular el HTML
      
      // Recorremos cada imagen y creamos su tarjeta HTML
      imagenesGuardadas.forEach(imgData => {
        htmlContent += `
          <div class="card shadow-sm border-0 fade-in-section h-100">
            <img src="${imgData.src}" class="card-img-top" alt="Galería" loading="lazy">
          </div>`;
      });
      
      // Inyectamos todo el HTML de una sola vez (más rápido que uno por uno)
      galeriaContainer.innerHTML = htmlContent;
      
      // IMPORTANTE: Ya que hemos agregado nuevas imágenes al DOM,
      // necesitamos que el observador (animaciones) también las vigile.
      iniciarAnimaciones();
      
    } else {
      galeriaContainer.innerHTML = '<p class="w-100 text-center text-muted">Galería vacía.</p>';
    }
  } catch (e) {
    console.error("Error cargando galería", e);
    galeriaContainer.innerHTML = '<p class="text-danger">Error al cargar imágenes.</p>';
  }

  // --- 2. CARGAR SONIDOS (NUEVO) ---
  const sonidosContainer = document.getElementById('public-sonidos-container');
  const DB_KEY_SONIDOS = 'velox_sonidos_db';

  try {
    const rawSonidos = localStorage.getItem(DB_KEY_SONIDOS);
    const sonidosDb = rawSonidos ? JSON.parse(rawSonidos) : [];

    if (sonidosDb.length > 0) {
      let htmlSonidos = '';

      sonidosDb.forEach(item => {
        htmlSonidos += `
          <div class="card shadow-sm border-0 fade-in-section h-100">
            <img src="${item.foto}" class="card-img-top" alt="${item.nombre}" style="height: 200px; object-fit: cover;">
            <div class="card-body text-center">
              <h5 class="card-title font-orbitron">${item.nombre}</h5>
              <audio controls class="w-100 mt-2">
                <source src="${item.audio}" type="audio/mpeg">
                Tu navegador no soporta audio.
              </audio>
            </div>
          </div>
        `;
      });

      sonidosContainer.innerHTML = htmlSonidos;
      // Re-iniciamos observador para los nuevos elementos
      iniciarAnimaciones();
    } else {
      sonidosContainer.innerHTML = '<p class="w-100 text-center text-muted">Aún no hay sonidos registrados.</p>';
    }

  } catch (e) {
    console.error("Error cargando sonidos", e);
    sonidosContainer.innerHTML = '<p class="text-danger">Error al cargar sonidos.</p>';
  }
  
  // --- 3. INICIAR ANIMACIONES AL SCROLL ---
  // Llamamos a esta función para activar los efectos visuales
  iniciarAnimaciones();
});

// Función separada para manejar el IntersectionObserver
// Esto permite llamarla tanto al inicio como después de cargar la galería/sonidos
function iniciarAnimaciones() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Si el elemento entra en pantalla, le añadimos la clase 'is-visible'
        entry.target.classList.add('is-visible');
        
        // Opcional: Dejar de observar una vez animado para ahorrar recursos
        // observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1 }); // Se activa cuando el 10% del elemento es visible

  // Seleccionamos todos los elementos que deben animarse
  document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
  });
}