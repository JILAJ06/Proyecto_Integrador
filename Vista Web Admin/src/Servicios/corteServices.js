// Función para cargar los datos de la caja en la vista de Corte de Caja
function cargarDatosCajaDemo() {
    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-MX');
    document.getElementById('fecha').textContent = fechaStr;
    document.getElementById('empleado').textContent = 'Juan Chin Chin';
    document.getElementById('cantidadInicial').textContent = '$1,000.00';
    document.getElementById('ingresos').textContent = '$2,500.00';
    document.getElementById('ganancias').textContent = '$1,500.00';
    document.getElementById('totalEntregar').textContent = '$2,500.00';
}

// Lógica principal de Corte de Caja
export function inicializarCorteCaja() {
    // Botón de cargar caja demo
    const cargarBtn = document.getElementById('cargarCajaBtn');
    if (cargarBtn) {
        cargarBtn.addEventListener('click', cargarDatosCajaDemo);
    }
    const toggleCajaBtn = document.getElementById('toggleCajaBtn');
    let cajaCerrada = false;
    toggleCajaBtn.addEventListener('click', function() {
        cajaCerrada = !cajaCerrada;
        if (cajaCerrada) {
            toggleCajaBtn.textContent = 'Abrir caja';
            toggleCajaBtn.classList.add('abierta');
            // Poner valores en cero
            document.getElementById('fecha').textContent = '--/--/----';
            document.getElementById('empleado').textContent = '------';
            document.getElementById('cantidadInicial').textContent = '$0.00';
            document.getElementById('ingresos').textContent = '$0.00';
            document.getElementById('ganancias').textContent = '$0.00';
            document.getElementById('totalEntregar').textContent = '$0.00';
            mostrarAlerta('Acabas de cerrar la caja');
        } else {
            toggleCajaBtn.textContent = 'Cerrar caja';
            toggleCajaBtn.classList.remove('abierta');
            // Mostrar modal para abrir caja
            document.getElementById('modalAbrirCaja').style.display = 'flex';
            setTimeout(() => {
                document.getElementById('cantidadInicialInput').focus();
            }, 200);
        }
    });

    // Lógica para cerrar el modal
    document.getElementById('cerrarModalAbrirCaja').onclick = cerrarModalAbrirCaja;
    document.getElementById('cancelarAbrirCaja').onclick = cerrarModalAbrirCaja;
    function cerrarModalAbrirCaja() {
        document.getElementById('modalAbrirCaja').style.display = 'none';
        document.getElementById('formAbrirCaja').reset();
    }

    // Lógica para aceptar el formulario
    document.getElementById('formAbrirCaja').onsubmit = function(e) {
        e.preventDefault();
        const cantidad = parseFloat(document.getElementById('cantidadInicialInput').value) || 0;
        document.getElementById('cantidadInicial').textContent = `$${cantidad.toLocaleString('es-MX', {minimumFractionDigits:2})}`;
        cerrarModalAbrirCaja();
        mostrarAlerta('Caja abierta con éxito');
    };

    // Función para mostrar alerta personalizada
    function mostrarAlerta(mensaje) {
        const alerta = document.createElement('div');
        alerta.className = 'custom-alert';
        alerta.textContent = mensaje;
        document.body.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 2500);
    }
}
 