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
    const style = document.createElement('style');
    style.textContent = `
        /* Estilos para el modal de pago */
        #modal-pago {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0; top: 0; width: 100vw; height: 100vh;
            align-items: center; justify-content: center;
        }
        #modal-pago .modal-overlay {
            position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.4);
        }
        #modal-pago .modal-content {
            position: relative;
            background: #e6e7c7;
            border-radius: 24px;
            padding: 32px 32px 24px 32px;
            min-width: 340px;
            min-height: 260px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            gap: 18px;
            z-index: 2;
        }
        #modal-pago .modal-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        #modal-pago .modal-label {
            font-weight: bold;
            font-size: 1.15em;
            background: #fff;
            border-radius: 10px 0 0 10px;
            padding: 8px 18px;
            flex: 1;
            text-align: left;
        }
        #modal-pago .modal-value, #modal-pago .modal-input {
            background: #fff;
            border: none;
            border-radius: 0 10px 10px 0;
            padding: 8px 18px;
            font-size: 1.15em;
            flex: 1;
            text-align: right;
        }
        #modal-pago .modal-input {
            outline: none;
        }
        #modal-pago .modal-input-error {
            border: 2px solid #e74c3c;
            background: #ffeaea;
        }
        #modal-pago .modal-actions {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            margin-top: 12px;
        }
        #modal-pago .modal-btn-cancelar, #modal-pago .modal-btn-pagar {
            flex: 1;
            padding: 10px 0;
            border: none;
            border-radius: 12px;
            background: #fff;
            font-weight: bold;
            font-size: 1.1em;
            cursor: pointer;
            transition: background 0.2s;
        }
        #modal-pago .modal-btn-cancelar:hover {
            background: #f2bcbc;
        }
        #modal-pago .modal-btn-pagar:hover {
            background: #b8e6b8;
        }`;
    document.head.appendChild(style);

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
                    <div class="modal-ticket-question">¿<b>Hacer ticket</b>?</div>
                    <div class="modal-ticket-actions">
                        <button class="modal-ticket-btn-si">Sí</button>
                        <button class="modal-ticket-btn-no">NO</button>
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
            mostrarModalInfoTicket();
        };
        btnNo.onclick = closeTicket;
        // También cerrar al hacer click fuera
        modalTicket.querySelector('.modal-ticket-overlay').onclick = closeTicket;
    }

    // Modal de información del ticket
    function mostrarModalInfoTicket() {
        let modalInfo = document.getElementById('modal-info-ticket');
        if (!modalInfo) {
            modalInfo = document.createElement('div');
            modalInfo.id = 'modal-info-ticket';
            modalInfo.innerHTML = `
                <div class="modal-info-overlay"></div>
                <div class="modal-info-content">
                    <div class="modal-info-left">
                        <div class="modal-info-ticket-text">Información del<br>ticket</div>
                    </div>
                    <div class="modal-info-right">
                        <button class="modal-info-btn modal-info-btn-sms">Enviar por SMS</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalInfo);
            // Estilos solo una vez
            if (!document.getElementById('modal-info-ticket-style')) {
                const style = document.createElement('style');
                style.id = 'modal-info-ticket-style';
                style.textContent = `
                    #modal-info-ticket {
                        display: flex;
                        position: fixed;
                        z-index: 2200;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-info-ticket .modal-info-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.4);
                    }
                    #modal-info-ticket .modal-info-content {
                        position: relative;
                        background: #e6e7c7;
                        border-radius: 36px;
                        padding: 40px 40px 40px 40px;
                        min-width: 700px;
                        min-height: 400px;
                        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                        display: flex;
                        flex-direction: row;
                        gap: 48px;
                        z-index: 2;
                        align-items: center;
                        justify-content: center;
                    }
                    #modal-info-ticket .modal-info-left {
                        background: #fff;
                        border-radius: 24px;
                        min-width: 320px;
                        min-height: 320px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    #modal-info-ticket .modal-info-ticket-text {
                        color: #222;
                        font-size: 2rem;
                        font-weight: bold;
                        text-align: center;
                        line-height: 1.2;
                    }
                    #modal-info-ticket .modal-info-right {
                        display: flex;
                        flex-direction: column;
                        gap: 40px;
                        align-items: center;
                        justify-content: center;
                        min-width: 260px;
                    }
                    #modal-info-ticket .modal-info-btn {
                        background: #fff;
                        border: none;
                        border-radius: 20px;
                        font-size: 1.6rem;
                        font-weight: bold;
                        padding: 22px 36px;
                        margin: 0 auto;
                        cursor: pointer;
                        transition: background 0.2s;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    }
                    #modal-info-ticket .modal-info-btn:hover {
                        background: #b8e6b8;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        modalInfo.style.display = 'flex';
        // Cerrar al hacer click fuera
        modalInfo.querySelector('.modal-info-overlay').onclick = function() {
            modalInfo.style.display = 'none';
        };
        // Funcionalidad para 'Enviar por SMS'
        const btnSms = modalInfo.querySelector('.modal-info-btn-sms');
        btnSms.onclick = function() {
            modalInfo.style.display = 'none';
            mostrarModalClienteRegistrado();
        };
        // Puedes agregar funcionalidad a 'Exportar' aquí si lo deseas
        // modalInfo.querySelector('.modal-info-btn-exportar').onclick = ...
    }

    // Modal de '¿Cliente ya registrado?'
    function mostrarModalClienteRegistrado() {
        let modalCliente = document.getElementById('modal-cliente-registrado');
        if (!modalCliente) {
            modalCliente = document.createElement('div');
            modalCliente.id = 'modal-cliente-registrado';
            modalCliente.innerHTML = `
                <div class="modal-cliente-overlay"></div>
                <div class="modal-cliente-content">
                    <div class="modal-cliente-question">¿<b>Cliente ya registrado</b>?</div>
                    <div class="modal-cliente-actions">
                        <button class="modal-cliente-btn-si">Sí</button>
                        <button class="modal-cliente-btn-no">NO</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalCliente);
            // Estilos solo una vez
            if (!document.getElementById('modal-cliente-registrado-style')) {
                const style = document.createElement('style');
                style.id = 'modal-cliente-registrado-style';
                style.textContent = `
                    #modal-cliente-registrado {
                        display: flex;
                        position: fixed;
                        z-index: 2300;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-cliente-registrado .modal-cliente-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.4);
                    }
                    #modal-cliente-registrado .modal-cliente-content {
                        position: relative;
                        background: #e6e7c7;
                        border-radius: 24px;
                        padding: 32px 32px 24px 32px;
                        min-width: 380px;
                        min-height: 160px;
                        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                        z-index: 2;
                        align-items: center;
                    }
                    #modal-cliente-registrado .modal-cliente-question {
                        background: #fff;
                        border-radius: 16px;
                        font-size: 2rem;
                        font-weight: bold;
                        color: #222;
                        padding: 12px 18px;
                        text-align: center;
                        margin-bottom: 12px;
                    }
                    #modal-cliente-registrado .modal-cliente-actions {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        gap: 48px;
                    }
                    #modal-cliente-registrado .modal-cliente-btn-si, #modal-cliente-registrado .modal-cliente-btn-no {
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
                    #modal-cliente-registrado .modal-cliente-btn-si:hover {
                        background: #b8e6b8;
                    }
                    #modal-cliente-registrado .modal-cliente-btn-no:hover {
                        background: #f2bcbc;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        modalCliente.style.display = 'flex';
        // Acciones de los botones
        const btnSi = modalCliente.querySelector('.modal-cliente-btn-si');
        const btnNo = modalCliente.querySelector('.modal-cliente-btn-no');
        const closeCliente = () => { modalCliente.style.display = 'none'; };
        btnSi.onclick = function() {
            closeCliente();
            mostrarModalTelefonoRegistrado();
        };
        btnNo.onclick = function() {
            closeCliente();
            mostrarModalTelefonoNoRegistrado();
        };
        // También cerrar al hacer click fuera
        modalCliente.querySelector('.modal-cliente-overlay').onclick = closeCliente;
    }

    // Modal para escribir teléfono (cliente registrado)
    function mostrarModalTelefonoRegistrado() {
        let modalTel = document.getElementById('modal-tel-registrado');
        if (!modalTel) {
            modalTel = document.createElement('div');
            modalTel.id = 'modal-tel-registrado';
            modalTel.innerHTML = `
                <div class="modal-tel-overlay"></div>
                <div class="modal-tel-content">
                    <div class="modal-tel-title">Escriba el telefono</div>
                    <div class="modal-tel-ejemplo">Ejem. 25/05/2025</div>
                    <input class="modal-tel-input" type="text" placeholder="__________________________">
                    <div class="modal-tel-actions">
                        <button class="modal-tel-btn-cancelar">Cancelar</button>
                        <button class="modal-tel-btn-aceptar">Aceptar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalTel);
            if (!document.getElementById('modal-tel-registrado-style')) {
                const style = document.createElement('style');
                style.id = 'modal-tel-registrado-style';
                style.textContent = `
                    #modal-tel-registrado {
                        display: flex;
                        position: fixed;
                        z-index: 2400;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-tel-registrado .modal-tel-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.4);
                    }
                    #modal-tel-registrado .modal-tel-content {
                        position: relative;
                        background: #e6e7c7;
                        border-radius: 24px;
                        padding: 32px 32px 24px 32px;
                        min-width: 340px;
                        min-height: 180px;
                        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        z-index: 2;
                    }
                    #modal-tel-registrado .modal-tel-title {
                        font-size: 1.5rem;
                        font-weight: bold;
                        margin-bottom: 2px;
                        margin-top: 8px;
                        text-align: center;
                    }
                    #modal-tel-registrado .modal-tel-ejemplo {
                        font-size: 1.1rem;
                        color: #444;
                        margin-bottom: 8px;
                        text-align: center;
                    }
                    #modal-tel-registrado .modal-tel-input {
                        width: 90%;
                        font-size: 1.2rem;
                        border: none;
                        border-bottom: 2px solid #222;
                        background: transparent;
                        margin-bottom: 18px;
                        outline: none;
                        text-align: center;
                        padding: 6px 0;
                    }
                    #modal-tel-registrado .modal-tel-actions {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        gap: 48px;
                        margin-top: 8px;
                    }
                    #modal-tel-registrado .modal-tel-btn-cancelar, #modal-tel-registrado .modal-tel-btn-aceptar {
                        flex: 1;
                        padding: 12px 0;
                        border: none;
                        border-radius: 16px;
                        background: #fff;
                        font-weight: bold;
                        font-size: 1.3rem;
                        cursor: pointer;
                        transition: background 0.2s;
                        margin: 0 8px;
                    }
                    #modal-tel-registrado .modal-tel-btn-cancelar:hover {
                        background: #f2bcbc;
                    }
                    #modal-tel-registrado .modal-tel-btn-aceptar:hover {
                        background: #b8e6b8;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        modalTel.style.display = 'flex';
        // Acciones de los botones
        const btnCancelar = modalTel.querySelector('.modal-tel-btn-cancelar');
        const btnAceptar = modalTel.querySelector('.modal-tel-btn-aceptar');
        const closeTel = () => { modalTel.style.display = 'none'; };
        btnCancelar.onclick = closeTel;
        btnAceptar.onclick = function() {
            closeTel();
            mostrarVentaExitosaSMS();
        };
        modalTel.querySelector('.modal-tel-overlay').onclick = closeTel;
    }

    // Modal para escribir teléfono y nombre (cliente NO registrado)
    function mostrarModalTelefonoNoRegistrado() {
        let modalTelNom = document.getElementById('modal-tel-nombre');
        if (!modalTelNom) {
            modalTelNom = document.createElement('div');
            modalTelNom.id = 'modal-tel-nombre';
            modalTelNom.innerHTML = `
                <div class="modal-tel-overlay"></div>
                <div class="modal-tel-content">
                    <div class="modal-tel-title">Escriba el telefono</div>
                    <div class="modal-tel-ejemplo">Ejem. 961XXXXXXXX</div>
                    <input class="modal-tel-input" type="text" placeholder="__________________________">
                    <div class="modal-tel-title" style="margin-top:18px;">Escriba el nombre</div>
                    <input class="modal-tel-input" type="text" placeholder="__________________________">
                    <div class="modal-tel-actions">
                        <button class="modal-tel-btn-cancelar">Cancelar</button>
                        <button class="modal-tel-btn-aceptar">Aceptar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modalTelNom);
            if (!document.getElementById('modal-tel-nombre-style')) {
                const style = document.createElement('style');
                style.id = 'modal-tel-nombre-style';
                style.textContent = `
                    #modal-tel-nombre {
                        display: flex;
                        position: fixed;
                        z-index: 2400;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-tel-nombre .modal-tel-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.4);
                    }
                    #modal-tel-nombre .modal-tel-content {
                        position: relative;
                        background: #e6e7c7;
                        border-radius: 24px;
                        padding: 32px 32px 24px 32px;
                        min-width: 340px;
                        min-height: 220px;
                        box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 8px;
                        z-index: 2;
                    }
                    #modal-tel-nombre .modal-tel-title {
                        font-size: 1.5rem;
                        font-weight: bold;
                        margin-bottom: 2px;
                        margin-top: 8px;
                        text-align: center;
                    }
                    #modal-tel-nombre .modal-tel-ejemplo {
                        font-size: 1.1rem;
                        color: #444;
                        margin-bottom: 8px;
                        text-align: center;
                    }
                    #modal-tel-nombre .modal-tel-input {
                        width: 90%;
                        font-size: 1.2rem;
                        border: none;
                        border-bottom: 2px solid #222;
                        background: transparent;
                        margin-bottom: 8px;
                        outline: none;
                        text-align: center;
                        padding: 6px 0;
                    }
                    #modal-tel-nombre .modal-tel-actions {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        gap: 48px;
                        margin-top: 8px;
                    }
                    #modal-tel-nombre .modal-tel-btn-cancelar, #modal-tel-nombre .modal-tel-btn-aceptar {
                        flex: 1;
                        padding: 12px 0;
                        border: none;
                        border-radius: 16px;
                        background: #fff;
                        font-weight: bold;
                        font-size: 1.3rem;
                        cursor: pointer;
                        transition: background 0.2s;
                        margin: 0 8px;
                    }
                    #modal-tel-nombre .modal-tel-btn-cancelar:hover {
                        background: #f2bcbc;
                    }
                    #modal-tel-nombre .modal-tel-btn-aceptar:hover {
                        background: #b8e6b8;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        modalTelNom.style.display = 'flex';
        // Acciones de los botones
        const btnCancelar = modalTelNom.querySelector('.modal-tel-btn-cancelar');
        const btnAceptar = modalTelNom.querySelector('.modal-tel-btn-aceptar');
        const closeTelNom = () => { modalTelNom.style.display = 'none'; };
        btnCancelar.onclick = closeTelNom;
        btnAceptar.onclick = function() {
            closeTelNom();
            mostrarVentaExitosaSMS();
        };
        modalTelNom.querySelector('.modal-tel-overlay').onclick = closeTelNom;

    }

    // Modal de éxito para SMS enviado (igual a venta exitosa)
    function mostrarVentaExitosaSMS() {
        let modalSuccess = document.getElementById('modal-sms-exitoso');
        if (!modalSuccess) {
            modalSuccess = document.createElement('div');
            modalSuccess.id = 'modal-sms-exitoso';
            modalSuccess.innerHTML = `
                <div class="modal-success-overlay"></div>
                <div class="modal-success-content">
                    <div class="modal-success-icon">✔</div>
                    <div class="modal-success-text">SMS ENVIADO</div>
                </div>
            `;
            document.body.appendChild(modalSuccess);
            if (!document.getElementById('modal-sms-success-style')) {
                const style = document.createElement('style');
                style.id = 'modal-sms-success-style';
                style.textContent = `
                    #modal-sms-exitoso {
                        display: flex;
                        position: fixed;
                        z-index: 2500;
                        left: 0; top: 0; width: 100vw; height: 100vh;
                        align-items: center; justify-content: center;
                    }
                    #modal-sms-exitoso .modal-success-overlay {
                        position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                        background: rgba(0,0,0,0.4);
                    }
                    #modal-sms-exitoso .modal-success-content {
                        position: relative;
                        background: transparent;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        z-index: 2;
                    }
                    #modal-sms-exitoso .modal-success-icon {
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
                    #modal-sms-exitoso .modal-success-text {
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
    }
);
