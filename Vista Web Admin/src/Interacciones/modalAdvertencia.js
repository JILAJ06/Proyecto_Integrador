// --- MODAL DE CONFIRMACIÓN DE ELIMINAR UNIFICADO ---
// Diseño igual a historial, animación igual a inventario
// Uso: window.mostrarModalEliminar({ text, onAccept, onCancel })
function ensureDeleteModal() {
    let modal = document.getElementById('modal-advertencia');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-advertencia';
        modal.innerHTML = `
            <div class="modal-advertencia-overlay"></div>
            <div class="modal-advertencia-content">
                <div class="modal-advertencia-icon">&#9888;</div>
                <div class="modal-advertencia-title">Advertencia</div>
                <div class="modal-advertencia-text">¿Está seguro de querer realizar<br>esta acción?</div>
                <div class="modal-advertencia-actions">
                    <button class="modal-advertencia-btn-aceptar">Aceptar</button>
                    <button class="modal-advertencia-btn-cancelar">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    if (!document.getElementById('modal-advertencia-style')) {
        const style = document.createElement('style');
        style.id = 'modal-advertencia-style';
        style.textContent = `
            #modal-advertencia {
                display: none;
                position: fixed;
                z-index: 3000;
                left: 0; top: 0; width: 100vw; height: 100vh;
                align-items: center; justify-content: center;
            }
            #modal-advertencia .modal-advertencia-overlay {
                position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                background: rgba(0,0,0,0.4);
            }
            #modal-advertencia .modal-advertencia-content {
                position: relative;
                background: #e6e7c7;
                border-radius: 32px;
                padding: 38px 38px 32px 38px;
                min-width: 420px;
                min-height: 220px;
                box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                display: flex;
                flex-direction: column;
                align-items: center;
                z-index: 2;
                opacity: 0;
                transform: scale(0.85);
                transition: opacity 0.28s cubic-bezier(.4,1.3,.6,1), transform 0.28s cubic-bezier(.4,1.3,.6,1);
            }
            #modal-advertencia.mostrar .modal-advertencia-content {
                opacity: 1;
                transform: scale(1);
            }
            #modal-advertencia .modal-advertencia-icon {
                font-size: 3.5rem;
                color: #222;
                margin-bottom: 8px;
            }
            #modal-advertencia .modal-advertencia-title {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 8px;
                color: #222;
            }
            #modal-advertencia .modal-advertencia-text {
                font-size: 1.2rem;
                color: #222;
                text-align: center;
                margin-bottom: 24px;
            }
            #modal-advertencia .modal-advertencia-actions {
                display: flex;
                justify-content: center;
                gap: 48px;
                width: 100%;
            }
            #modal-advertencia .modal-advertencia-btn-aceptar, #modal-advertencia .modal-advertencia-btn-cancelar {
                flex: 1;
                padding: 14px 0;
                border: none;
                border-radius: 20px;
                background: #fff;
                font-weight: bold;
                font-size: 1.3rem;
                cursor: pointer;
                transition: background 0.2s;
                margin: 0 8px;
            }
            #modal-advertencia .modal-advertencia-btn-aceptar:hover {
                background: #b8e6b8;
            }
            #modal-advertencia .modal-advertencia-btn-cancelar:hover {
                background: #f2bcbc;
            }
        `;
        document.head.appendChild(style);
    }
    return modal;
}

window.mostrarModalEliminar = function(options = {}) {
    const modal = ensureDeleteModal();
    const content = modal.querySelector('.modal-advertencia-content');
    const overlay = modal.querySelector('.modal-advertencia-overlay');
    const btnAceptar = modal.querySelector('.modal-advertencia-btn-aceptar');
    const btnCancelar = modal.querySelector('.modal-advertencia-btn-cancelar');
    // Personaliza el texto si se pasa
    if (options.text) {
        modal.querySelector('.modal-advertencia-text').innerHTML = options.text;
    } else {
        modal.querySelector('.modal-advertencia-text').innerHTML = '¿Está seguro de querer realizar<br>esta acción?';
    }
    // Mostrar modal con animación
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('mostrar'), 10);
    // Cerrar modal
    function close() {
        modal.classList.remove('mostrar');
        setTimeout(() => { modal.style.display = 'none'; }, 280);
    }
    // Limpiar listeners previos
    btnAceptar.onclick = null;
    btnCancelar.onclick = null;
    overlay.onclick = null;
    // Aceptar
    btnAceptar.onclick = function() {
        close();
        if (typeof options.onAccept === 'function') options.onAccept();
    };
    // Cancelar
    btnCancelar.onclick = function() {
        close();
        if (typeof options.onCancel === 'function') options.onCancel();
    };
    overlay.onclick = function() {
        close();
        if (typeof options.onCancel === 'function') options.onCancel();
    };
};
// Dropdown funcionalidad para Meses en historial.html
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.getElementById('meses-combobox-btn');
    const list = document.getElementById('meses-combobox-list');
    const label = document.getElementById('meses-combobox-label');
    if (!btn || !list) return;
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        list.style.display = (list.style.display === 'block') ? 'none' : 'block';
    });
    // Selección de mes
    list.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const mes = a.getAttribute('data-mes');
            label.textContent = a.textContent.trim();
            list.style.display = 'none';
            // Aquí puedes llamar a tu función de filtro, por ejemplo:
            if (typeof window.filterByMes === 'function') window.filterByMes(mes);
        });
    });
    // Cerrar al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!btn.contains(e.target) && !list.contains(e.target)) {
            list.style.display = 'none';
        }
    });
});
// Combobox funcionalidad para meses y días (usando clase .active en el contenedor)
document.addEventListener('DOMContentLoaded', function () {
    // --- Meses ---
    const mesesDropdown = document.getElementById('meses-combobox');
    const btnMes = document.getElementById('meses-combobox-btn');
    const listMes = document.getElementById('meses-combobox-list');
    const labelMes = document.getElementById('meses-combobox-label');
    if (mesesDropdown && btnMes && listMes && labelMes) {
        btnMes.addEventListener('click', function(e) {
            e.stopPropagation();
            mesesDropdown.classList.toggle('active');
        });
        listMes.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                const mes = a.getAttribute('data-mes');
                labelMes.textContent = mes.charAt(0).toUpperCase() + mes.slice(1);
                mesesDropdown.classList.remove('active');
                listMes.querySelectorAll('a').forEach(a2 => a2.classList.remove('selected'));
                a.classList.add('selected');
                if (typeof window.filterByMonth === 'function') window.filterByMonth(mes);
            });
        });
    }

    // --- Día ---
    const diaDropdown = document.getElementById('dia-combobox');
    const btnDia = document.getElementById('dia-combobox-btn');
    const listDia = document.getElementById('dia-combobox-list');
    const labelDia = document.getElementById('dia-combobox-label');
    if (diaDropdown && btnDia && listDia && labelDia) {
        btnDia.addEventListener('click', function(e) {
            e.stopPropagation();
            diaDropdown.classList.toggle('active');
        });
        listDia.querySelectorAll('a').forEach(function(a) {
            a.addEventListener('click', function(e) {
                e.preventDefault();
                const dia = a.getAttribute('data-dia');
                labelDia.textContent = dia;
                diaDropdown.classList.remove('active');
                listDia.querySelectorAll('a').forEach(a2 => a2.classList.remove('selected'));
                a.classList.add('selected');
                if (typeof window.filterByDay === 'function') window.filterByDay(dia);
            });
        });
    }

    // Cerrar cualquier dropdown al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (mesesDropdown && !mesesDropdown.contains(e.target)) {
            mesesDropdown.classList.remove('active');
        }
        if (diaDropdown && !diaDropdown.contains(e.target)) {
            diaDropdown.classList.remove('active');
        }
    });
});

// Script para mostrar el modal de advertencia al eliminar en historial
// Incluye: selección de filas, advertencia de exportar, alerta visual y combobox de meses
// Autor: GitHub Copilot

document.addEventListener('DOMContentLoaded', function () {
    const btnEliminar = document.querySelector('.btn-delete');
    const btnExportar = document.querySelector('.btn-export');
    if (!btnEliminar && !btnExportar) return;

    // Selección de fila en la tabla
    const tabla = document.querySelector('.products-table tbody');
    let filaSeleccionada = null;
    if (tabla) {
        tabla.addEventListener('click', function (e) {
            let tr = e.target.closest('tr');
            if (!tr) return;
            // Quitar selección previa
            if (filaSeleccionada) filaSeleccionada.classList.remove('selected-row');
            filaSeleccionada = tr;
            tr.classList.add('selected-row');
        });
        // Estilo para la fila seleccionada
        if (!document.getElementById('row-selected-style')) {
            const style = document.createElement('style');
            style.id = 'row-selected-style';
            style.textContent = `.products-table tbody tr.selected-row {
                background: #e3f2fd !important;
                outline: 2px solid #2196f3 !important;
                outline-offset: -2px;
            }`;
            document.head.appendChild(style);
        }
    }

    // Crear el modal si no existe
    let modal = document.getElementById('modal-advertencia');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-advertencia';
        modal.innerHTML = `
            <div class="modal-advertencia-overlay"></div>
            <div class="modal-advertencia-content">
                <div class="modal-advertencia-icon">&#9888;</div>
                <div class="modal-advertencia-title">Advertencia</div>
                <div class="modal-advertencia-text">¿Esta seguro de querer realizar<br>esta acción?</div>
                <div class="modal-advertencia-actions">
                    <button class="modal-advertencia-btn-aceptar">Aceptar</button>
                    <button class="modal-advertencia-btn-cancelar">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        // Estilos solo una vez
        if (!document.getElementById('modal-advertencia-style')) {
            const style = document.createElement('style');
            style.id = 'modal-advertencia-style';
            style.textContent = `
                #modal-advertencia {
                    display: none;
                    position: fixed;
                    z-index: 3000;
                    left: 0; top: 0; width: 100vw; height: 100vh;
                    align-items: center; justify-content: center;
                }
                #modal-advertencia .modal-advertencia-overlay {
                    position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.4);
                }
                #modal-advertencia .modal-advertencia-content {
                    position: relative;
                    background: #e6e7c7;
                    border-radius: 32px;
                    padding: 38px 38px 32px 38px;
                    min-width: 420px;
                    min-height: 220px;
                    box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    z-index: 2;
                }
                #modal-advertencia .modal-advertencia-icon {
                    font-size: 3.5rem;
                    color: #222;
                    margin-bottom: 8px;
                }
                #modal-advertencia .modal-advertencia-title {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 8px;
                    color: #222;
                }
                #modal-advertencia .modal-advertencia-text {
                    font-size: 1.2rem;
                    color: #222;
                    text-align: center;
                    margin-bottom: 24px;
                }
                #modal-advertencia .modal-advertencia-actions {
                    display: flex;
                    justify-content: center;
                    gap: 48px;
                    width: 100%;
                }
                #modal-advertencia .modal-advertencia-btn-aceptar, #modal-advertencia .modal-advertencia-btn-cancelar {
                    flex: 1;
                    padding: 14px 0;
                    border: none;
                    border-radius: 20px;
                    background: #fff;
                    font-weight: bold;
                    font-size: 1.3rem;
                    cursor: pointer;
                    transition: background 0.2s;
                    margin: 0 8px;
                }
                #modal-advertencia .modal-advertencia-btn-aceptar:hover {
                    background: #b8e6b8;
                }
                #modal-advertencia .modal-advertencia-btn-cancelar:hover {
                    background: #f2bcbc;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function openModal() {
        if (!filaSeleccionada) {
            mostrarAlertaVisual('Selecciona una fila de la tabla para eliminar.');
            return;
        }
        modal.style.display = 'flex';
    }
    function closeModal() {
        modal.style.display = 'none';
    }

    if (btnEliminar) btnEliminar.addEventListener('click', openModal);
    if (btnExportar) btnExportar.addEventListener('click', function() {
        // Para exportar, solo mostrar el modal, sin requerir selección de fila
        modal.style.display = 'flex';
    });
    modal.querySelector('.modal-advertencia-overlay').onclick = closeModal;
    modal.querySelector('.modal-advertencia-btn-cancelar').onclick = closeModal;
    modal.querySelector('.modal-advertencia-btn-aceptar').onclick = function() {
        // Si el modal fue abierto por exportar, mostrar alerta visual
        if (modal.style.display === 'flex' && btnExportar && btnExportar.matches('.exporting')) {
            closeModal();
            btnExportar.classList.remove('exporting');
            mostrarAlertaDescarga();
            return;
        }
        closeModal();
        if (filaSeleccionada) {
            filaSeleccionada.remove();
            filaSeleccionada = null;
        }
    };

    // Marcar el botón exportar como "exportando" para distinguir la acción
    if (btnExportar) {
        btnExportar.addEventListener('click', function() {
            btnExportar.classList.add('exporting');
        });
    }

    // Función para mostrar la alerta visual de descarga exitosa
    function mostrarAlertaDescarga() {
        if (document.getElementById('alerta-descarga')) return;
        const alerta = document.createElement('div');
        alerta.id = 'alerta-descarga';
        alerta.textContent = 'El archivo ha sido descargado con éxito';
        document.body.appendChild(alerta);
        if (!document.getElementById('alerta-descarga-style')) {
            const style = document.createElement('style');
            style.id = 'alerta-descarga-style';
            style.textContent = `
                #alerta-descarga {
                    position: fixed;
                    right: 32px;
                    bottom: 32px;
                    background: #f6f7f2;
                    color: #444;
                    border-radius: 20px;
                    box-shadow: 0 2px 16px rgba(0,0,0,0.10);
                    padding: 18px 32px;
                    font-size: 1.2rem;
                    z-index: 4000;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.4s;
                }
                #alerta-descarga.mostrar {
                    opacity: 1;
                }
            `;
            document.head.appendChild(style);
        }
        setTimeout(() => {
            alerta.classList.add('mostrar');
        }, 50);
        setTimeout(() => {
            alerta.classList.remove('mostrar');
            setTimeout(() => alerta.remove(), 400);
        }, 2600);
    }
});
