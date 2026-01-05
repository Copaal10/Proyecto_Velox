// Función renombrada para evitar conflictos
function calcularCuotaVelox() {
  // Obtener valores de los inputs con los NUEVOS IDs
  const precio = parseFloat(document.getElementById('velox-fin-precio').value) || 0;
  const entrada = parseFloat(document.getElementById('velox-fin-entrada').value) || 0;
  const tasaAnual = parseFloat(document.getElementById('velox-fin-tasa').value) || 0;
  const meses = parseInt(document.getElementById('velox-fin-meses').value) || 1;

  // Validación básica
  if (entrada >= precio) {
    alert("La cuota inicial debe ser menor al precio del vehículo.");
    return;
  }

  // Cálculos
  const montoPrestamo = precio - entrada;
  const tasaMensual = (tasaAnual / 100) / 12;
  
  let cuotaMensual = 0;
  
  if (tasaAnual === 0) {
    cuotaMensual = montoPrestamo / meses;
  } else {
    const factor = Math.pow(1 + tasaMensual, meses);
    cuotaMensual = montoPrestamo * (tasaMensual * factor) / (factor - 1);
  }

  const totalAPagar = (cuotaMensual * meses) + entrada;
  const totalIntereses = totalAPagar - precio;

  // Formateador de moneda
  const formatoMoneda = (num) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  // Mostrar resultados en los NUEVOS IDs
  document.getElementById('velox-fin-res-cuota').textContent = formatoMoneda(cuotaMensual);
  document.getElementById('velox-fin-res-monto').textContent = formatoMoneda(montoPrestamo);
  document.getElementById('velox-fin-res-interes').textContent = formatoMoneda(totalIntereses);
  document.getElementById('velox-fin-res-total').textContent = formatoMoneda(totalAPagar);
}

// Ejecutar cálculo inicial al cargar la página
document.addEventListener('DOMContentLoaded', calcularCuotaVelox);


function restablecerCalculadora() {
  // 1. Poner TODOS los valores monetarios y tasa en 0
  document.getElementById('velox-fin-precio').value = 0;
  document.getElementById('velox-fin-entrada').value = 0;
  document.getElementById('velox-fin-tasa').value = 0;
  


  // 2. Limpiar los resultados visualmente
  document.getElementById('velox-fin-res-cuota').textContent = "$0";
  document.getElementById('velox-fin-res-monto').textContent = "-";
  document.getElementById('velox-fin-res-interes').textContent = "-";
  document.getElementById('velox-fin-res-total').textContent = "-";
}