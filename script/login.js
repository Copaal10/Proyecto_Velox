// script/login.js
function mostrarRegistro() {
  document.querySelector('.login-card').style.display = 'none';
  document.getElementById('cardRegistro').style.display = 'block';
}

function volverLogin() {
  document.querySelector('.login-card').style.display = 'block';
  document.getElementById('cardRegistro').style.display = 'none';
}