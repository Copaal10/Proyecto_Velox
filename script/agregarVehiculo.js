// archivo: agregarVehiculo.js

// Capturamos el formulario y el contenedor de resultados
const form = document.getElementById('formVehiculo');
const resultado = document.getElementById('resultado');

// Recuperar vehículos guardados previamente en localStorage
let vehiculos = JSON.parse(localStorage.getItem('vehiculos')) || [];

// Función para renderizar todos los vehículos guardados



// Evento submit del formulario
form.addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtenemos valores del formulario
  const marca = document.getElementById('marca').value;
  const modelo = document.getElementById('modelo').value;
  const anio = document.getElementById('anio').value;
  const precio = document.getElementById('precio').value;
  const descripcion = document.getElementById('descripcion').value;
  const imagenInput = document.getElementById('imagen');

  // Convertimos la imagen a base64 para guardarla en localStorage
  if (imagenInput.files && imagenInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const vehiculo = {
        marca,
        modelo,
        anio,
        precio,
        descripcion,
        imagen: e.target.result
      };

      // Guardamos en el array y en localStorage
      vehiculos.push(vehiculo);
      localStorage.setItem('vehiculos', JSON.stringify(vehiculos));


      // Limpiamos el formulario
      form.reset();

      // Mostramos alerta
      alert("Su vehículo ha sido guardado");
      window.location.href = "listar.html";

    };
    reader.readAsDataURL(imagenInput.files[0]);
  } else {
    // Si no hay imagen, igual guardamos
    const vehiculo = { marca, modelo, anio, precio, descripcion, imagen: "" };
    vehiculos.push(vehiculo);
    localStorage.setItem('vehiculos', JSON.stringify(vehiculos));
    form.reset();

    // Mostramos alerta
    alert("Su vehículo ha sido guardado");
    window.location.href = "listar.html";

  }
});