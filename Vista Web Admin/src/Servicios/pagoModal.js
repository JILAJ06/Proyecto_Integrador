// Script para el modal de pago en Ventas.html
// Autor: GitHub Copilot

document.addEventListener('DOMContentLoaded', function () {
    // Crear el modal dinámicamente si no existe
    if (!document.getElementById('modal-pago')) {
        const modal = document.createElement('div');
        modal.id = 'modal-pago';
        modal.innerHTML = `
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
        document.body.appendChild(modal);
    }

    // Mostrar el modal al hacer clic en el botón Pagar
    const btnPagar = document.querySelector('.btn-pay');
    const modal = document.getElementById('modal-pago');
    const overlay = modal.querySelector('.modal-overlay');
    const btnCancelar = modal.querySelector('.modal-btn-cancelar');
    const btnPagarModal = modal.querySelector('.modal-btn-pagar');
    const inputPago = modal.querySelector('#modal-pago-input');
    const totalSpan = document.querySelector('.total-amount');
    const modalTotal = modal.querySelector('#modal-total');
    const modalCambio = modal.querySelector('#modal-cambio');

    function openModal() {
        // Obtener el total actual
        let total = totalSpan ? totalSpan.textContent.replace(/[^\d.]/g, '') : '0';
        modalTotal.textContent = `$${parseFloat(total).toFixed(2)}`;
        inputPago.value = '';
        modalCambio.textContent = '$0.00';
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    btnPagar.addEventListener('click', openModal);
    overlay.addEventListener('click', closeModal);
    btnCancelar.addEventListener('click', closeModal);

    // Calcular cambio en tiempo real
    inputPago.addEventListener('input', function () {
        let total = totalSpan ? parseFloat(totalSpan.textContent.replace(/[^\d.]/g, '')) : 0;
        let pagado = parseFloat(inputPago.value) || 0;
        let cambio = pagado - total;
        modalCambio.textContent = cambio >= 0 ? `$${cambio.toFixed(2)}` : '$0.00';
    });

    // Acción al hacer clic en "Pagar" dentro del modal
    btnPagarModal.addEventListener('click', function () {
        let total = totalSpan ? parseFloat(totalSpan.textContent.replace(/[^\d.]/g, '')) : 0;
        let pagado = parseFloat(inputPago.value) || 0;
        if (pagado < total) {
            inputPago.classList.add('modal-input-error');
            inputPago.focus();
            return;
        }
        // Aquí puedes agregar la lógica para finalizar la venta
        closeModal();
        mostrarVentaExitosa();
    });

    // Quitar error al escribir
    inputPago.addEventListener('focus', function () {
        inputPago.classList.remove('modal-input-error');
    });

    // Modal de venta exitosa
    function mostrarVentaExitosa() {
        let modalSuccess = document.getElementById('modal-venta-exitosa');
        if (!modalSuccess) {
            modalSuccess = document.createElement('div');
            modalSuccess.id = 'modal-venta-exitosa';
            modalSuccess.innerHTML = `
                <div class="modal-success-overlay"></div>
                <div class="modal-success-content">
                    <div class="modal-success-icon">✔️</div>
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
                        color: #fff;
                        background: #b8e6b8;
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
        }, 1800);
    }
});
