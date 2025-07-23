// formsVentas.js - Sistema de ventas optimizado para escaneo directo
import { VentasServices } from '../Servicios/ventasServices.js';

document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const tabla = document.querySelector(".products-table tbody");
    const btnPagar = document.querySelector(".btn-pay");
    const totalAmount = document.querySelector(".total-amount");

    // Variables globales del sistema de ventas
    let ventaActiva = false;
    let ventaId = null;
    let listaProductos = []; // Array con formato específico para detalles de venta
    let contadorProductos = {}; // Para contar cuántas veces se escanea cada producto
    let inputEscaneo = null;

    // Verificar que los elementos existen
    if (!btnPagar) {
        console.error('❌ No se encontró el botón de pagar (.btn-pay)');
        return;
    }

    // Inicializar aplicación
    async function init() {
        console.log('🚀 Iniciando sistema de ventas...');
        
        // Configurar input de escaneo
        configurarInputEscaneo();
        
        // Configurar event listeners
        setupEventListeners();
        
        // Iniciar venta automáticamente al cargar la página
        await iniciarVentaAutomatica();
        
        // Actualizar interfaz
        actualizarInterfaz();
        
        console.log('✅ Sistema de ventas listo para escanear productos');
    }

    // Configurar input invisible para capturar escaneos de código de barras
    function configurarInputEscaneo() {
        inputEscaneo = document.createElement('input');
        inputEscaneo.type = 'text';
        inputEscaneo.style.cssText = `
            position: absolute;
            top: -9999px;
            left: -9999px;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
            z-index: -9999;
        `;
        inputEscaneo.id = 'input-escaneo-invisible';
        
        // Event listener para capturar escaneos
        inputEscaneo.addEventListener('keypress', async (e) => {
            // Solo procesar si el input está habilitado Y no hay modal abierto
            if (inputEscaneo.disabled || document.getElementById('modal-pago')) return;
            
            if (e.key === 'Enter') {
                const codigo = inputEscaneo.value.trim();
                if (codigo) {
                    await procesarEscaneoProducto(codigo);
                    inputEscaneo.value = ''; // Limpiar input
                }
            }
        });
        
        document.body.appendChild(inputEscaneo);
        
        // Mantener focus SOLO cuando no hay modal y no se está interactuando con otros elementos
        let ultimoFocusManual = null;
        
        document.addEventListener('focusin', (e) => {
            ultimoFocusManual = e.target;
        });
        
        document.addEventListener('click', (e) => {
    // Si hay un modal abierto, no manejar focus
    if (document.getElementById('modal-pago')) return;

    const interactivos = ['INPUT', 'BUTTON', 'TEXTAREA', 'SELECT', 'A'];
    
    // Si el target o alguno de sus padres es interactivo, no forzar focus
    let elemento = e.target;
    while (elemento) {
        if (
            interactivos.includes(elemento.tagName) || 
            elemento.hasAttribute('contenteditable') || 
            elemento.classList.contains('modal-btn-pagar') ||
            elemento.classList.contains('btn-pay') ||
            elemento.closest('.cantidad-controls') || 
            elemento.classList.contains('btn-eliminar-producto')
        ) {
            return;
        }
        elemento = elemento.parentElement;
    }

    // Si no hay otro elemento enfocado, devolver el focus al input de escaneo
    setTimeout(() => {
        if (!document.querySelector(':focus') || document.activeElement === document.body) {
            inputEscaneo.focus();
        }
    }, 50);
});
        // Focus inicial
        setTimeout(() => inputEscaneo.focus(), 100);
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Event listener principal para el botón pagar
        btnPagar.addEventListener("click", (e) => {
            e.preventDefault();
            console.log('🔥 Botón pagar clickeado');
            procesarPago();
        });

        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F2') { // F2 para pagar
                e.preventDefault();
                procesarPago();
            }
            if (e.key === 'Escape') { // ESC para cancelar
                e.preventDefault();
                confirmarCancelacion();
            }
        });
    }

    // ===== PASO 1: INICIAR VENTA AUTOMÁTICA =====
    async function iniciarVentaAutomatica() {
        try {
            console.log('🔄 Iniciando venta automáticamente...');
            
            const resultado = await VentasServices.iniciarVenta();
            
            ventaActiva = true;
            ventaId = resultado.idVenta || resultado.id;
            
            mostrarNotificacion('Nueva venta iniciada automáticamente', 'success');
            console.log('✅ Venta iniciada. ID:', ventaId);
            
            return resultado;
            
        } catch (error) {
            console.error('❌ Error al iniciar venta automática:', error);
            mostrarNotificacion('Error al iniciar venta: ' + error.message, 'error');
            throw error;
        }
    }

    // ===== PASO 2: PROCESAR ESCANEO DE PRODUCTO =====
    async function procesarEscaneoProducto(codigoProducto) {
        if (!ventaActiva) {
            await iniciarVentaAutomatica();
        }

        try {
            console.log('📱 Procesando escaneo del producto:', codigoProducto);
            
            // Consultar producto
            const producto = await VentasServices.consultarProductoPorCodigo(codigoProducto);
            
            // Incrementar contador de este producto (cantidad)
            if (!contadorProductos[codigoProducto]) {
                contadorProductos[codigoProducto] = 0;
            }
            contadorProductos[codigoProducto]++;
            
            // Mapear producto al formato requerido
            const detalleVenta = VentasServices.mapearProductoADetalleVenta(
                producto, 
                contadorProductos[codigoProducto]
            );
            
            // Actualizar o agregar producto en la lista
            actualizarProductoEnLista(detalleVenta);
            
            // Actualizar interfaz
            actualizarTablaProductos();
            actualizarTotales();
            
            // Feedback visual y sonoro
            mostrarNotificacion(`Producto agregado: ${detalleVenta.nombreProducto}`, 'success');
            reproducirSonidoExito();
            
            console.log('✅ Producto procesado:', detalleVenta);
            
        } catch (error) {
            console.error('❌ Error al procesar escaneo:', error);
            mostrarNotificacion('Producto no encontrado: ' + error.message, 'error');
            reproducirSonidoError();
        }
    }

    // Actualizar producto en la lista (o agregarlo si no existe)
    function actualizarProductoEnLista(nuevoDetalle) {
        const indiceExistente = listaProductos.findIndex(item => 
            item.codigoProducto === nuevoDetalle.codigoProducto
        );
        
        if (indiceExistente !== -1) {
            // Actualizar producto existente
            listaProductos[indiceExistente] = nuevoDetalle;
        } else {
            // Agregar nuevo producto
            listaProductos.push(nuevoDetalle);
        }
    }

    // ===== ACTUALIZAR INTERFAZ =====
    function actualizarTablaProductos() {
        if (!tabla) return;
        
        tabla.innerHTML = '';
        
        listaProductos.forEach((item, index) => {
            const fila = document.createElement("tr");
            fila.dataset.index = index;
            fila.innerHTML = `
                <td>${item.codigoProducto}</td>
                <td>${item.nombreProducto}</td>
                <td>${VentasServices.formatearPrecio(item.precioUnitario)}</td>
                <td>
                    <div class="cantidad-controls">
                        <button class="btn-cantidad-menos" data-index="${index}">-</button>
                        <span class="cantidad-valor">${item.cantidad}</span>
                        <button class="btn-cantidad-mas" data-index="${index}">+</button>
                    </div>
                </td>
                <td>${VentasServices.formatearPrecio(item.subtotal)}</td>
                <td>
                    <button class="btn-eliminar-producto" data-index="${index}" title="Eliminar producto">
                        🗑️
                    </button>
                </td>
            `;
            
            // Efecto de producto recién agregado
            if (index === listaProductos.length - 1) {
                fila.classList.add('producto-nuevo');
                setTimeout(() => fila.classList.remove('producto-nuevo'), 1000);
            }
            
            tabla.appendChild(fila);
        });
        
        // Agregar event listeners para los botones de cantidad y eliminar
        agregarEventListenersTabla();
    }

    // Función para agregar event listeners a los elementos de la tabla
    function agregarEventListenersTabla() {
        // Botones de eliminar producto
        document.querySelectorAll('.btn-eliminar-producto').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                eliminarProducto(index);
            });
        });
        
        // Botones de aumentar cantidad
        document.querySelectorAll('.btn-cantidad-mas').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                cambiarCantidadProducto(index, 1);
            });
        });
        
        // Botones de disminuir cantidad
        document.querySelectorAll('.btn-cantidad-menos').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                cambiarCantidadProducto(index, -1);
            });
        });
    }

    // Función para eliminar un producto de la lista
    function eliminarProducto(index) {
        if (index >= 0 && index < listaProductos.length) {
            const producto = listaProductos[index];
            
            // Mostrar confirmación
            if (confirm(`¿Eliminar "${producto.nombreProducto}" de la venta?`)) {
                // Eliminar del array
                listaProductos.splice(index, 1);
                
                // Actualizar contador de productos
                if (contadorProductos[producto.codigoProducto]) {
                    delete contadorProductos[producto.codigoProducto];
                }
                
                // Actualizar interfaz
                actualizarTablaProductos();
                actualizarTotales();
                actualizarInterfaz();
                
                mostrarNotificacion(`Producto "${producto.nombreProducto}" eliminado`, 'warning');
                console.log('🗑️ Producto eliminado:', producto);
            }
        }
    }

    // Función para cambiar la cantidad de un producto
    function cambiarCantidadProducto(index, cambio) {
        if (index >= 0 && index < listaProductos.length) {
            const producto = listaProductos[index];
            const nuevaCantidad = producto.cantidad + cambio;
            
            if (nuevaCantidad <= 0) {
                // Si la cantidad llega a 0 o menos, eliminar el producto
                eliminarProducto(index);
                return;
            }
            
            // Actualizar cantidad y subtotal
            producto.cantidad = nuevaCantidad;
            producto.subtotal = parseFloat((producto.precioUnitario * nuevaCantidad).toFixed(2));
            
            // Actualizar contador global
            contadorProductos[producto.codigoProducto] = nuevaCantidad;
            
            // Actualizar interfaz
            actualizarTablaProductos();
            actualizarTotales();
            
            mostrarNotificacion(`Cantidad actualizada: ${producto.nombreProducto} (${nuevaCantidad})`, 'info');
            console.log('📊 Cantidad actualizada:', producto);
        }
    }

    // ===== ACTUALIZAR INTERFAZ =====
    function actualizarTotales() {
        if (!totalAmount) return;
        
        const totales = VentasServices.calcularTotales(listaProductos);
        totalAmount.textContent = VentasServices.formatearPrecio(totales.total);
    }

    function actualizarInterfaz() {

        
        // Mostrar información de estado
        const estadoVenta = document.querySelector('.session-info');
        if (estadoVenta && ventaActiva) {
            estadoVenta.innerHTML = `Venta Activa<br>Productos: ${listaProductos.length}`;
        }
    }

    // ===== PASO 3: PROCESAR PAGO =====
    function procesarPago() {
        console.log('💳 Procesando pago...');
        console.log('Lista de productos:', listaProductos);
        
        if (listaProductos.length === 0) {
            mostrarNotificacion('No hay productos en la venta', 'warning');
            return;
        }

        // Crear y mostrar modal de pago
        crearModalPago();
    }

    // ===== MODAL DE PAGO DINÁMICO =====
    function crearModalPago() {
        // **IMPORTANTE: Pausar completamente el sistema de escaneo**
        pausarSistemaEscaneo();
        
        // Blur cualquier elemento que tenga focus
        if (document.activeElement && document.activeElement.blur) {
            document.activeElement.blur();
        }

        // Remover modal existente si existe
        const modalExistente = document.getElementById('modal-pago');
        if (modalExistente) {
            modalExistente.remove();
        }

        // Remover estilos existentes
        const styleExistente = document.getElementById('modal-pago-style-temp');
        if (styleExistente) {
            styleExistente.remove();
        }

        const modalPago = document.createElement('div');
        modalPago.id = 'modal-pago';
        modalPago.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-row">
                    <span class="modal-label">Total</span>
                    <span class="modal-value" id="modal-total"></span>
                </div>
                <div class="modal-row">
                    <span class="modal-label">Pagó</span>
                    <input type="number" min="0" step="0.01" class="modal-input" id="modal-pago-input" placeholder="0.00" autocomplete="off">
                </div>
                <div class="modal-row">
                    <span class="modal-label">Cambio</span>
                    <span class="modal-value" id="modal-cambio">$0.00</span>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn-cancelar" type="button">Cancelar</button>
                    <button class="modal-btn-pagar" type="button">Pagar</button>
                </div>
            </div>
        `;

        // Agregar estilos mejorados con mayor especificidad
        const style = document.createElement('style');
        style.id = 'modal-pago-style-temp';
        style.textContent = `
            body.modal-open {
                overflow: hidden !important;
            }
            
            #modal-pago { 
                display: flex !important; 
                position: fixed !important; 
                z-index: 2147483647 !important; 
                left: 0 !important; 
                top: 0 !important; 
                width: 100vw !important; 
                height: 100vh !important; 
                align-items: center !important; 
                justify-content: center !important; 
                background: rgba(0,0,0,0.8) !important;
                backdrop-filter: blur(5px) !important;
            }
            
            #modal-pago .modal-overlay { 
                position: absolute !important; 
                left: 0 !important; 
                top: 0 !important; 
                width: 100% !important; 
                height: 100% !important; 
                background: transparent !important; 
                z-index: 1 !important;
                cursor: pointer !important;
            }
            
            #modal-pago .modal-content { 
                position: relative !important; 
                background: #e6e7c7 !important; 
                border-radius: 24px !important; 
                padding: 40px !important; 
                min-width: 450px !important; 
                max-width: 95vw !important;
                box-shadow: 0 20px 60px rgba(0,0,0,0.6) !important; 
                display: flex !important; 
                flex-direction: column !important; 
                gap: 20px !important; 
                z-index: 1000 !important;
                animation: modalAppear 0.3s ease !important;
                pointer-events: auto !important;
            }
            
            @keyframes modalAppear {
                from { 
                    opacity: 0; 
                    transform: scale(0.7) translateY(-50px); 
                }
                to { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                }
            }
            
            #modal-pago .modal-row { 
                display: flex !important; 
                justify-content: space-between !important; 
                align-items: center !important; 
                margin-bottom: 12px !important; 
            }
            
            #modal-pago .modal-label { 
                font-weight: bold !important; 
                font-size: 1.2em !important; 
                background: #fff !important; 
                border-radius: 12px 0 0 12px !important; 
                padding: 14px 20px !important; 
                flex: 1 !important; 
                text-align: left !important; 
                color: #333 !important;
                border: 2px solid #ddd !important;
            }
            
            #modal-pago .modal-value, #modal-pago .modal-input { 
                background: #fff !important; 
                border: 2px solid #ddd !important; 
                border-left: none !important;
                border-radius: 0 12px 12px 0 !important; 
                padding: 14px 20px !important; 
                font-size: 1.2em !important; 
                flex: 1 !important; 
                text-align: right !important; 
                color: #333 !important;
                font-weight: bold !important;
            }
            
            #modal-pago .modal-input { 
                outline: none !important; 
                cursor: text !important;
                pointer-events: auto !important;
                transition: all 0.3s ease !important;
            }
            
            #modal-pago .modal-input:focus {
                border-color: #007bff !important;
                box-shadow: 0 0 0 4px rgba(0,123,255,0.25) !important;
                background: #f8f9ff !important;
            }
            
            #modal-pago .modal-input-error { 
                border-color: #e74c3c !important; 
                background: #ffeaea !important; 
                animation: shake 0.6s ease !important;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
            
            #modal-pago .modal-actions { 
                display: flex !important; 
                justify-content: space-between !important; 
                gap: 30px !important; 
                margin-top: 30px !important; 
            }
            
            #modal-pago .modal-btn-cancelar, #modal-pago .modal-btn-pagar { 
                flex: 1 !important; 
                padding: 16px 0 !important; 
                border: none !important; 
                border-radius: 12px !important; 
                background: #fff !important; 
                font-weight: bold !important; 
                font-size: 1.2em !important; 
                cursor: pointer !important; 
                transition: all 0.3s ease !important; 
                pointer-events: auto !important;
                position: relative !important;
                overflow: hidden !important;
                border: 2px solid #ddd !important;
            }
            
            #modal-pago .modal-btn-cancelar:hover { 
                background: #f2bcbc !important; 
                border-color: #e74c3c !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
            }
            
            #modal-pago .modal-btn-pagar:hover { 
                background: #b8e6b8 !important; 
                border-color: #28a745 !important;
                transform: translateY(-3px) !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
            }
            
            #modal-pago .modal-btn-cancelar:active,
            #modal-pago .modal-btn-pagar:active { 
                transform: translateY(0) !important;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
            }
            
            #modal-pago .modal-btn-pagar:disabled {
                background: #ccc !important;
                color: #666 !important;
                cursor: not-allowed !important;
                transform: none !important;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modalPago);
        document.body.classList.add('modal-open');

        // Referencias del modal
        const modalTotal = modalPago.querySelector('#modal-total');
        const inputPago = modalPago.querySelector('#modal-pago-input');
        const modalCambio = modalPago.querySelector('#modal-cambio');
        const btnPagarModal = modalPago.querySelector('.modal-btn-pagar');
        const btnCancelarModal = modalPago.querySelector('.modal-btn-cancelar');
        const overlay = modalPago.querySelector('.modal-overlay');

        // Calcular y mostrar total
        const totales = VentasServices.calcularTotales(listaProductos);
        modalTotal.textContent = `$${totales.total.toFixed(2)}`;

        // Event listeners del modal
        inputPago.addEventListener('input', function (e) {
            // Prevenir que el event bubbling interfiera
            e.stopPropagation();
            
            // Limpiar error si existe
            inputPago.classList.remove('modal-input-error');
            
            const total = parseFloat(modalTotal.textContent.replace(/[^\d.]/g, ''));
            const pagado = parseFloat(inputPago.value) || 0;
            const cambio = pagado - total;
            modalCambio.textContent = cambio >= 0 ? `$${cambio.toFixed(2)}` : '$0.00';
        });

        function cerrarModal() {
            document.body.classList.remove('modal-open');
            modalPago.remove();
            if (style.parentNode) {
                style.remove();
            }
            // **IMPORTANTE: Reanudar el sistema de escaneo**
            reanudarSistemaEscaneo();
        }

        btnCancelarModal.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cerrarModal();
        });

        overlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            cerrarModal();
        });

        // Manejar tecla ESC para cerrar
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                cerrarModal();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        btnPagarModal.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const total = parseFloat(modalTotal.textContent.replace(/[^\d.]/g, ''));
            const pagado = parseFloat(inputPago.value) || 0;

            if (pagado < total) {
                inputPago.classList.add('modal-input-error');
                inputPago.focus();
                inputPago.select();
                return;
            }

            // Deshabilitar el botón para evitar doble clic
            btnPagarModal.disabled = true;
            btnPagarModal.textContent = 'Procesando...';

            try {
                console.log('📤 Enviando datos al backend:', listaProductos);
                
                // Validar que la lista tenga el formato correcto
                const datosParaEnviar = listaProductos.map(item => ({
                    idRegistro: item.idRegistro,
                    codigoProducto: item.codigoProducto,
                    nombreProducto: item.nombreProducto,
                    precioUnitario: parseFloat(item.precioUnitario),
                    cantidad: parseInt(item.cantidad),
                    subtotal: parseFloat(item.subtotal)
                }));

                console.log('📋 Formato JSON final:', JSON.stringify(datosParaEnviar, null, 2));

                // Guardar venta
                const resultado = await VentasServices.guardarDetallesVenta(datosParaEnviar);
                console.log('✅ Respuesta del backend:', resultado);
                
                cerrarModal();
                mostrarVentaExitosa();
                
            } catch (error) {
                console.error('❌ Error al procesar pago:', error);
                
                // Rehabilitar el botón
                btnPagarModal.disabled = false;
                btnPagarModal.textContent = 'Pagar';
                
                // Mostrar error específico
                let mensajeError = "Error al procesar el pago";
                if (error.message.includes('network') || error.message.includes('fetch')) {
                    mensajeError = "Error de conexión con el servidor";
                } else if (error.message.includes('400')) {
                    mensajeError = "Datos inválidos enviados al servidor";
                } else if (error.message.includes('500')) {
                    mensajeError = "Error interno del servidor";
                } else {
                    mensajeError = error.message;
                }
                
                mostrarNotificacion(mensajeError, 'error');
            }
        });

        // Focus al input de pago con delay para que el modal se renderice completamente
        setTimeout(() => {
            inputPago.focus();
            inputPago.select();
        }, 400);

        // Agregar evento Enter para pagar rápidamente
        inputPago.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                btnPagarModal.click();
            }
        });
    }

    // **NUEVAS FUNCIONES PARA MANEJAR EL SISTEMA DE ESCANEO**
    function pausarSistemaEscaneo() {
        if (inputEscaneo) {
            inputEscaneo.disabled = true;
            // Completamente deshabilitar el input
            inputEscaneo.style.pointerEvents = 'none';
            inputEscaneo.blur();
            console.log('⏸️ Sistema de escaneo pausado completamente');
        }
    }

    function reanudarSistemaEscaneo() {
        if (inputEscaneo) {
            inputEscaneo.disabled = false;
            inputEscaneo.style.pointerEvents = 'none'; // Mantener invisible
            setTimeout(() => {
                // Solo dar focus si no hay otro elemento con focus
                if (!document.querySelector(':focus') || document.activeElement === document.body) {
                    inputEscaneo.focus();
                }
                console.log('▶️ Sistema de escaneo reanudado');
            }, 300);
        }
    }

    // ===== RESETEAR VENTA =====
    function resetearVenta() {
        ventaActiva = false;
        ventaId = null;
        listaProductos = [];
        contadorProductos = {};
        
        actualizarTablaProductos();
        actualizarTotales();
        actualizarInterfaz();
    }

    // Confirmar cancelación con tecla ESC
    function confirmarCancelacion() {
        if (listaProductos.length > 0) {
            if (confirm('⚠️ ¿Cancelar la venta actual?')) {
                resetearVenta();
            }
        }
    }

    // ===== UTILIDADES =====
    function mostrarNotificacion(mensaje, tipo = 'info') {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.textContent = mensaje;
        
        notificacion.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        
        switch (tipo) {
            case 'success': notificacion.style.backgroundColor = '#28a745'; break;
            case 'error': notificacion.style.backgroundColor = '#dc3545'; break;
            case 'warning': notificacion.style.backgroundColor = '#ffc107'; notificacion.style.color = '#000'; break;
            default: notificacion.style.backgroundColor = '#17a2b8';
        }
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.remove();
            }
        }, 3000);
    }

    function reproducirSonidoExito() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            console.log('Audio no disponible');
        }
    }

    function reproducirSonidoError() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 200;
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio no disponible');
        }
    }

    // Función para agregar productos manualmente (para testing)
    window.agregarProductoTest = function() {
        const productoTest = {
            idRegistro: Date.now(),
            codigoProducto: 'TEST001',
            nombreProducto: 'Producto de Prueba',
            precioUnitario: 10.50,
            cantidad: 1,
            subtotal: 10.50
        };
        
        listaProductos.push(productoTest);
        actualizarTablaProductos();
        actualizarTotales();
        actualizarInterfaz();
        
        console.log('✅ Producto de prueba agregado');
    };

    // Inicializar aplicación
    init();
});

// Estilos CSS adicionales para el sistema de ventas
const estilosVentas = `
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes productoPulse {
    0% { background-color: #e8f5e8; }
    50% { background-color: #c8e6c9; }
    100% { background-color: transparent; }
}

.producto-nuevo {
    animation: productoPulse 1s ease;
}

.products-table tbody tr.selected {
    background-color: #e3f2fd !important;
    border: 2px solid #2196f3 !important;
}

.products-table tbody tr {
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.products-table tbody tr:hover {
    background-color: #f8f9fa;
}

/* Estilos para los controles de cantidad */
.cantidad-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
}

.btn-cantidad-menos, .btn-cantidad-mas {
    background: #007bff;
    color: white;
    border: none;
    border-radius: 50%;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    transition: all 0.2s ease;
}

.btn-cantidad-menos:hover, .btn-cantidad-mas:hover {
    background: #0056b3;
    transform: scale(1.1);
}

.cantidad-valor {
    min-width: 30px;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
}

/* Estilos para el botón de eliminar */
.btn-eliminar-producto {
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.btn-eliminar-producto:hover {
    background: #c82333;
    transform: scale(1.1);
}

.btn-eliminar-producto:active {
    transform: scale(0.95);
}

/* Otros estilos existentes... */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal-container {
    background: white;
    border-radius: 12px;
    padding: 25px;
    min-width: 500px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
}

.modal-header h3 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.4rem;
}

.resumen-venta {
    margin: 20px 0;
}

.productos-resumen {
    max-height: 200px;
    overflow-y: auto;
    margin: 15px 0;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 10px;
}

.producto-resumen {
    display: grid;
    grid-template-columns: 1fr auto auto;
    gap: 15px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
}

.producto-resumen:last-child {
    border-bottom: none;
}

.totales {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
}

.totales p {
    display: flex;
    justify-content: space-between;
    margin: 8px 0;
}

.total-final {
    font-size: 1.2rem;
    font-weight: bold;
    color: #28a745;
    border-top: 2px solid #28a745;
    padding-top: 10px;
    margin-top: 10px;
}

.modal-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 25px;
}

.btn-cancel, .btn-accept {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    transition: all 0.2s ease;
}

.btn-cancel {
    background: #dc3545;
    color: white;
}

.btn-cancel:hover {
    background: #c82333;
}

.btn-accept {
    background: #28a745;
    color: white;
}

.btn-accept:hover {
    background: #218838;
}

.ticket {
    text-align: center;
    padding: 25px;
    border: 3px dashed #28a745;
    border-radius: 12px;
    background: #f8fff8;
}

.success-message {
    color: #28a745;
    font-weight: bold;
    margin: 15px 0;
    font-size: 1.1rem;
}

.info-message {
    color: #17a2b8;
    font-style: italic;
    margin-top: 10px;
}
`;

// Agregar estilos al DOM
const styleSheet = document.createElement('style');
styleSheet.textContent = estilosVentas;
document.head.appendChild(styleSheet);

function mostrarVentaExitosa() {
        let modalSuccess = document.getElementById('modal-venta-exitosa');
        if (!modalSuccess) {
            modalSuccess = document.createElement('div');
            modalSuccess.id = 'modal-venta-exitosa';
            modalSuccess.innerHTML = `
                <div class="modal-success-overlay"></div>
                <div class="modal-success-content">
                    <div class="modal-success-icon">✔</div>
                    <div class="modal-success-text">VENTA EXITOSA</div>
                </div>
            `;
            document.body.appendChild(modalSuccess);
            // Agregar estilos solo una vez
            if (!document.getElementById('modal-success-style')) {
                const style = document.createElement('style');
                style.id = 'modal-success-style';
                style.textContent = `
                    #modal-venta-exitosa {
                        display: flex;
                        position: fixed;
                        z-index: 2000;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-venta-exitosa .modal-success-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.4);
                    }
                    #modal-venta-exitosa .modal-success-content {
                        position: relative;
                        background: transparent;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        z-index: 2;
                    }
                    #modal-venta-exitosa .modal-success-icon {
                        font-size: 5rem;
                        color: #111;
                        background: #fff;
                        border-radius: 50%;
                        width: 100px; height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 24px;
                        box-shadow: 0 2px 16px rgba(0,0,0,0.18);
                    }
                    #modal-venta-exitosa .modal-success-text {
                        color: #fff;
                        font-size: 2.8rem;
                        font-weight: bold;
                        text-align: center;
                        text-shadow: 0 2px 8px rgba(0,0,0,0.18);
                        letter-spacing: 2px;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        modalSuccess.style.display = 'flex';
        setTimeout(() => {
            modalSuccess.style.display = 'none';
            mostrarModalTicket();
        }, 1800);
    }

    // Modal para preguntar si hacer ticket
    function mostrarModalTicket() {
        let modalTicket = document.getElementById('modal-ticket');
        if (!modalTicket) {
            modalTicket = document.createElement('div');
            modalTicket.id = 'modal-ticket';
            modalTicket.innerHTML = `
                <div class="modal-ticket-overlay"></div>
                <div class="modal-ticket-content">
                    <div class="modal-ticket-question">¿Desea generar un ticket?</div>
                    <div class="modal-ticket-actions">
                        <button class="modal-ticket-btn-si">Sí</button>
                        <button class="modal-ticket-btn-no">No</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalTicket);

            // Estilos solo una vez
            if (!document.getElementById('modal-ticket-style')) {
                const style = document.createElement('style');
                style.id = 'modal-ticket-style';
                style.textContent = `
                    #modal-ticket {
                        display: flex;
                        position: fixed;
                        z-index: 2100;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-ticket .modal-ticket-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.4);
                    }
                    #modal-ticket .modal-ticket-content {
                        position: relative;
                        background: #e6e7c7;
                        border-radius: 24px;
                        padding: 32px 32px 24px 32px;
                        min-width: 340px;
                        min-height: 140px;
                        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                        z-index: 2;
                        align-items: center;
                    }
                    #modal-ticket .modal-ticket-question {
                        background: #fff;
                        border-radius: 16px;
                        font-size: 2rem;
                        font-weight: bold;
                        color: #222;
                        padding: 12px 18px;
                        text-align: center;
                        margin-bottom: 12px;
                    }
                    #modal-ticket .modal-ticket-actions {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        gap: 32px;
                    }
                    #modal-ticket .modal-ticket-btn-si, #modal-ticket .modal-ticket-btn-no {
                        flex: 1;
                        padding: 18px 0;
                        border: none;
                        border-radius: 16px;
                        background: #fff;
                        font-weight: bold;
                        font-size: 2rem;
                        cursor: pointer;
                        transition: background 0.2s;
                    }
                    #modal-ticket .modal-ticket-btn-si:hover {
                        background: #b8e6b8;
                    }
                    #modal-ticket .modal-ticket-btn-no:hover {
                        background: #f2bcbc;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        modalTicket.style.display = 'flex';

        // Acciones de los botones
        const btnSi = modalTicket.querySelector('.modal-ticket-btn-si');
        const btnNo = modalTicket.querySelector('.modal-ticket-btn-no');
        const closeTicket = () => { modalTicket.style.display = 'none'; };

        btnSi.onclick = function() {
            closeTicket();
            console.log('✅ Ticket solicitado - mostrando selección de cliente');
            mostrarModalSeleccionCliente();
        };

        btnNo.onclick = function() {
            closeTicket();
            console.log('❌ Ticket no generado - finalizando venta');
            // Aquí termina la venta sin generar ticket
            mostrarToast('Venta finalizada sin ticket', 'info');
        setTimeout(() => {
            console.log('🔄 Refrescando página para nueva venta...');
            mostrarToast('Preparando nueva venta...', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }, 1500);
    };

        // También cerrar al hacer click fuera
        modalTicket.querySelector('.modal-ticket-overlay').onclick = closeTicket;
    }

    // Modal para seleccionar o registrar cliente
    function mostrarModalSeleccionCliente() {
        let modalCliente = document.getElementById('modal-cliente');
        if (!modalCliente) {
            modalCliente = document.createElement('div');
            modalCliente.id = 'modal-cliente';
            modalCliente.innerHTML = `
                <div class="modal-cliente-overlay"></div>
                <div class="modal-cliente-content">
                    <h3>Seleccionar Cliente</h3>
                    <div class="modal-cliente-body">
                        <label for="cliente-combobox">Buscar Cliente:</label>
                        <select id="cliente-combobox" class="cliente-combobox">
                            <option value="">Seleccione un cliente...</option>
                        </select>
                        <button hidden id="btn-registrar-cliente" class="btn-registrar-cliente">Registrar Nuevo Cliente</button>
                    </div>
                    <div class="modal-cliente-actions">
                        <button id="btn-cancelar-cliente" class="btn-cancelar-cliente">Cancelar</button>
                        <button id="btn-continuar-cliente" class="btn-continuar-cliente">Enviar Ticket</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalCliente);

            // Estilos del modal de cliente
            if (!document.getElementById('modal-cliente-style')) {
                const style = document.createElement('style');
                style.id = 'modal-cliente-style';
                style.textContent = `
                    #modal-cliente {
                        display: flex;
                        position: fixed;
                        z-index: 2200;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-cliente .modal-cliente-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.5);
                    }
                    #modal-cliente .modal-cliente-content {
                        position: relative;
                        background: #fff;
                        border-radius: 12px;
                        padding: 24px;
                        min-width: 400px;
                        max-width: 500px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                        z-index: 2;
                    }
                    #modal-cliente h3 {
                        margin: 0 0 20px 0;
                        color: #333;
                        text-align: center;
                    }
                    #modal-cliente .modal-cliente-body {
                        margin-bottom: 20px;
                    }
                    #modal-cliente label {
                        display: block;
                        margin-bottom: 8px;
                        font-weight: bold;
                        color: #555;
                    }
                    #modal-cliente .cliente-combobox {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        margin-bottom: 15px;
                        font-size: 14px;
                    }
                    #modal-cliente .btn-registrar-cliente {
                        width: 100%;
                        padding: 10px;
                        background: #007bff;
                        color: #fff;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    #modal-cliente .btn-registrar-cliente:hover {
                        background: #0056b3;
                    }
                    #modal-cliente .modal-cliente-actions {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        gap: 32px;
                    }
                    #modal-cliente .btn-cancelar-cliente {
                        padding: 10px 20px;
                        background: #6c757d;
                        color: #fff;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    }
                    #modal-cliente .btn-cancelar-cliente:hover {
                        background: #545b62;
                    }
                    #modal-cliente .btn-continuar-cliente {
                        padding: 10px 20px;
                        background: #28a745;
                        color: #fff;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    }
                    #modal-cliente .btn-continuar-cliente:hover {
                        background: #1e7e34;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        modalCliente.style.display = 'flex';

        // Acciones de los botones
        const btnRegistrarCliente = modalCliente.querySelector('#btn-registrar-cliente');
        const btnCancelarCliente = modalCliente.querySelector('#btn-cancelar-cliente');
        const btnContinuarCliente = modalCliente.querySelector('#btn-continuar-cliente');
        const clienteCombobox = modalCliente.querySelector('#cliente-combobox');

        // Cargar clientes en el combobox
        cargarClientesEnCombobox(clienteCombobox);

        btnRegistrarCliente.onclick = function () {
            modalCliente.style.display = 'none';
            mostrarModalRegistrarCliente();
        };

        btnCancelarCliente.onclick = function () {
            modalCliente.style.display = 'none';
        };

        // Corregir el manejo del botón "Enviar Ticket" en el modal de selección de cliente
        btnContinuarCliente.onclick = async function () {
            const clienteId = clienteCombobox.value;
            
            // Validar que se haya seleccionado un cliente
            if (!clienteId || clienteId === "") {
                alert('Por favor, seleccione un cliente de la lista.');
                return;
            }
            
            console.log('Cliente seleccionado ID:', clienteId); // Para debug
            
            modalCliente.style.display = 'none';
            await enviarTicketPorSms(clienteId);
        };

        modalCliente.querySelector('.modal-cliente-overlay').onclick = function () {
            modalCliente.style.display = 'none';
        };
    }

    // Cargar clientes en el combobox usando el endpoint
// ...existing code...

    // Función mejorada para cargar clientes con más debugging
    // ...existing code...
    
    // Función corregida para cargar clientes - primero verificar estructura
    async function cargarClientesEnCombobox(combobox) {
        try {
            console.log('🔄 Iniciando carga de clientes...');
            
            const negocioId = VentasServices.idNegocio;
            console.log('🏢 ID del negocio:', negocioId);
            
            if (!negocioId) {
                throw new Error('ID del negocio no está definido');
            }
            
            const url = `http://54.198.31.200:8080/negocio/${negocioId}/clientes`;
            console.log('📡 Haciendo petición a:', url);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const clientes = await response.json();
            console.log('📋 RESPUESTA COMPLETA del servidor:', clientes);
            
            // Verificar la estructura de cada cliente
            if (clientes && clientes.length > 0) {
                console.log('🔍 ESTRUCTURA del primer cliente:');
                console.log('   - Objeto completo:', clientes[0]);
                console.log('   - Propiedades disponibles:', Object.keys(clientes[0]));
                console.log('   - ¿Tiene ID?:', clientes[0].id);
                console.log('   - ¿Tiene idCliente?:', clientes[0].idCliente);
                console.log('   - ¿Tiene clienteId?:', clientes[0].clienteId);
                console.log('   - ¿Tiene nombre?:', clientes[0].nombre);
                console.log('   - ¿Tiene telefono?:', clientes[0].telefono);
            }
            
            // Limpiar opciones anteriores
            combobox.innerHTML = '<option value="">Seleccione un cliente...</option>';
            
            // Verificar si hay clientes
            if (!clientes || clientes.length === 0) {
                console.log('⚠️ No hay clientes registrados');
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "No hay clientes registrados";
                option.disabled = true;
                combobox.appendChild(option);
                return;
            }
            
            // Agregar clientes al combobox - detectar la propiedad correcta para el ID
            clientes.forEach((cliente, index) => {
                console.log(`👤 Cliente ${index + 1} - Objeto completo:`, cliente);
                
                const option = document.createElement('option');
                
                // Probar diferentes propiedades para el ID
                let clienteId = cliente.id || cliente.idCliente || cliente.clienteId;
                
                console.log(`   🔍 ID detectado: ${clienteId}`);
                
                option.value = clienteId;
                option.textContent = `${cliente.nombre || 'Sin nombre'} - ${cliente.telefono || 'Sin teléfono'}`;
                
                console.log(`   ➡️ Option - value: "${option.value}", text: "${option.textContent}"`);
                combobox.appendChild(option);
            });
            
            console.log(`✅ Cargados ${clientes.length} clientes en el combobox`);
            
        } catch (error) {
            console.error('❌ Error al cargar clientes:', error);
            combobox.innerHTML = '<option value="">Error al cargar clientes</option>';
            alert('Error al cargar la lista de clientes: ' + error.message);
        }
    }
    
    // ...existing code...
    // Función mejorada para el botón continuar con más debugging
    btnContinuarCliente.onclick = async function () {
        console.log('🔍 Verificando selección de cliente...');
        console.log('📋 Combobox element:', clienteCombobox);
        console.log('📋 Todas las opciones:', clienteCombobox.options);
        console.log('📋 Índice seleccionado:', clienteCombobox.selectedIndex);
        console.log('📋 Opción seleccionada:', clienteCombobox.options[clienteCombobox.selectedIndex]);
        
        const clienteId = clienteCombobox.value;
        console.log('🆔 Cliente ID capturado:', clienteId);
        console.log('🔢 Tipo de clienteId:', typeof clienteId);
        
        // Validar que se haya seleccionado un cliente
        if (!clienteId || clienteId === "" || clienteId === "undefined") {
            console.log('❌ No se seleccionó un cliente válido');
            alert('Por favor, seleccione un cliente de la lista.');
            return;
        }
        
        console.log('✅ Cliente válido seleccionado, ID:', clienteId);
        
        modalCliente.style.display = 'none';
        await enviarTicketPorSms(clienteId);
    };

    // ...existing code...
    // Modal para registrar nuevo cliente
    function mostrarModalRegistrarCliente() {
        let modalRegistrar = document.getElementById('modal-registrar-cliente');
        if (!modalRegistrar) {
            modalRegistrar = document.createElement('div');
            modalRegistrar.id = 'modal-registrar-cliente';
            modalRegistrar.innerHTML = `
                <div class="modal-registrar-overlay"></div>
                <div class="modal-registrar-content">
                    <h3>Registrar Nuevo Cliente</h3>
                    <form id="form-registrar-cliente">
                        <div class="form-group">
                            <label for="nombre-cliente">Nombre *</label>
                            <input type="text" id="nombre-cliente" name="nombre" required placeholder="Nombre completo">
                        </div>
                        <div class="form-group">
                            <label for="telefono-cliente">Teléfono *</label>
                            <input type="tel" id="telefono-cliente" name="telefono" required placeholder="961-123-4567">
                        </div>
                        <div class="modal-actions">
                            <button type="button" id="btn-cancelar-registrar" class="btn-cancel">Cancelar</button>
                            <button type="submit" class="btn-accept">Registrar y Enviar Ticket</button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modalRegistrar);

            // Estilos del modal de registro
            if (!document.getElementById('modal-registrar-style')) {
                const style = document.createElement('style');
                style.id = 'modal-registrar-style';
                style.textContent = `
                    #modal-registrar-cliente {
                        display: flex;
                        position: fixed;
                        z-index: 2300;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-registrar-cliente .modal-registrar-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.5);
                    }
                    #modal-registrar-cliente .modal-registrar-content {
                        position: relative;
                        background: #fff;
                        border-radius: 12px;
                        padding: 24px;
                        min-width: 400px;
                        max-width: 500px;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                        z-index: 2;
                    }
                    #modal-registrar-cliente h3 {
                        margin: 0 0 20px 0;
                        color: #333;
                        text-align: center;
                    }
                    #modal-registrar-cliente .form-group {
                        margin-bottom: 15px;
                    }
                    #modal-registrar-cliente label {
                        display: block;
                        margin-bottom: 5px;
                        font-weight: bold;
                        color: #555;
                    }
                    #modal-registrar-cliente input {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-size: 14px;
                        box-sizing: border-box;
                    }
                    #modal-registrar-cliente .modal-actions {
                        display: flex;
                        gap: 10px;
                        justify-content: flex-end;
                        margin-top: 20px;
                    }
                    #modal-registrar-cliente .btn-cancel {
                        padding: 10px 20px;
                        background: #6c757d;
                        color: #fff;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    }
                    #modal-registrar-cliente .btn-accept {
                        padding: 10px 20px;
                        background: #28a745;
                        color: #fff;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                    }
                    #modal-registrar-cliente .btn-cancel:hover {
                        background: #545b62;
                    }
                    #modal-registrar-cliente .btn-accept:hover {
                        background: #1e7e34;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        modalRegistrar.style.display = 'flex';

        const formRegistrar = modalRegistrar.querySelector('#form-registrar-cliente');
        const btnCancelarRegistrar = modalRegistrar.querySelector('#btn-cancelar-registrar');

        btnCancelarRegistrar.onclick = function () {
            modalRegistrar.style.display = 'none';
            mostrarModalSeleccionCliente(); // Volver al modal anterior
        };

        formRegistrar.onsubmit = async function (e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre-cliente').value.trim();
            const telefono = document.getElementById('telefono-cliente').value.trim();

            if (!nombre || !telefono) {
                alert('Por favor, complete todos los campos.');
                return;
            }

            try {
                // Registrar nuevo cliente
                const nuevoCliente = await window.createCliente({ nombre, telefono });
                console.log('Cliente registrado:', nuevoCliente);
                
                modalRegistrar.style.display = 'none';
                
                // Enviar ticket al cliente recién registrado
                await enviarTicketPorSms(nuevoCliente.id);
                
            } catch (error) {
                console.error('Error al registrar cliente:', error);
                alert('Error al registrar cliente. Por favor, inténtelo de nuevo.');
            }
        };

        modalRegistrar.querySelector('.modal-registrar-overlay').onclick = function () {
            modalRegistrar.style.display = 'none';
            mostrarModalSeleccionCliente(); // Volver al modal anterior
        };

        // Enfocar el primer input
        setTimeout(() => {
            document.getElementById('nombre-cliente').focus();
        }, 100);
    }

    // Función simplificada para enviar ticket por SMS
    async function enviarTicketPorSms(clienteId) {
        // Validar que clienteId no sea undefined
        if (!clienteId || clienteId === undefined || clienteId === "undefined") {
            console.error('❌ Error: clienteId es undefined o inválido:', clienteId);
            mostrarToast('Error: No se seleccionó un cliente válido', 'error');
            return;
        }
        
        try {
            console.log('Iniciando proceso de envío de ticket por SMS al cliente ID:', clienteId);
            
            // Mostrar mensaje de carga
            const loadingToast = mostrarToast('Generando y enviando ticket por SMS...', 'info');
            
            // Obtener ID del negocio
            const negocioId = VentasServices.idNegocio;
            
            // PASO 1: Generar el ticket usando POST
            console.log('Paso 1: Generando ticket...');
            const generarResponse = await fetch(`http://54.198.31.200:8080/negocio/${negocioId}/ticket`, {
                method: 'POST'
            });

            if (!generarResponse.ok) {
                throw new Error(`Error al generar ticket: ${generarResponse.status} - ${generarResponse.statusText}`);
            }

            const generarResult = await generarResponse.text();
            console.log('✅ Ticket generado:', generarResult);

            // PASO 2: Enviar el ticket por SMS usando GET
            console.log('Paso 2: Enviando ticket por SMS al cliente ID:', clienteId);
            const enviarResponse = await fetch(`http://54.198.31.200:8080/negocio/${negocioId}/ticket/send/${clienteId}`, {
                method: 'GET'
            });

            // Cerrar toast de carga
            if (loadingToast && loadingToast.parentNode) {
                loadingToast.remove();
            }

            if (!enviarResponse.ok) {
                throw new Error(`Error al enviar SMS: ${enviarResponse.status} - ${enviarResponse.statusText}`);
            }

            const enviarResult = await enviarResponse.text();
            console.log('✅ SMS enviado:', enviarResult);

            // Mostrar mensaje de éxito
            mostrarToast('Ticket enviado exitosamente por SMS', 'success');
            console.log('✅ Proceso completado - Ticket enviado por SMS al cliente:', clienteId);

             setTimeout(() => {
            console.log('🔄 Refrescando página para nueva venta...');
            mostrarToast('Preparando nueva venta...', 'info');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }, 2000); // Esperar 2 segundos para que el usuario vea el mensaje de éxito

        } catch (error) {
            console.error('Error en el proceso de envío de ticket:', error);
            
            // Cerrar toast de carga si aún existe
            const loadingToast = document.querySelector('.toast');
            if (loadingToast && loadingToast.parentNode) {
                loadingToast.remove();
            }
            
            // Mostrar mensaje de error
            mostrarToast('Error al enviar ticket: ' + error.message, 'error');
            // ✅ OPCIONAL: También refrescar después de un error (para no dejar el sistema colgado)
        setTimeout(() => {
            console.log('🔄 Refrescando página después del error...');
            mostrarToast('Reiniciando sistema...', 'warning');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }, 3000); // Esperar 3 segundos para que el usuario vea el error
    }
}

    // Función auxiliar para mostrar toast (si no existe)
    function mostrarToast(mensaje, tipo = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${tipo}`;
        toast.textContent = mensaje;
        
        // Estilos básicos para el toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            z-index: 3000;
            max-width: 300px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Colores según el tipo
        switch (tipo) {
            case 'success':
                toast.style.background = '#28a745';
                break;
            case 'error':
                toast.style.background = '#dc3545';
                break;
            case 'warning':
                toast.style.background = '#ffc107';
                toast.style.color = '#000';
                break;
            default:
                toast.style.background = '#17a2b8';
        }
        
        document.body.appendChild(toast);
        
        // Mostrar con animación
        setTimeout(() => toast.style.opacity = '1', 10);
        
        // Auto-cerrar después de 3 segundos
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
        
        return toast;
    }

    // Alertas para el sistema de ventas
class VentasAlertas {
    
    // Alerta para producto agregado exitosamente
    static productoAgregado(nombreProducto) {
        Swal.fire({
            icon: 'success',
            title: '¡Producto agregado!',
            text: `${nombreProducto} ha sido agregado al carrito`,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    // Alerta para producto eliminado
    static productoEliminado(nombreProducto) {
        Swal.fire({
            icon: 'info',
            title: 'Producto eliminado',
            text: `${nombreProducto} ha sido eliminado del carrito`,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    // Confirmación antes de eliminar producto
    static confirmarEliminarProducto() {
        return Swal.fire({
            title: '¿Eliminar producto?',
            text: 'Esta acción eliminará el producto del carrito',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
    }

    // Alerta de carrito vacío
    static carritoVacio() {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Debes agregar al menos un producto antes de proceder al pago',
            confirmButtonText: 'Entendido'
        });
    }

    // Confirmación de pago
    static confirmarPago(total) {
        return Swal.fire({
            title: 'Confirmar pago',
            text: `¿Proceder con el pago de $${total}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#28a745',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Confirmar pago',
            cancelButtonText: 'Cancelar'
        });
    }

    // Pago exitoso
    static pagoExitoso(idVenta, total) {
        Swal.fire({
            icon: 'success',
            title: '¡Pago realizado!',
            html: `
                <p>Venta #${idVenta} procesada exitosamente</p>
                <p><strong>Total: $${total}</strong></p>
            `,
            confirmButtonText: 'Nueva venta',
            confirmButtonColor: '#28a745'
        });
    }

    // Error en el pago
    static errorPago(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Error en el pago',
            text: mensaje || 'Ocurrió un error al procesar el pago',
            confirmButtonText: 'Intentar nuevamente'
        });
    }

    // Producto no encontrado
    static productoNoEncontrado() {
        Swal.fire({
            icon: 'error',
            title: 'Producto no encontrado',
            text: 'El código del producto no existe en el inventario',
            timer: 3000,
            showConfirmButton: false
        });
    }

    // Stock insuficiente
    static stockInsuficiente(nombreProducto, stockDisponible) {
        Swal.fire({
            icon: 'warning',
            title: 'Stock insuficiente',
            text: `${nombreProducto} solo tiene ${stockDisponible} unidades disponibles`,
            confirmButtonText: 'Entendido'
        });
    }

    // Cantidad inválida
    static cantidadInvalida() {
        Swal.fire({
            icon: 'warning',
            title: 'Cantidad inválida',
            text: 'La cantidad debe ser mayor a 0',
            timer: 2500,
            showConfirmButton: false
        });
    }

    // Error de conexión
    static errorConexion() {
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
            confirmButtonText: 'Reintentar'
        });
    }

    // Confirmación para limpiar carrito
    static confirmarLimpiarCarrito() {
        return Swal.fire({
            title: '¿Limpiar carrito?',
            text: 'Esta acción eliminará todos los productos del carrito',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar'
        });
    }

    // Carrito limpiado
    static carritoLimpiado() {
        Swal.fire({
            icon: 'success',
            title: 'Carrito limpiado',
            text: 'Todos los productos han sido eliminados',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }
}

// Funciones de ejemplo de uso en el sistema de ventas
document.addEventListener('DOMContentLoaded', function() {
    
    // Botón agregar producto
    const btnAgregar = document.querySelector('.btn-add');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            // Aquí iría la lógica para agregar producto
            // Ejemplo de uso:
            const nombreProducto = 'Producto ejemplo';
            VentasAlertas.productoAgregado(nombreProducto);
        });
    }

    // Botón eliminar producto
    const btnEliminar = document.querySelector('.btn-remove');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function() {
            VentasAlertas.confirmarEliminarProducto().then((result) => {
                if (result.isConfirmed) {
                    // Lógica para eliminar producto
                    VentasAlertas.productoEliminado('Producto ejemplo');
                }
            });
        });
    }

    // Botón pagar
    const btnPagar = document.querySelector('.btn-pay');
    if (btnPagar) {
        btnPagar.addEventListener('click', function() {
            const total = document.querySelector('.total-amount').textContent;
            
            // Verificar si hay productos en el carrito
            const tbody = document.querySelector('.products-table tbody');
            if (!tbody || tbody.children.length === 0) {
                VentasAlertas.carritoVacio();
                return;
            }

            VentasAlertas.confirmarPago(total).then((result) => {
                if (result.isConfirmed) {
                    // Aquí iría la lógica del pago
                    // Simular pago exitoso
                    const idVenta = Math.floor(Math.random() * 10000);
                    VentasAlertas.pagoExitoso(idVenta, total);
                }
            });
        });
    }
});