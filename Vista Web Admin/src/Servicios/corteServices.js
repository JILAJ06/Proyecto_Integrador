// === Corte de Caja ===

export function inicializarCorteCaja() {
    const cargarBtn = document.getElementById('cargarCajaBtn');
    const toggleCajaBtn = document.getElementById('toggleCajaBtn');
    let cajaAbierta = false;
    let idCorteCajaActual = null;

    // Cargar datos al iniciar o al hacer clic
    if (cargarBtn) {
        cargarBtn.addEventListener('click', () => cargarDatosCaja());
    }

    // Abrir o cerrar caja
    toggleCajaBtn.addEventListener('click', async () => {
        if (cajaAbierta) {
            // Cerrar caja
            cajaAbierta = false;
            toggleCajaBtn.textContent = 'Abrir caja';
            toggleCajaBtn.classList.add('cerrada');
            mostrarAlerta('Caja cerrada');
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
            const res = await fetch(`http://localhost:8080/negocio/${idNegocio}/corteCaja/${nombreUsuario}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cantidad: cantidad, // Cantidad inicial al abrir la caja
                })
            });

            if (!res.ok) throw new Error("No se pudo abrir la caja");

            const datos = await res.json(); // Aquí se parseará correctamente el JSON
            idCorteCajaActual = datos.idCorteCaja; // Guardar el ID del nuevo corte
            mostrarAlerta("Caja abierta con éxito");
            cargarDatosCaja();
        } catch (err) {
            console.error("❌ Error al abrir caja:", err.message);
            mostrarAlerta("Error al abrir caja: " + err.message);
        }

        cerrarModalAbrirCaja();
    };
}

// === GET Corte de Caja Activa ===

async function cargarDatosCaja() {
    const idNegocio = sessionStorage.getItem("negocioId");
    if (!idNegocio) {
        console.warn("ID de negocio no encontrado en sesión");
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/negocio/${idNegocio}/corteCaja/${idCorteCajaActual}`);
        if (!res.ok) throw new Error("No hay caja activa");

        const datos = await res.json();
        console.log("Datos de corte de caja:", datos);

        // Extraer datos del JSON
        const cantidadInicial = parseFloat(datos.cantidadInicial || 0);
        const totalVentas = parseFloat(datos.totalVentas || 0);

        // Calcular margen de ganancia si no está en el JSON
        let margenGanancias = parseFloat(datos.ganancias || 0);
        if (datos.ventas && datos.ventas.length > 0) {
            margenGanancias = datos.ventas.reduce((total, venta) => {
                const margen = venta.precioVenta - venta.costo; // Asegúrate de que el backend envíe estos campos
                return total + margen;
            }, 0);
        }

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
        console.warn("⚠️ No hay caja activa:", err.message);
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

// === Alerta visual ===
function mostrarAlerta(mensaje) {
    const alerta = document.createElement('div');
    alerta.className = 'custom-alert';
    alerta.textContent = mensaje;
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 2500);
}
