/**
 * Sistema de modales de confirmación global unificado
 * Autor: GitHub Copilot
 */

class ModalesGlobales {
    constructor() {
        this.modalActual = null;
        this.crearEstilos();
    }

    crearEstilos() {
        if (document.getElementById('modales-globales-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'modales-globales-styles';
        style.textContent = `
            .modal-confirmacion {
                display: none;
                position: fixed;
                z-index: 3000;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                align-items: center;
                justify-content: center;
            }

            .modal-confirmacion-overlay {
                position: absolute;
                left: 0;
                top: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0,0,0,0.4);
            }

            .modal-confirmacion-content {
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

            .modal-confirmacion.mostrar .modal-confirmacion-content {
                opacity: 1;
                transform: scale(1);
            }

            .modal-confirmacion-icon {
                font-size: 3.5rem;
                color: #222;
                margin-bottom: 8px;
            }

            .modal-confirmacion-title {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 8px;
                color: #222;
            }

            .modal-confirmacion-text {
                font-size: 1.2rem;
                color: #222;
                text-align: center;
                margin-bottom: 24px;
                line-height: 1.4;
            }

            .modal-confirmacion-actions {
                display: flex;
                justify-content: center;
                gap: 48px;
                width: 100%;
            }

            .modal-confirmacion-btn {
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

            .modal-confirmacion-btn.aceptar:hover {
                background: #b8e6b8;
            }

            .modal-confirmacion-btn.cancelar:hover {
                background: #f2bcbc;
            }

            @media (max-width: 480px) {
                .modal-confirmacion-content {
                    min-width: 320px;
                    padding: 30px 25px 25px 25px;
                    margin: 20px;
                }
                
                .modal-confirmacion-icon {
                    font-size: 2.8rem;
                }
                
                .modal-confirmacion-title {
                    font-size: 1.6rem;
                }
                
                .modal-confirmacion-text {
                    font-size: 1rem;
                }
                
                .modal-confirmacion-actions {
                    gap: 20px;
                }
                
                .modal-confirmacion-btn {
                    font-size: 1.1rem;
                    padding: 12px 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    mostrarConfirmacion(opciones = {}) {
        return new Promise((resolve) => {
            // Cerrar modal existente
            this.cerrarModal();

            const {
                titulo = 'Advertencia',
                texto = '¿Está seguro de querer realizar<br>esta acción?',
                icono = '&#9888;',
                textoAceptar = 'Aceptar',
                textoCancelar = 'Cancelar'
            } = opciones;

            const modal = document.createElement('div');
            modal.className = 'modal-confirmacion';
            modal.innerHTML = `
                <div class="modal-confirmacion-overlay"></div>
                <div class="modal-confirmacion-content">
                    <div class="modal-confirmacion-icon">${icono}</div>
                    <div class="modal-confirmacion-title">${titulo}</div>
                    <div class="modal-confirmacion-text">${texto}</div>
                    <div class="modal-confirmacion-actions">
                        <button class="modal-confirmacion-btn aceptar">${textoAceptar}</button>
                        <button class="modal-confirmacion-btn cancelar">${textoCancelar}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            this.modalActual = modal;

            const overlay = modal.querySelector('.modal-confirmacion-overlay');
            const btnAceptar = modal.querySelector('.aceptar');
            const btnCancelar = modal.querySelector('.cancelar');

            const cerrar = (resultado) => {
                modal.classList.remove('mostrar');
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.remove();
                    }
                    this.modalActual = null;
                }, 280);
                resolve(resultado);
            };

            const manejarEscape = (e) => {
                if (e.key === 'Escape') {
                    document.removeEventListener('keydown', manejarEscape);
                    cerrar(false);
                }
            };

            // Event listeners
            btnAceptar.onclick = () => {
                document.removeEventListener('keydown', manejarEscape);
                cerrar(true);
            };

            btnCancelar.onclick = () => {
                document.removeEventListener('keydown', manejarEscape);
                cerrar(false);
            };

            overlay.onclick = () => {
                document.removeEventListener('keydown', manejarEscape);
                cerrar(false);
            };

            document.addEventListener('keydown', manejarEscape);

            // Mostrar modal
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('mostrar'), 10);
        });
    }

    cerrarModal() {
        if (this.modalActual) {
            this.modalActual.classList.remove('mostrar');
            setTimeout(() => {
                if (this.modalActual && this.modalActual.parentNode) {
                    this.modalActual.remove();
                }
                this.modalActual = null;
            }, 280);
        }
    }
}

// Instancia global
window.Modales = new ModalesGlobales();

// Función de compatibilidad
window.mostrarModalEliminar = (opciones) => window.Modales.mostrarConfirmacion(opciones);