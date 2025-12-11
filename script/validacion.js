const passwordInput = document.getElementById("passwordRegistro");

const reqLength = document.getElementById("req-length");
const reqUpper = document.getElementById("req-upper");
const reqNumber = document.getElementById("req-number");

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;

  // 1. Mínimo 8 caracteres
  if (value.length >= 8) reqLength.classList.replace("invalid", "valid");
  else reqLength.classList.replace("valid", "invalid");

  // 2. Al menos una mayúscula
  if (/[A-Z]/.test(value)) reqUpper.classList.replace("invalid", "valid");
  else reqUpper.classList.replace("valid", "invalid");

  // 3. Al menos un número
  if (/\d/.test(value)) reqNumber.classList.replace("invalid", "valid");
  else reqNumber.classList.replace("valid", "invalid");
});
