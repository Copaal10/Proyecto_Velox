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

  // Validación del correo - acepta múltiples TLDs (.com, .es, .co, etc)
  correo.addEventListener("input", function () {
    const valor = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

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

    // Validar correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
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

document.getElementById("form").addEventListener("submit", async function (e) {
  e.preventDefault(); // Evita redirección

  const form = e.target;

  const respuesta = await fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { "Accept": "application/json" }
  });

  if (respuesta.ok) {
    document.getElementById("respuesta").textContent = "✔ Enviado correctamente";
    form.reset();
  } else {
    document.getElementById("respuesta").textContent = "❌ Error al enviar";
  }
});

// ========== VALIDACIONES PARA FORMULARIO DE REGISTRO ==========

// Validación del formulario de registro
const formRegistro = document.getElementById('formRegistro');
if (formRegistro) {
  const correoRegistro = document.getElementById('correoRegistro');
  const passwordRegistro = document.getElementById('passwordRegistro');
  const confirmPassword = document.getElementById('confirmPassword');

  // Función para mostrar errores en formulario de registro
  function mostrarErrorRegistro(campo, mensaje) {
    // Remover error anterior si existe
    const errorExistente = campo.parentNode.querySelector(".error-mensaje");
    if (errorExistente) {
      errorExistente.remove();
    }

    // Remover clases de validación
    campo.classList.remove("is-invalid", "is-valid");

    if (mensaje) {
      // Mostrar nuevo error
      campo.classList.add("is-invalid");
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-mensaje text-danger mt-1 small";
      errorDiv.textContent = mensaje;
      campo.parentNode.appendChild(errorDiv);
    } else {
      // Marcar como válido si no hay error
      campo.classList.add("is-valid");
    }
  }

  // Validación de correo en tiempo real
  correoRegistro.addEventListener('input', function () {
    const valor = this.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (valor.length === 0) {
      mostrarErrorRegistro(this, "");
    } else if (!emailRegex.test(valor)) {
      mostrarErrorRegistro(this, "Por favor ingresa un correo electrónico válido");
    } else {
      mostrarErrorRegistro(this, "");
    }
  });

  // Validación de contraseña en tiempo real
  passwordRegistro.addEventListener('input', function() {
    const password = this.value;
    let requisitosDiv = document.getElementById('requisitos-password');
    
    // Crear el div de requisitos si no existe
    if (!requisitosDiv) {
      requisitosDiv = document.createElement('div');
      requisitosDiv.id = 'requisitos-password';
      requisitosDiv.className = 'mt-2 small';
      this.parentElement.appendChild(requisitosDiv);
    }
    
    // Si no hay texto, ocultar requisitos
    if (password.length === 0) {
      requisitosDiv.style.display = 'none';
      this.classList.remove("is-invalid", "is-valid");
      return;
    }
    
    requisitosDiv.style.display = 'block';
    
    // Verificar cada requisito
    const tiene8Caracteres = password.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const tieneEspecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Construir mensaje con checkmarks
    let mensaje = '<strong>Requisitos de la contraseña:</strong><br>';
    mensaje += tiene8Caracteres ? '✅ ' : '❌ ';
    mensaje += 'Mínimo 8 caracteres<br>';
    
    mensaje += tieneMayuscula ? '✅ ' : '❌ ';
    mensaje += 'Una letra mayúscula<br>';
    
    mensaje += tieneNumero ? '✅ ' : '❌ ';
    mensaje += 'Un número<br>';
    
    mensaje += tieneEspecial ? '✅ ' : '❌ ';
    mensaje += 'Un carácter especial (!@#$%&*...)';
    
    requisitosDiv.innerHTML = mensaje;
    
    // Marcar campo como válido o inválido
    if (tiene8Caracteres && tieneMayuscula && tieneNumero && tieneEspecial) {
      this.classList.remove("is-invalid");
      this.classList.add("is-valid");
    } else {
      this.classList.remove("is-valid");
      this.classList.add("is-invalid");
    }
  });

  // Validación de confirmación de contraseña en tiempo real
  confirmPassword.addEventListener('input', function() {
    const password = passwordRegistro.value;
    const confirmPass = this.value;
    
    if (confirmPass.length === 0) {
      mostrarErrorRegistro(this, "");
      return;
    }
    
    if (password !== confirmPass) {
      mostrarErrorRegistro(this, "Las contraseñas no coinciden");
    } else {
      mostrarErrorRegistro(this, "");
    }
  });

  // Validación al enviar el formulario de registro
  formRegistro.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const correo = correoRegistro.value.trim();
    const password = passwordRegistro.value;
    const confirmPass = confirmPassword.value;
    
    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(correo)) {
      mostrarAlerta('Por favor, introduce un correo electrónico válido.', 'danger');
      return;
    }
    
    // Validar longitud mínima de contraseña
    if (password.length < 8) {
      mostrarAlerta('La contraseña debe tener al menos 8 caracteres.', 'danger');
      return;
    }
    
    // Validar letra mayúscula
    if (!/[A-Z]/.test(password)) {
      mostrarAlerta('La contraseña debe contener al menos una letra mayúscula.', 'danger');
      return;
    }
    
    // Validar número
    if (!/[0-9]/.test(password)) {
      mostrarAlerta('La contraseña debe contener al menos un número.', 'danger');
      return;
    }
    
    // Validar carácter especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      mostrarAlerta('La contraseña debe contener al menos un carácter especial (!@#$%&*...).', 'danger');
      return;
    }
    
    // Validar que las contraseñas coincidan
    if (password !== confirmPass) {
      mostrarAlerta('Las contraseñas no coinciden. Por favor, verifica que sean iguales.', 'danger');
      return;
    }
    
    // Si todas las validaciones pasan
    mostrarAlerta('¡Registro exitoso! Bienvenido al Proyecto Velox.', 'success');
    
    // Limpiar formulario después del registro exitoso
    setTimeout(() => {
      formRegistro.reset();
      const requisitosDiv = document.getElementById('requisitos-password');
      if (requisitosDiv) requisitosDiv.remove();
    }, 2000);
  });
}

// ========== VALIDACIONES PARA FORMULARIO DE LOGIN ==========

const formLogin = document.getElementById('formLogin');
if (formLogin) {
  const emailLogin = document.getElementById('email');
  
  // Validación de correo en login
  formLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailLogin.value.trim();
    
    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      mostrarAlerta('Por favor, introduce un correo electrónico válido.', 'danger');
      return;
    }
    
    // Simular inicio de sesión
    mostrarAlerta('Iniciando sesión...', 'info');
    setTimeout(() => {
      window.location.href = 'admin.html';
    }, 1500);
  });
}

// Función para mostrar alertas flotantes
function mostrarAlerta(mensaje, tipo) {
  // Eliminar alertas anteriores
  const alertaAnterior = document.querySelector('.alert-custom');
  if (alertaAnterior) {
    alertaAnterior.remove();
  }
  
  // Crear nueva alerta
  const alerta = document.createElement('div');
  alerta.className = `alert alert-${tipo} alert-dismissible fade show alert-custom`;
  alerta.setAttribute('role', 'alert');
  alerta.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; min-width: 300px; max-width: 500px;';
  
  alerta.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  document.body.appendChild(alerta);
  
  // Auto-cerrar después de 5 segundos
  setTimeout(() => {
    if (alerta && alerta.parentNode) {
      alerta.remove();
    }
  }, 5000);
}