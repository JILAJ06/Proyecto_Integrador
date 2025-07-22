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
    // Referencias para el modal de pago
    let modalPago = null;
    let inputPago = null;
    let modalTotal = null;
    let modalCambio = null;
    let btnPagarModal = null;
    let btnCancelarModal = null;

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
            position: fixed;
            top: -100px;
            left: -100px;
            opacity: 0;
            pointer-events: none;
        `;
        inputEscaneo.id = 'input-escaneo-invisible';
        
        // Event listener para capturar escaneos
        inputEscaneo.addEventListener('keypress', async (e) => {
            if (e.key === 'Enter') {
                const codigo = inputEscaneo.value.trim();
                if (codigo) {
                    await procesarEscaneoProducto(codigo);
                    inputEscaneo.value = ''; // Limpiar input
                }
            }
        });
        
        // Mantener focus en el input para capturar escaneos
        inputEscaneo.addEventListener('blur', () => {
            setTimeout(() => inputEscaneo.focus(), 10);
        });
        
        document.body.appendChild(inputEscaneo);
        inputEscaneo.focus();
        
        // Mantener focus cuando se haga click en cualquier parte
        document.addEventListener('click', () => {
            setTimeout(() => inputEscaneo.focus(), 10);
        });
    }

    // Configurar event listeners
    function setupEventListeners() {
        btnPagar.addEventListener("click", procesarPago);
        // Event listener para el botón pagar/cancelar del modal
        document.addEventListener('click', (e) => {
            if (e.target && e.target.classList.contains('modal-btn-pagar')) {
                confirmarPagoModal();
            }
            if (e.target && e.target.classList.contains('modal-btn-cancelar')) {
                cerrarModalPago();
            }
        });
        
        // Event listener para selección manual de productos (opcional)
        tabla.addEventListener("click", (e) => {
            const fila = e.target.closest("tr");
            if (fila) {
                seleccionarFila(fila);
            }
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
        tabla.innerHTML = '';
        
        listaProductos.forEach((item, index) => {
            const fila = document.createElement("tr");
            fila.dataset.index = index;
            fila.innerHTML = `
                <td>${item.codigoProducto}</td>
                <td>${item.nombreProducto}</td>
                <td>${VentasServices.formatearPrecio(item.precioUnitario)}</td>
                <td>${item.cantidad}</td>
                <td>${VentasServices.formatearPrecio(item.subtotal)}</td>
            `;
            
            // Efecto de producto recién agregado
            if (index === listaProductos.length - 1) {
                fila.classList.add('producto-nuevo');
                setTimeout(() => fila.classList.remove('producto-nuevo'), 1000);
            }
            
            tabla.appendChild(fila);
        });
    }

    function actualizarTotales() {
        const totales = VentasServices.calcularTotales(listaProductos);
        totalAmount.textContent = VentasServices.formatearPrecio(totales.total);
    }

    function actualizarInterfaz() {
        btnPagar.disabled = listaProductos.length === 0;
        
        // Mostrar información de estado
        const estadoVenta = document.querySelector('.session-info');
        if (estadoVenta && ventaActiva) {
            estadoVenta.innerHTML = `Venta Activa<br>Productos: ${listaProductos.length}`;
        }
    }

    // ===== SELECCIÓN Y ELIMINACIÓN MANUAL =====
    function seleccionarFila(fila) {
        // Remover selección anterior
        document.querySelectorAll(".products-table tbody tr").forEach(tr => {
            tr.classList.remove("selected");
        });
        
        // Seleccionar nueva fila
        fila.classList.add("selected");
    }

    // ===== PASO 3: PROCESAR PAGO =====
    async function procesarPago() {
        if (listaProductos.length === 0) {
            mostrarNotificacion('No hay productos en la venta', 'warning');
            return;
        }
        if (!modalPago) crearModalPago();
        // Mostrar el modal visualmente
        modalPago.style.display = "flex";
        // Rellenar el total
        const total = VentasServices.calcularTotales(listaProductos).total;
        if (modalTotal) modalTotal.textContent = `$${total.toFixed(2)}`;
        if (totalAmount) totalAmount.textContent = `$${total.toFixed(2)}`;
        // Reiniciar el campo de pago y cambio
        if (inputPago) inputPago.value = "";
        if (modalCambio) modalCambio.textContent = "$0.00";
    }

    // ===== MODAL DE PAGO DINÁMICO =====
    function crearModalPago() {
        if (document.getElementById('modal-pago')) {
            modalPago = document.getElementById('modal-pago');
        } else {
            modalPago = document.createElement('div');
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
                        <input type="number" min="0" step="0.01" class="modal-input" id="modal-pago-input" placeholder="$">
                    </div>
                    <div class="modal-row">
                        <span class="modal-label">Cambio</span>
                        <span class="modal-value" id="modal-cambio">$0.00</span>
                    </div>
                    <div class="modal-actions">
                        <button class="modal-btn-cancelar">Cancelar</button>
                        <button class="modal-btn-pagar">Pagar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalPago);
        }
        modalTotal = modalPago.querySelector('#modal-total');
        inputPago = modalPago.querySelector('#modal-pago-input');
        modalCambio = modalPago.querySelector('#modal-cambio');
        btnPagarModal = modalPago.querySelector('.modal-btn-pagar');
        btnCancelarModal = modalPago.querySelector('.modal-btn-cancelar');
        // Estilos para el modal de pago
        if (!document.getElementById('modal-pago-style')) {
            const style = document.createElement('style');
            style.id = 'modal-pago-style';
            style.textContent = `
                #modal-pago { display: none; position: fixed; z-index: 1000; left: 0; top: 0; width: 100vw; height: 100vh; align-items: center; justify-content: center; }
                #modal-pago .modal-overlay { position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); }
                #modal-pago .modal-content { position: relative; background: #e6e7c7; border-radius: 24px; padding: 32px 32px 24px 32px; min-width: 340px; min-height: 260px; box-shadow: 0 4px 32px rgba(0,0,0,0.18); display: flex; flex-direction: column; gap: 18px; z-index: 2; }
                #modal-pago .modal-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                #modal-pago .modal-label { font-weight: bold; font-size: 1.15em; background: #fff; border-radius: 10px 0 0 10px; padding: 8px 18px; flex: 1; text-align: left; }
                #modal-pago .modal-value, #modal-pago .modal-input { background: #fff; border: none; border-radius: 0 10px 10px 0; padding: 8px 18px; font-size: 1.15em; flex: 1; text-align: right; }
                #modal-pago .modal-input { outline: none; }
                #modal-pago .modal-input-error { border: 2px solid #e74c3c; background: #ffeaea; }
                #modal-pago .modal-actions { display: flex; justify-content: space-between; gap: 24px; margin-top: 12px; }
                #modal-pago .modal-btn-cancelar, #modal-pago .modal-btn-pagar { flex: 1; padding: 10px 0; border: none; border-radius: 12px; background: #fff; font-weight: bold; font-size: 1.1em; cursor: pointer; transition: background 0.2s; }
                #modal-pago .modal-btn-cancelar:hover { background: #f2bcbc; }
                #modal-pago .modal-btn-pagar:hover { background: #b8e6b8; }
            `;
            document.head.appendChild(style);
        }
        // Calcular cambio en tiempo real
        inputPago.addEventListener('input', function () {
            let total = modalTotal.textContent.replace(/[^\d.]/g, '');
            let pagado = parseFloat(inputPago.value) || 0;
            let cambio = pagado - parseFloat(total);
            modalCambio.textContent = cambio >= 0 ? `$${cambio.toFixed(2)}` : '$0.00';
        });
        // Quitar error al escribir
        inputPago.addEventListener('focus', function () {
            inputPago.classList.remove('modal-input-error');
        });
    }

    function cerrarModalPago() {
        if (modalPago) modalPago.style.display = 'none';
    }

    async function confirmarPagoModal() {
        const total = modalTotal.textContent.replace(/[^\d.]/g, '');
        const pagado = parseFloat(inputPago.value) || 0;
        if (pagado < parseFloat(total)) {
            inputPago.classList.add('modal-input-error');
            inputPago.focus();
            return;
        }
        try {
            await VentasServices.guardarDetallesVenta(listaProductos);
            cerrarModalPago();
            mostrarVentaExitosa();
        } catch (err) {
            alert("❌ Error al guardar la venta: " + err.message);
        }
    }

    // MODAL DE VENTA EXITOSA
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
            if (!document.getElementById('modal-success-style')) {
                const style = document.createElement('style');
                style.id = 'modal-success-style';
                style.textContent = `
                    #modal-venta-exitosa { display: flex; position: fixed; z-index: 2000; left: 0; top: 0; width: 100vw; height: 100vh; align-items: center; justify-content: center; }
                    #modal-venta-exitosa .modal-success-overlay { position: absolute; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); }
                    #modal-venta-exitosa .modal-success-content { position: relative; background: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 2; }
                    #modal-venta-exitosa .modal-success-icon { font-size: 5rem; color: #111; background: #fff; border-radius: 50%; width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 2px 16px rgba(0,0,0,0.18); }
                    #modal-venta-exitosa .modal-success-text { color: #fff; font-size: 2.8rem; font-weight: bold; text-align: center; text-shadow: 0 2px 8px rgba(0,0,0,0.18); letter-spacing: 2px; }
                `;
                document.head.appendChild(style);
            }
        }
        modalSuccess.style.display = 'flex';
        setTimeout(() => {
            modalSuccess.style.display = 'none';
            mostrarTicketVenta(VentasServices.calcularTotales(listaProductos));
            resetearVenta();
        }, 1800);
    }

    // ===== CONFIRMAR PAGO FINAL =====
    async function confirmarPagoFinal(modal) {
        try {
            console.log('💳 Confirmando pago final...');
            
            // Guardar detalles de venta en el formato específico del array
            await VentasServices.guardarDetallesVenta(listaProductos);
            
            // Obtener total final del servidor
            const totalFinal = await VentasServices.obtenerTotalVenta();
            
            // Limpiar estado local
            resetearVenta();
            
            // Cerrar modal de pago
            cerrarModal(modal);
            
            // Mostrar ticket de confirmación
            mostrarTicketVenta(totalFinal);
            
            // Iniciar nueva venta automáticamente
            setTimeout(async () => {
                await iniciarVentaAutomatica();
                actualizarInterfaz();
            }, 2000);
            
            console.log('✅ Venta completada exitosamente');
            
        } catch (error) {
            console.error('❌ Error al confirmar pago:', error);
            mostrarNotificacion('Error al procesar pago: ' + error.message, 'error');
        }
    }

    // ===== CANCELAR VENTA COMPLETA =====
    async function cancelarVentaCompleta(modal) {
        if (confirm('⚠️ ¿Estás seguro de cancelar esta venta?\n\nSe eliminarán todos los productos y la venta actual.')) {
            try {
                console.log('❌ Cancelando venta completa...');
                
                // Eliminar venta del servidor
                await VentasServices.cancelarVenta();
                
                // Limpiar estado local
                resetearVenta();
                
                // Cerrar modal
                cerrarModal(modal);
                
                // Iniciar nueva venta automáticamente
                setTimeout(async () => {
                    await iniciarVentaAutomatica();
                    actualizarInterfaz();
                }, 1000);
                
                mostrarNotificacion('Venta cancelada. Nueva venta iniciada.', 'info');
                
            } catch (error) {
                console.error('❌ Error al cancelar venta:', error);
                mostrarNotificacion('Error al cancelar: ' + error.message, 'error');
            }
        }
    }

    // Confirmar cancelación con tecla ESC
    function confirmarCancelacion() {
        if (listaProductos.length > 0) {
            if (confirm('⚠️ ¿Cancelar la venta actual?')) {
                cancelarVentaCompleta();
            }
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

    // ===== MOSTRAR TICKET =====
    function mostrarTicketVenta(totalVenta) {
        const numeroTicket = VentasServices.generarNumeroTicket();
        const fechaHora = new Date().toLocaleString();
        
        const modalTicket = document.createElement("div");
        modalTicket.className = "modal-overlay";
        modalTicket.innerHTML = `
            <div class="modal-container modal-ticket">
                <div class="modal-header">
                    <h3>🧾 Venta Completada</h3>
                </div>
                <div class="modal-body">
                    <div class="ticket">
                        <h4>✅ Ticket de Venta</h4>
                        <p><strong>Número:</strong> ${numeroTicket}</p>
                        <p><strong>Fecha:</strong> ${fechaHora}</p>
                        <p><strong>Total:</strong> ${VentasServices.formatearPrecio(totalVenta.total || totalVenta)}</p>
                        <p class="success-message">🎉 Venta procesada exitosamente</p>
                        <p class="info-message">💡 Nueva venta iniciada automáticamente</p>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button type="button" class="btn-accept">Continuar</button>
                </div>
            </div>
        `;

        const btnAceptar = modalTicket.querySelector(".btn-accept");
        btnAceptar.addEventListener("click", () => cerrarModal(modalTicket));

        document.body.appendChild(modalTicket);
        
        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
            if (modalTicket.parentNode) {
                cerrarModal(modalTicket);
            }
        }, 3000);
    }

    // ===== UTILIDADES =====
    function cerrarModal(modal) {
        if (modal && modal.parentNode) {
            modal.remove();
        }
        // Restaurar focus al input de escaneo
        setTimeout(() => inputEscaneo.focus(), 100);
    }

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
        // Sonido de beep para escaneo exitoso
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
        // Sonido de error
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
