// script/agregarVehiculo.js
// Responsable: Capturar formulario y guardar en LocalStorage

document.addEventListener('DOMContentLoaded', () => {
    const formVehiculo = document.getElementById('formVehiculo');

    formVehiculo.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar recarga

        // Obtener y LIMPIAR datos (.trim() es vital)
        const marca = document.getElementById('marca').value.trim();
        const modelo = document.getElementById('modelo').value.trim();
        const anio = document.getElementById('anio').value.trim();
        const precio = document.getElementById('precio').value.trim();
        const archivoImagen = document.getElementById('imagen').files[0];
        const descripcion = document.getElementById('descripcion').value.trim();

        try {
            // 1. Procesar imagen (Async)
            const imagenBase64 = await comprimirImagen(archivoImagen);

            // 2. Crear objeto Vehículo
            const nuevoVehiculo = {
                id: Date.now(), // ID único
                marca: marca,
                modelo: modelo,
                anio: anio,
                precio: precio,
                imagen: imagenBase64,
                descripcion: descripcion
            };

            // 3. Guardar
            const datosGuardados = JSON.parse(localStorage.getItem('vehiculos')) || [];
            datosGuardados.push(nuevoVehiculo);
            localStorage.setItem('vehiculos', JSON.stringify(datosGuardados));
            console.log("Vehículo guardado en LocalStorage:", nuevoVehiculo); // DEBUG

            // 4. Limpiar formulario
            formVehiculo.reset();
            document.getElementById('imagen').value = ""; 

            // 5. Notificar al otro script para que redibuje
            document.dispatchEvent(new Event('vehiculoAgregado')); 
            
            alert('Vehículo registrado correctamente');

        } catch (error) {
            console.error("Error al registrar:", error);
            alert('Error al procesar la imagen. Intenta con una más pequeña.');
        }
    });

    // Función de compresión
    function comprimirImagen(archivo) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(archivo);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    const MAX_WIDTH = 800;
                    let width = img.width;
                    let height = img.height;
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    }
});