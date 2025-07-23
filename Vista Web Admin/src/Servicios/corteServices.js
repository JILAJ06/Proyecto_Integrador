// === Corte de Caja ===

let idCorteCajaActual = null; // Variable global para almacenar el ID del corte de caja actual

export function inicializarCorteCaja() {
    const cargarBtn = document.getElementById('cargarCajaBtn');
    const toggleCajaBtn = document.getElementById('toggleCajaBtn');
    let cajaAbierta = false;

    // Cargar datos al iniciar o al hacer clic
    if (cargarBtn) {
        cargarBtn.addEventListener('click', () => obtenerDatosCorteCajaActivo());
    }

    // Abrir o cerrar caja
    toggleCajaBtn.addEventListener('click', async () => {
        if (cajaAbierta) {
            // Cerrar caja
            cajaAbierta = false;
            toggleCajaBtn.textContent = 'Abrir caja';
            toggleCajaBtn.classList.add('cerrada');
            window.mostrarAlertaGlobal('Caja cerrada', 'info');
            limpiarVistaCaja();
            idCorteCajaActual = null; // Reiniciar el ID del corte actual
        } else {
            // Abrir caja
            cajaAbierta = true;
            toggleCajaBtn.textContent = 'Cerrar caja';
            toggleCajaBtn.classList.remove('cerrada');
            document.getElementById('modalAbrirCaja').style.display = 'flex';
            setTimeout(() => {
                document.getElementById('cantidadInicialInput').focus();
            }, 200);
        }
    });

    // Cerrar modal
    document.getElementById('cerrarModalAbrirCaja').onclick = cerrarModalAbrirCaja;
    document.getElementById('cancelarAbrirCaja').onclick = cerrarModalAbrirCaja;

    function cerrarModalAbrirCaja() {
        document.getElementById('modalAbrirCaja').style.display = 'none';
        document.getElementById('formAbrirCaja').reset();
    }

    // === POST para abrir caja ===
    document.getElementById('formAbrirCaja').onsubmit = async function (e) {
        e.preventDefault();

        const cantidad = parseFloat(document.getElementById('cantidadInicialInput').value) || 0;
        const idNegocio = sessionStorage.getItem("negocioId");
        const nombreUsuario = sessionStorage.getItem("nombreUsuario");

        try {
            // POST para abrir caja
            const resPost = await fetch(`http://54.198.31.200:8080/negocio/${idNegocio}/corteCaja/${nombreUsuario}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cantidad: cantidad, // Cantidad inicial al abrir la caja
                })
            });

            if (!resPost.ok) throw new Error("No se pudo abrir la caja");

            const datosPost = await resPost.json();
            idCorteCajaActual = datosPost.idCorteCaja; // Guardar el ID del nuevo corte
            window.mostrarAlertaGlobal('Caja abierta con éxito', 'success');

            // Obtener datos del corte de caja activo
            obtenerDatosCorteCajaActivo();
        } catch (err) {
            console.error("❌ Error:", err.message);
            window.mostrarAlertaGlobal('Error al abrir caja: ' + err.message, 'error');
        }

        cerrarModalAbrirCaja();
    };
}

// === GET para cargar datos del corte de caja activo ===
async function obtenerDatosCorteCajaActivo() {
    const idNegocio = sessionStorage.getItem("negocioId");

    try {
        const resGet = await fetch(`http://54.198.31.200:8080/negocio/${idNegocio}/corteCaja`);
        if (!resGet.ok) throw new Error("No hay caja activa");

        const datosGet = await resGet.json();
        console.log("Datos de corte de caja activo:", datosGet);

        // Actualizar la vista con los datos obtenidos
        cargarDatosCaja(datosGet);
    } catch (err) {
        console.error("❌ Error al obtener datos del corte de caja:", err.message);
        window.mostrarAlertaGlobal('Error al obtener datos del corte de caja: ' + err.message, 'error');
        limpiarVistaCaja();
    }
}

// === Actualizar la vista con los datos del corte de caja ===
async function cargarDatosCaja(datos) {
    try {
        const cantidadInicial = parseFloat(datos.cantidadInicial || 0);
        const totalVentas = parseFloat(datos.totalVentas || 0);
        const margenGanancias = parseFloat(datos.ganancias || 0);

        // Si no hay ventas, los valores deben ser 0
        const totalEntregar = cantidadInicial + totalVentas;

        // Actualizar la vista
        const fechaInicio = new Date(datos.fechaInicio || Date.now());
        document.getElementById('fecha').textContent = fechaInicio.toLocaleDateString('es-MX');
        document.getElementById('empleado').textContent = datos.usuario?.nombreUsuario || '---';
        document.getElementById('cantidadInicial').textContent = `$${cantidadInicial.toFixed(2)}`;
        document.getElementById('ingresos').textContent = `$${totalVentas.toFixed(2)}`;
        document.getElementById('ganancias').textContent = `$${margenGanancias.toFixed(2)}`;
        document.getElementById('totalEntregar').textContent = `$${totalEntregar.toFixed(2)}`;
    } catch (err) {
        console.warn("⚠️ Error al cargar datos del corte de caja:", err.message);
        window.mostrarAlertaGlobal('Error al cargar datos del corte de caja: ' + err.message, 'error');
        limpiarVistaCaja();
    }
}

// === Limpiar vista ===
function limpiarVistaCaja() {
    document.getElementById('fecha').textContent = '--/--/----';
    document.getElementById('empleado').textContent = '------';
    document.getElementById('cantidadInicial').textContent = '$0.00';
    document.getElementById('ingresos').textContent = '$0.00';
    document.getElementById('ganancias').textContent = '$0.00';
    document.getElementById('totalEntregar').textContent = '$0.00';
}

// El sistema de alertas ahora usa window.mostrarAlertaGlobal para todos los mensajes visuales.
