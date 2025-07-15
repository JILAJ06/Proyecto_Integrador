 document.getElementById('cargarCajaBtn').addEventListener('click', function() {

        // Simulación de datos
            const fecha = new Date();
            const fechaStr = fecha.toLocaleDateString('es-MX');
            document.getElementById('fecha').textContent = fechaStr;
            document.getElementById('empleado').textContent = 'Juan Chin Chin';
            document.getElementById('cantidadInicial').textContent = '$1,000.00';
            document.getElementById('ingresos').textContent = '$2,500.00';
            document.getElementById('ganancias').textContent = '$1,500.00';
            document.getElementById('totalEntregar').textContent = '$2,500.00';
        });