/**
 * Sistema de alertas/notificaciones global unificado
 * Autor: GitHub Copilot
 */

class AlertasGlobales {
    constructor() {
        this.contadorId = 0;
        this.alertasActivas = new Map();
        this.crearEstilos();
    }

    crearEstilos() {
        if (document.getElementById('alertas-globales-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'alertas-globales-styles';
        style.textContent = `
            .alerta-global {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                z-index: 9999;
                max-width: 400px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .alerta-global.mostrar {
                opacity: 1;
                transform: translateX(0);
            }

            .alerta-global.success {
                background: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }

            .alerta-global.error {
                background: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }

            .alerta-global.warning {
                background: #fff3cd;
                color: #856404;
                border: 1px solid #ffeaa7;
            }

            .alerta-global.info {
                background: #d1ecf1;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }

            .alerta-global i {
                font-size: 16px;
            }

            /* Posicionamiento múltiple */
            .alerta-global:nth-child(1) { top: 20px; }
            .alerta-global:nth-child(2) { top: 80px; }
            .alerta-global:nth-child(3) { top: 140px; }
            .alerta-global:nth-child(4) { top: 200px; }
        `;
        document.head.appendChild(style);
    }

    mostrar(mensaje, tipo = 'info', duracion = 3000) {
        const id = `alerta-${++this.contadorId}`;
        
        const iconos = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const alerta = document.createElement('div');
        alerta.id = id;
        alerta.className = `alerta-global ${tipo}`;
        alerta.innerHTML = `
            <i class="${iconos[tipo] || iconos.info}"></i>
            <span>${mensaje}</span>
        `;

        document.body.appendChild(alerta);
        this.alertasActivas.set(id, alerta);

        // Mostrar con animación
        setTimeout(() => alerta.classList.add('mostrar'), 10);

        // Auto-ocultar
        setTimeout(() => this.ocultar(id), duracion);

        return id;
    }

    ocultar(id) {
        const alerta = this.alertasActivas.get(id);
        if (!alerta) return;

        alerta.classList.remove('mostrar');
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
            this.alertasActivas.delete(id);
        }, 300);
    }

    success(mensaje, duracion = 3000) {
        return this.mostrar(mensaje, 'success', duracion);
    }

    error(mensaje, duracion = 4000) {
        return this.mostrar(mensaje, 'error', duracion);
    }

    warning(mensaje, duracion = 3500) {
        return this.mostrar(mensaje, 'warning', duracion);
    }

    info(mensaje, duracion = 3000) {
        return this.mostrar(mensaje, 'info', duracion);
    }

    limpiarTodas() {
        this.alertasActivas.forEach((alerta, id) => {
            this.ocultar(id);
        });
    }
}

// Instancia global
window.Alertas = new AlertasGlobales();

// Funciones de compatibilidad para el código existente, todas usan el mismo diseño y posición
window.mostrarAlertaGlobal = (mensaje, tipo = 'info', duracion = 3000) => window.Alertas.mostrar(mensaje, tipo, duracion);
window.mostrarAlertaVisual = (mensaje, tipo = 'info', duracion = 3000) => window.Alertas.mostrar(mensaje, tipo, duracion);
window.mostrarToast = (mensaje, tipo = 'info', duracion = 3000) => window.Alertas.mostrar(mensaje, tipo, duracion);
window.mostrarNotificacion = (mensaje, tipo = 'info', duracion = 3000) => window.Alertas.mostrar(mensaje, tipo, duracion);
window.mostrarSnackbar = (mensaje, esError = false, duracion = 3000) => window.Alertas.mostrar(mensaje, esError ? 'error' : 'success', duracion);
window.mostrarAlerta = (mensaje, duracion = 3000) => window.Alertas.info(mensaje, duracion);