document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formRegistro');
  const nombre = document.getElementById('nombre');
  const apellido = document.getElementById('apellido');
  const telefono = document.getElementById('telefono');
  const direccion = document.getElementById('direccion');
  const email = document.getElementById('correoRegistro');
  const password = document.getElementById('passwordRegistro');
  const confirmPassword = document.getElementById('confirmPassword');

  const emailBox = document.getElementById('emailBox');
  const passwordBox = document.getElementById('passwordBox');
  const confirmBox = document.getElementById('confirmBox');
  const direccionBox = document.getElementById('direccionBox');

  const ruleLength = document.getElementById('rule-length');
  const ruleUpper = document.getElementById('rule-upper');
  const ruleLower = document.getElementById('rule-lower');
  const ruleNumber = document.getElementById('rule-number');
  const ruleSpecial = document.getElementById('rule-special');

  // Función para marcar campos como válidos/invalidos
  const setInputValidity = (input, ok) => {
    input.classList.toggle('is-valid', ok);
    input.classList.toggle('is-invalid', !ok);
  };

  // Función para marcar reglas y ejemplos <code>
  const setIndicator = (el, ok) => {
    el.classList.toggle('text-success', ok);
    el.classList.toggle('text-danger', !ok);

    const code = el.querySelectorAll('code');
    code.forEach(c => {
      c.classList.toggle('text-success', ok);
      c.classList.toggle('text-danger', !ok);
    });
  };

  // Validadores
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const passwordChecks = (value) => ({
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    special: /[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]/.test(value)
  });
  const isValidPhone = (value) => /^\+?\d{10,15}$/.test(value.replace(/\s/g, ''));
  const isValidNombre = (value) => value.trim().length >= 2;
  const isValidDireccion = (value) => value.trim().length >= 10;

  // Validación Nombre
  nombre.addEventListener('input', () => {
    const ok = isValidNombre(nombre.value);
    setInputValidity(nombre, ok);
  });

  // Validación Apellido
  apellido.addEventListener('input', () => {
    const ok = isValidNombre(apellido.value);
    setInputValidity(apellido, ok);
  });

  // Email
  email.addEventListener('input', () => {
    emailBox.style.display = 'block';
    const ok = isValidEmail(email.value.trim());
    emailBox.textContent = ok ? "Correo válido" : "Correo inválido";
    emailBox.classList.toggle('text-success', ok);
    emailBox.classList.toggle('text-danger', !ok);
    setInputValidity(email, ok);
  });

  // Dirección
  direccion.addEventListener('focus', () => direccionBox.style.display = 'block');
  direccion.addEventListener('blur', () => {
    if (direccion.value === "") direccionBox.style.display = 'none';
  });
  direccion.addEventListener('input', () => {
    const ok = isValidDireccion(direccion.value);
    setInputValidity(direccion, ok);

    direccionBox.style.display = 'block';

    if (ok) {
      direccionBox.textContent = "Dirección válida ✓";
      direccionBox.classList.remove('text-muted', 'text-danger');
      direccionBox.classList.add('text-success');
    } else {
      direccionBox.textContent = "La dirección debe tener al menos 10 caracteres";
      direccionBox.classList.remove('text-success', 'text-muted');
      direccionBox.classList.add('text-danger');
    }
  });

  // Password
  password.addEventListener('focus', () => passwordBox.style.display = 'block');
  password.addEventListener('blur', () => {
    if (password.value === "") passwordBox.style.display = 'none';
  });
  password.addEventListener('input', () => {
    const checks = passwordChecks(password.value);
    setIndicator(ruleLength, checks.length);
    setIndicator(ruleUpper, checks.upper);
    setIndicator(ruleLower, checks.lower);
    setIndicator(ruleNumber, checks.number);
    setIndicator(ruleSpecial, checks.special);

    const passOk = Object.values(checks).every(Boolean);
    setInputValidity(password, passOk);
  });

  // Confirmación
  confirmPassword.addEventListener('focus', () => confirmBox.style.display = 'block');
  confirmPassword.addEventListener('blur', () => {
    if (confirmPassword.value === "") confirmBox.style.display = 'none';
  });
  confirmPassword.addEventListener('input', () => {
    const match = confirmPassword.value === password.value && password.value.length > 0;
    confirmBox.textContent = match ? "Las contraseñas coinciden" : "La confirmación debe coincidir con la contraseña";
    confirmBox.classList.toggle('text-success', match);
    confirmBox.classList.toggle('text-danger', !match);
    setInputValidity(confirmPassword, match);
  });

  // Submit del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombreOk = isValidNombre(nombre.value);
    const apellidoOk = isValidNombre(apellido.value);
    const emailOk = isValidEmail(email.value.trim());
    const passOk = Object.values(passwordChecks(password.value)).every(Boolean);
    const confirmOk = confirmPassword.value === password.value && password.value.length > 0;
    const phoneOk = isValidPhone(telefono.value);
    const direccionOk = isValidDireccion(direccion.value);

    setInputValidity(nombre, nombreOk);
    setInputValidity(apellido, apellidoOk);
    setInputValidity(email, emailOk);
    setInputValidity(password, passOk);
    setInputValidity(confirmPassword, confirmOk);
    setInputValidity(telefono, phoneOk);
    setInputValidity(direccion, direccionOk);

    if (!nombreOk || !apellidoOk || !emailOk || !passOk || !confirmOk || !phoneOk || !direccionOk) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor corrige los campos marcados antes de continuar.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    const usuario = {
      email: email.value.trim(),
      clave: password.value,
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      direccion: direccion.value.trim() // ✅ AHORA SE ENVÍA LA DIRECCIÓN
    };

    try {
      console.log("📤 Enviando datos:", usuario);

      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Registro exitoso:", data);

        Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: "Tu cuenta ha sido creada. Ahora puedes iniciar sesión.",
          confirmButtonColor: "#65ABEA"
        }).then(() => {
          // Limpiar formulario y volver al login
          form.reset();

          // Limpiar validaciones
          [nombre, apellido, email, telefono, direccion, password, confirmPassword].forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
          });

          volverLogin();
        });
      } else {
        const errorData = await response.json();
        const errorText = errorData.error || await response.text();

        console.error("❌ Error del servidor:", errorText);

        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: errorText,
          confirmButtonColor: "#65ABEA"
        });
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudo conectar con el servidor. Intenta nuevamente.",
        confirmButtonColor: "#65ABEA"
      });
    }
  });
});

// Funciones auxiliares (deben estar fuera del DOMContentLoaded)
function mostrarRegistro() {
  document.querySelector('.login-card').style.display = 'none';
  document.getElementById('cardRegistro').style.display = 'block';
}

function volverLogin() {
  document.querySelector('.login-card').style.display = 'block';
  document.getElementById('cardRegistro').style.display = 'none';
}