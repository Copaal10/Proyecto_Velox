// ====== ARCHIVO: script/main.js ======

document.addEventListener('DOMContentLoaded', () => {
  
  
  
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