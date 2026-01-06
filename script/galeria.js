document.addEventListener('DOMContentLoaded', () => {
    const formGaleria = document.getElementById('formGaleria');
    const inputImagen = document.getElementById('imagenGaleria');
    const selectGaleria = document.getElementById('galeriaSelect');

    // Cargar imágenes guardadas al iniciar para mostrarlas en el Admin
    renderizarGaleriasAdmin();

    formGaleria.addEventListener('submit', async (e) => {
        e.preventDefault();

        const archivo = inputImagen.files[0];
        const galeriaDestino = selectGaleria.value;

        if (!archivo) return alert("Por favor selecciona una imagen");

        try {
            // 1. COMPRIMIR LA IMAGEN
            const imagenComprimida = await comprimirImagen(archivo);

            const nuevoItem = {
                id: Date.now(),
                src: imagenComprimida,
                galeria: galeriaDestino // Guardamos a qué galería pertenece
            };

            // Obtener datos existentes y agregar el nuevo
            const datosGuardados = JSON.parse(localStorage.getItem('galeria_db')) || [];
            
            // Opcional: Comprobar límite de almacenamiento
            if (datosGuardados.length > 50) {
                if(!confirm("Tienes muchas imágenes guardadas. Si agregas más, podrían borrarse las antiguas. ¿Continuar?")) return;
            }

            datosGuardados.push(nuevoItem);

            // Guardar en LocalStorage
            localStorage.setItem('galeria_db', JSON.stringify(datosGuardados));

            // Limpiar formulario y actualizar vista del Admin
            formGaleria.reset();
            renderizarGaleriasAdmin();
            alert('Imagen comprimida y agregada correctamente. Ya debería aparecer en el Index.');

        } catch (error) {
            console.error(error);
            alert('Error al procesar la imagen.');
        }
    });

    // ==========================================
    // FUNCIÓN DE COMPRESIÓN (Canvas)
    // ==========================================
    function comprimirImagen(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Reducimos el ancho máximo a 800px para ahorrar espacio
                    const MAX_WIDTH = 800; 
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Dibujar y exportar
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Calidad 70%
                    resolve(dataUrl);
                };

                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    }

    // ==========================================
    // RENDERIZAR SOLO EN EL ADMIN
    // ==========================================
    function renderizarGaleriasAdmin() {
        const datos = JSON.parse(localStorage.getItem('galeria_db')) || [];
        
        // Limpiar los contenedores internos del Admin
        document.getElementById('galeria1').innerHTML = '';
        document.getElementById('galeria2').innerHTML = '';
        document.getElementById('galeria3').innerHTML = '';

        datos.forEach(item => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 mb-3 position-relative';

            const img = document.createElement('img');
            img.src = item.src;
            img.className = 'img-fluid rounded shadow-sm w-100';
            img.style.height = '150px';
            img.style.objectFit = 'cover';

            // Botón de eliminar (Solo visible en Admin)
            const btnEliminar = document.createElement('button');
            btnEliminar.innerHTML = '&times;';
            btnEliminar.className = 'btn btn-danger btn-sm position-absolute top-0 end-0 m-1';
            btnEliminar.style.zIndex = '10';
            btnEliminar.onclick = () => eliminarImagen(item.id);

            col.appendChild(img);
            col.appendChild(btnEliminar);

            // Poner en la galería correcta del Admin según la propiedad 'item.galeria'
            const contenedorDestino = document.getElementById(item.galeria);
            if (contenedorDestino) {
                contenedorDestino.appendChild(col);
            }
        });
    }

    function eliminarImagen(id) {
        if(confirm('¿Borrar esta imagen?')) {
            let datos = JSON.parse(localStorage.getItem('galeria_db')) || [];
            datos = datos.filter(item => item.id !== id);
            localStorage.setItem('galeria_db', JSON.stringify(datos));
            renderizarGaleriasAdmin();
        }
    }
});