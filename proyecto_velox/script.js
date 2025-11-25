document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.querySelector("form");
  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const telefono = document.getElementById("telefono");
  const mensaje = document.getElementById("mensaje");

  // Función para mostrar errores
  function mostrarError(campo, mensaje) {
    // Remover error anterior si existe
    const errorExistente =
      campo.parentNode.parentNode.querySelector(".error-mensaje");
    if (errorExistente) {
      errorExistente.remove();
    }

    // Remover clase de error del input
    campo.classList.remove("is-invalid");

    if (mensaje) {
      // Mostrar nuevo error
      campo.classList.add("is-invalid");
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-mensaje text-danger mt-1 small";
      errorDiv.textContent = mensaje;
      campo.parentNode.parentNode.appendChild(errorDiv);
    }
  }

  // Validación del nombre
  nombre.addEventListener("input", function () {
    const valor = this.value.trim();
    if (valor.length < 2) {
      mostrarError(this, "El nombre debe tener al menos 2 caracteres");
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
      mostrarError(this, "El nombre solo puede contener letras y espacios");
    } else {
      mostrarError(this, "");
      this.classList.add("is-valid");
    }
  });

  // Validación del correo
  correo.addEventListener("input", function () {
    const valor = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(valor)) {
      mostrarError(this, "Por favor ingresa un correo electrónico válido");
    } else {
      mostrarError(this, "");
      this.classList.add("is-valid");
    }
  });

  // Validación del teléfono
  telefono.addEventListener("input", function () {
    let valor = this.value.replace(/\D/g, ""); // Remover caracteres no numéricos
    this.value = valor; // Actualizar el valor del input

    if (valor.length > 10) {
      valor = valor.substring(0, 10); // Limitar a 10 caracteres
      this.value = valor;
    }

    if (valor.length < 10 && valor.length > 0) {
      mostrarError(this, "El teléfono debe tener 10 dígitos");
    } else if (valor.length === 10) {
      mostrarError(this, "");
      this.classList.add("is-valid");
    } else {
      mostrarError(this, "");
    }
  });

  // Validación del mensaje
  mensaje.addEventListener("input", function () {
    const valor = this.value.trim();
    if (valor.length < 10) {
      mostrarError(this, "El mensaje debe tener al menos 10 caracteres");
    } else {
      mostrarError(this, "");
      this.classList.add("is-valid");
    }
  });

  // Prevenir envío del formulario si hay errores
  formulario.addEventListener("submit", function (e) {
    let formularioValido = true;

    // Validar nombre
    if (nombre.value.trim().length < 2) {
      mostrarError(nombre, "El nombre debe tener al menos 2 caracteres");
      formularioValido = false;
    }

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.value.trim())) {
      mostrarError(correo, "Por favor ingresa un correo electrónico válido");
      formularioValido = false;
    }

    // Validar teléfono (si se ingresó)
    if (telefono.value && telefono.value.length !== 10) {
      mostrarError(telefono, "El teléfono debe tener 10 dígitos");
      formularioValido = false;
    }

    // Validar mensaje
    if (mensaje.value.trim().length < 10) {
      mostrarError(mensaje, "El mensaje debe tener al menos 10 caracteres");
      formularioValido = false;
    }

    if (!formularioValido) {
      e.preventDefault();
    }
  });

  // Limpiar clases de validación al enfocar
  const inputs = [nombre, correo, telefono, mensaje];
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.classList.remove("is-invalid", "is-valid");
    });
  });
});
