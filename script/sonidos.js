document.addEventListener('DOMContentLoaded', () => {
  const formSonido = document.getElementById('formSonido');
  const inputNombre = document.getElementById('nombreSonido');
  const inputFoto = document.getElementById('imagenSonido');
  const inputAudio = document.getElementById('audioSonido');

  // Clave para guardar en el navegador
  const DB_KEY = 'velox_sonidos_db';

  // Función auxiliar para convertir archivos a texto (Base64)
  const leerComoBase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Cargar datos al iniciar
  let sonidos_db = JSON.parse(localStorage.getItem(DB_KEY)) || [];
  renderizarSonidos(); // Pintamos lo que ya existe

  formSonido.addEventListener('submit', async (e) => {
    e.preventDefault();

    const archivoFoto = inputFoto.files[0];
    const archivoAudio = inputAudio.files[0];

    if (!archivoFoto || !archivoAudio) {
      return alert("Por favor selecciona foto y audio");
    }

    try {
      // Convertimos ambos archivos a Base64 para poder guardarlos en LocalStorage
      const fotoBase64 = await leerComoBase64(archivoFoto);
      const audioBase64 = await leerComoBase64(archivoAudio);

      const nuevoSonido = {
        id: Date.now(),
        nombre: inputNombre.value,
        foto: fotoBase64,
        audio: audioBase64
      };

      // Guardar en el array y en LocalStorage
      sonidos_db.push(nuevoSonido);
      localStorage.setItem(DB_KEY, JSON.stringify(sonidos_db));

      renderizarSonidos();
      formSonido.reset();
      alert('Sonido registrado correctamente y guardado.');
      
    } catch (error) {
      console.error(error);
      alert('Hubo un error al procesar los archivos. Quizás el audio es muy grande.');
    }
  });

  function renderizarSonidos() {
    const contenedor = document.getElementById('resultadoSonidos');
    contenedor.innerHTML = '';

    sonidos_db.forEach(item => {
      const col = document.createElement('div');
      col.className = 'col-md-6 mb-4';

      const card = document.createElement('div');
      card.className = 'card h-100 shadow-sm';

      const img = document.createElement('img');
      img.src = item.foto;
      img.className = 'card-img-top';
      img.style.height = '180px';
      img.style.objectFit = 'cover';

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const titulo = document.createElement('h5');
      titulo.className = 'card-title';
      titulo.textContent = item.nombre;

      const audio = document.createElement('audio');
      audio.src = item.audio;
      audio.controls = true;
      audio.className = 'w-100 mt-2';

      const btnEliminar = document.createElement('button');
      btnEliminar.textContent = 'Eliminar';
      btnEliminar.className = 'btn btn-outline-danger btn-sm w-100 mt-2';
      btnEliminar.onclick = () => eliminarSonido(item.id);

      cardBody.appendChild(titulo);
      cardBody.appendChild(audio);
      cardBody.appendChild(btnEliminar);

      card.appendChild(img);
      card.appendChild(cardBody);
      col.appendChild(card);
      contenedor.appendChild(col);
    });
  }

  function eliminarSonido(id) {
    if (confirm('¿Eliminar este sonido?')) {
      // Filtramos el array
      sonidos_db = sonidos_db.filter(item => item.id !== id);
      // Actualizamos LocalStorage
      localStorage.setItem(DB_KEY, JSON.stringify(sonidos_db));
      renderizarSonidos();
    }
  }
});