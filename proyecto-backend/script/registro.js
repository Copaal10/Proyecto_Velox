document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formRegistro');
  const nombre = document.getElementById('nombre');
  const telefono = document.getElementById('telefono');
  const email = document.getElementById('correoRegistro');
  const password = document.getElementById('passwordRegistro');
  const confirmPassword = document.getElementById('confirmPassword');

  const emailBox = document.getElementById('emailBox');
  const passwordBox = document.getElementById('passwordBox');
  const confirmBox = document.getElementById('confirmBox');

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

  // Email
  email.addEventListener('input', () => {
    emailBox.style.display = 'block';
    const ok = isValidEmail(email.value.trim());
    emailBox.textContent = ok ? "Correo válido" : "Correo inválido";
    emailBox.classList.toggle('text-success', ok);
    emailBox.classList.toggle('text-danger', !ok);
    setInputValidity(email, ok);
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
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailOk = isValidEmail(email.value.trim());
    const passOk = Object.values(passwordChecks(password.value)).every(Boolean);
    const confirmOk = confirmPassword.value === password.value && password.value.length > 0;
    const phoneOk = isValidPhone(telefono.value);
    const nombreOk = nombre.value.trim() !== "";

    setInputValidity(nombre, nombreOk);
    setInputValidity(email, emailOk);
    setInputValidity(password, passOk);
    setInputValidity(confirmPassword, confirmOk);
    setInputValidity(telefono, phoneOk);

    if (!nombreOk || !emailOk || !passOk || !confirmOk || !phoneOk) {
      alert("Por favor corrige los campos marcados antes de continuar.");
      return;
    }

    const usuario = {
      nombre: nombre.value.trim(),
      telefono: telefono.value.trim(),
      email: email.value.trim(),
      password: password.value
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));
    alert("Registro exitoso. Datos guardados localmente.");
    form.reset();

    // Mostrar todo como válido después del reset
    setInputValidity(nombre, true);
    setInputValidity(email, true);
    setInputValidity(password, true);
    setInputValidity(confirmPassword, true);
    setInputValidity(telefono, true);

    emailBox.textContent = "Correo válido";
    emailBox.classList.add("text-success");
    emailBox.classList.remove("text-danger");

    confirmBox.textContent = "Las contraseñas coinciden";
    confirmBox.classList.add("text-success");
    confirmBox.classList.remove("text-danger");

    setIndicator(ruleLength, true);
    setIndicator(ruleUpper, true);
    setIndicator(ruleLower, true);
    setIndicator(ruleNumber, true);
    setIndicator(ruleSpecial, true);
  });
});


document.addEventListener("DOMContentLoaded", () => {

  const btnLogin = document.getElementById("btnLoginView");
  const btnRegistro = document.getElementById("btnRegistroView");

  const cardLogin = document.getElementById("loginCard");
  const cardRegistro = document.getElementById("registroCard");

  // EVENTOS DE CAMBIO
  btnLogin.addEventListener("click", () => {
    cardLogin.style.display = "block";
    cardRegistro.style.display = "none";

    btnLogin.classList.add("active");
    btnRegistro.classList.remove("active");
  });

  btnRegistro.addEventListener("click", () => {
    cardLogin.style.display = "none";
    cardRegistro.style.display = "block";

    btnRegistro.classList.add("active");
    btnLogin.classList.remove("active");
  });

});
