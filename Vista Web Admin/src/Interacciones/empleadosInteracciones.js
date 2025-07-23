// Importar las funciones del servicio
import { getEmpleados, postEmpleado, putEmpleado, deleteEmpleado } from '../Servicios/empleadosService.js';

// Interacciones para los botones de empleados.html
// Autor: GitHub Copilot

document.addEventListener('DOMContentLoaded', function () {
    const btnAgregar = document.querySelector('.btn-add');
    const btnEditar = document.querySelector('.btn-edit');
    const btnEliminar = document.querySelector('.btn-category');

    // Selección de fila en la tabla de empleados
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
        if (!document.getElementById('row-selected-style-empleados')) {
            const style = document.createElement('style');
            style.id = 'row-selected-style-empleados';
            style.textContent = `.products-table tbody tr.selected-row {
                background: #e3f2fd !important;
                outline: 2px solid #2196f3 !important;
                outline-offset: -2px;
            }`;
            document.head.appendChild(style);
        }
    }

    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            // Verificar si ya existe un modal
            const modalExistente = document.getElementById('modal-add-empleado');
            if (modalExistente) {
                modalExistente.remove();
            }

            // Crear modal para agregar empleado con el diseño de formsInventario.js
            const modal = document.createElement('div');
            modal.id = 'modal-add-empleado';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>Agregar Nuevo Empleado</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="form-add-empleado" class="modal-form">
                        <div class="form-group">
                            <label>Nombre de Usuario</label>
                            <input type="text" name="nombreUsuario" required placeholder="Ejem. juan_perez">
                        </div>
                        
                        <div class="form-group">
                            <label>Correo</label>
                            <input type="email" name="correo" required placeholder="empleado@gmail.com">
                        </div>
                        
                        <div class="form-group">
                            <label>Contraseña</label>
                            <input type="password" name="contrasena" required placeholder="Contraseña">
                        </div>
                        
                        <div class="form-group">
                            <label>Rol</label>
                            <select name="rol" required>
                                <option value="">Seleccionar Rol</option>
                                <option value="Admin">Admin</option>
                                <option value="Empleado">Empleado</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Calle</label>
                            <input type="text" name="calle" required placeholder="Av. Juárez #123">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Colonia</label>
                                <input type="text" name="colonia" required placeholder="Centro">
                            </div>
                            
                            <div class="form-group">
                                <label>Código Postal</label>
                                <input type="text" name="codigoPostal" pattern="[0-9]{5}" required placeholder="12345">
                            </div>
                        </div>
                        
                        <div class="modal-buttons">
                            <button type="button" class="btn-cancel">Cancelar</button>
                            <button type="submit" class="btn-accept">Aceptar</button>
                        </div>
                    </form>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Aplicar estilos del formulario de inventario
            aplicarEstilosModalFormulario();
            
            // Configurar eventos del modal
            setupModalFormularioEvents(modal);
            
            // Mostrar modal
            modal.classList.add('active');
            
            // Auto-enfocar primer input
            setTimeout(() => {
                const primerInput = modal.querySelector('input[name="nombreUsuario"]');
                if (primerInput) primerInput.focus();
            }, 300);
        });
    }

    if (btnEditar) {
        btnEditar.addEventListener('click', function() {
            // Solo permitir si hay una fila seleccionada
            if (!filaSeleccionada) {
                mostrarSnackbar('Selecciona una fila para editar', true);
                return;
            }
            
            // Obtener datos actuales de la fila seleccionada
            const celdas = filaSeleccionada.querySelectorAll('td');
            const nombreUsuario = celdas[0]?.textContent.trim() || '';
            const correo = celdas[1]?.textContent.trim() || '';
            const direccionCompleta = celdas[2]?.textContent.trim() || '';
            
            // Parsear la dirección completa
            const direccionPartes = direccionCompleta.split(', ');
            const calle = direccionPartes[0]?.trim() || '';
            const colonia = direccionPartes[1]?.trim() || '';
            const codigoPostal = direccionPartes[2]?.trim() || '';
            
            // Verificar si ya existe un modal
            const modalExistente = document.getElementById('modal-edit-empleado');
            if (modalExistente) {
                modalExistente.remove();
            }

            // Crear modal para editar empleado con el diseño de formsInventario.js
            const modal = document.createElement('div');
            modal.id = 'modal-edit-empleado';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-container">
                    <div class="modal-header">
                        <h3>Modificar Empleado</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <form id="form-edit-empleado" class="modal-form">
                        <div class="form-group">
                            <label>Nombre de Usuario</label>
                            <input type="text" name="nombreUsuario" value="${nombreUsuario}" required readonly>
                        </div>
                        
                        <div class="form-group">
                            <label>Correo</label>
                            <input type="email" name="correo" value="${correo}" required>
                        </div>
                        
                        <div class="form-group">
                            <label>Nueva Contraseña</label>
                            <input type="password" name="contrasena" placeholder="Dejar vacío para mantener actual">
                        </div>
                        
                        <div class="form-group">
                            <label>Rol</label>
                            <select name="rol" required>
                                <option value="">Seleccionar Rol</option>
                                <option value="Admin">Admin</option>
                                <option value="Empleado" selected>Empleado</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Calle</label>
                            <input type="text" name="calle" value="${calle}" required>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Colonia</label>
                                <input type="text" name="colonia" value="${colonia}" required>
                            </div>
                            
                            <div class="form-group">
                                <label>Código Postal</label>
                                <input type="text" name="codigoPostal" pattern="[0-9]{5}" value="${codigoPostal}" required>
                            </div>
                        </div>
                        
                        <div class="modal-buttons">
                            <button type="button" class="btn-cancel">Cancelar</button>
                            <button type="submit" class="btn-accept" data-usuario="${nombreUsuario}">Guardar Cambios</button>
                        </div>
                    </form>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Aplicar estilos del formulario de inventario
            aplicarEstilosModalFormulario();
            
            // Configurar eventos del modal
            setupModalFormularioEvents(modal);
            
            // Mostrar modal
            modal.classList.add('active');
            
            // Auto-enfocar primer input editable
            setTimeout(() => {
                const primerInput = modal.querySelector('input[name="correo"]');
                if (primerInput) primerInput.focus();
            }, 300);
        });
    }
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function() {
            // Solo permitir si hay una fila seleccionada
            if (!filaSeleccionada) {
                mostrarSnackbar('Selecciona una fila para eliminar', true);
                return;
            }

            // Crear modal de advertencia con el mismo diseño que los otros
            crearModalEliminarEmpleado();
        });
    }

    // Función para crear modal de eliminar empleado
    function crearModalEliminarEmpleado() {
        // Verificar si ya existe un modal
        const modalExistente = document.getElementById('modal-advertencia-empleados');
        if (modalExistente) {
            modalExistente.remove();
        }

        // Crear el modal usando el mismo diseño que modalAdvertencia.js
        const modal = document.createElement('div');
        modal.id = 'modal-advertencia-empleados';
        modal.innerHTML = `
            <div class="modal-advertencia-overlay"></div>
            <div class="modal-advertencia-content">
                <div class="modal-advertencia-icon">&#9888;</div>
                <div class="modal-advertencia-title">Advertencia</div>
                <div class="modal-advertencia-text">Está a punto de eliminar un empleado<br>de esta sección,<br>¿está seguro de querer realizar esta acción?</div>
                <div class="modal-advertencia-actions">
                    <button class="modal-advertencia-btn-aceptar">Aceptar</button>
                    <button class="modal-advertencia-btn-cancelar">Cancelar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Aplicar estilos del modal de advertencia
        aplicarEstilosModalAdvertenciaEmpleados();
        
        // Configurar eventos del modal de eliminar
        setupModalAdvertenciaEventsEmpleados(modal);
        
        // Mostrar modal con animación
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('mostrar'), 10);
    }

    // Función para aplicar estilos específicos del modal de advertencia para empleados
    function aplicarEstilosModalAdvertenciaEmpleados() {
        // Verificar si ya existen los estilos
        if (document.getElementById('modal-advertencia-styles-empleados')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'modal-advertencia-styles-empleados';
        style.textContent = `
            #modal-advertencia-empleados {
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

            #modal-advertencia-empleados .modal-advertencia-overlay {
                position: absolute; 
                left: 0; 
                top: 0; 
                width: 100vw; 
                height: 100vh;
                background: rgba(0,0,0,0.4);
            }

            #modal-advertencia-empleados .modal-advertencia-content {
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

            #modal-advertencia-empleados.mostrar .modal-advertencia-content {
                opacity: 1;
                transform: scale(1);
            }

            #modal-advertencia-empleados .modal-advertencia-icon {
                font-size: 3.5rem;
                color: #222;
                margin-bottom: 8px;
            }

            #modal-advertencia-empleados .modal-advertencia-title {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 8px;
                color: #222;
            }

            #modal-advertencia-empleados .modal-advertencia-text {
                font-size: 1.2rem;
                color: #222;
                text-align: center;
                margin-bottom: 24px;
                line-height: 1.4;
            }

            #modal-advertencia-empleados .modal-advertencia-actions {
                display: flex;
                justify-content: center;
                gap: 48px;
                width: 100%;
            }

            #modal-advertencia-empleados .modal-advertencia-btn-aceptar, 
            #modal-advertencia-empleados .modal-advertencia-btn-cancelar {
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

            #modal-advertencia-empleados .modal-advertencia-btn-aceptar:hover {
                background: #b8e6b8;
            }

            #modal-advertencia-empleados .modal-advertencia-btn-cancelar:hover {
                background: #f2bcbc;
            }

            /* Responsive para pantallas pequeñas */
            @media (max-width: 480px) {
                #modal-advertencia-empleados .modal-advertencia-content {
                    min-width: 320px;
                    padding: 30px 25px 25px 25px;
                    margin: 20px;
                }
                
                #modal-advertencia-empleados .modal-advertencia-icon {
                    font-size: 2.8rem;
                }
                
                #modal-advertencia-empleados .modal-advertencia-title {
                    font-size: 1.6rem;
                }
                
                #modal-advertencia-empleados .modal-advertencia-text {
                    font-size: 1rem;
                }
                
                #modal-advertencia-empleados .modal-advertencia-actions {
                    gap: 20px;
                }
                
                #modal-advertencia-empleados .modal-advertencia-btn-aceptar, 
                #modal-advertencia-empleados .modal-advertencia-btn-cancelar {
                    font-size: 1.1rem;
                    padding: 12px 0;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // Función para configurar eventos del modal de advertencia para empleados
    function setupModalAdvertenciaEventsEmpleados(modal) {
        const btnAceptar = modal.querySelector('.modal-advertencia-btn-aceptar');
        const btnCancelar = modal.querySelector('.modal-advertencia-btn-cancelar');
        const overlay = modal.querySelector('.modal-advertencia-overlay');

        // Función para cerrar modal con animación
        function cerrarModal() {
            modal.classList.remove('mostrar');
            setTimeout(() => { 
                if (modal.parentNode) {
                    modal.remove(); 
                }
            }, 280);
        }

        // Evento para cerrar modal con Escape
        function handleEscape(e) {
            if (e.key === 'Escape') {
                cerrarModal();
            }
        }

        document.addEventListener('keydown', handleEscape);

        // Limpiar listeners previos
        btnAceptar.onclick = null;
        btnCancelar.onclick = null;
        overlay.onclick = null;

        // Evento del botón aceptar (confirmar eliminación)
        btnAceptar.onclick = async function() {
            if (filaSeleccionada) {
                // El nombre de usuario está en la primera celda (índice 0)
                const celdas = filaSeleccionada.querySelectorAll('td');
                const nombreUsuario = celdas[0]?.textContent.trim(); // Primera celda: nombreUsuario
                
                console.log('Intentando eliminar empleado:', nombreUsuario);
                console.log('Celdas disponibles:', Array.from(celdas).map(celda => celda.textContent));
                
                if (nombreUsuario) {
                    try {
                        await deleteEmpleado(nombreUsuario);
                        
                        // Limpiar selección después de eliminar
                        filaSeleccionada.classList.remove('selected-row');
                        filaSeleccionada = null;
                        
                        mostrarSnackbar('El empleado ha sido eliminado con éxito');
                        cerrarModal();
                    } catch (error) {
                        console.error('Error al eliminar empleado:', error);
                        mostrarSnackbar('Error al eliminar el empleado', true);
                    }
                } else {
                    console.error('No se pudo obtener el nombre de usuario de la fila seleccionada');
                    mostrarSnackbar('Error: No se pudo identificar el empleado a eliminar', true);
                }
            }
            
            // Limpiar event listener
            document.removeEventListener('keydown', handleEscape);
        };

        // Evento del botón cancelar
        btnCancelar.onclick = function() {
            cerrarModal();
            document.removeEventListener('keydown', handleEscape);
        };

        // Evento para cerrar modal al hacer clic en overlay
        overlay.onclick = function() {
            cerrarModal();
            document.removeEventListener('keydown', handleEscape);
        };
    }

});

// Función para aplicar estilos mejorados del modal de agregar empleado
function aplicarEstilosModalAgregarEmpleadoMejorado() {
    if (document.getElementById('modal-agregar-style-empleados-mejorado')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'modal-agregar-style-empleados-mejorado';
    style.textContent = `
        #modal-agregar-empleado {
            display: none;
            position: fixed;
            z-index: 3000;
            left: 0; top: 0; width: 100vw; height: 100vh;
            align-items: center; justify-content: center;
        }
        #modal-agregar-empleado .modal-agregar-overlay {
            position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.4);
        }
        #modal-agregar-empleado .modal-agregar-content {
            position: relative;
            background: #e6e7c7;
            border-radius: 32px;
            padding: 24px 0 18px 0;
            min-width: 420px;
            max-width: 480px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            z-index: 2;
            gap: 10px;
            opacity: 0;
            transform: scale(0.85);
            transition: opacity 0.28s cubic-bezier(.4,1.3,.6,1), transform 0.28s cubic-bezier(.4,1.3,.6,1);
        }
        #modal-agregar-empleado.mostrar .modal-agregar-content {
            opacity: 1;
            transform: scale(1);
        }
        #modal-agregar-empleado .modal-agregar-group {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin: 0 32px 0 32px;
            margin-bottom: 8px;
        }
        #modal-agregar-empleado .modal-agregar-label {
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 2px;
            text-align: center;
        }
        #modal-agregar-empleado .modal-agregar-placeholder {
            font-size: 1rem;
            color: #444;
            margin-bottom: 2px;
            text-align: center;
        }
        #modal-agregar-empleado .modal-agregar-input {
            font-size: 1.1rem;
            border: none;
            border-radius: 12px;
            padding: 10px 12px;
            margin-bottom: 2px;
            background: #fff;
            box-shadow: 0 2px 0 #222;
            outline: none;
        }
        #modal-agregar-empleado .modal-agregar-actions {
            display: flex;
            justify-content: center;
            gap: 48px;
            margin: 18px 32px 0 32px;
        }
        #modal-agregar-empleado .modal-agregar-btn-aceptar, #modal-agregar-empleado .modal-agregar-btn-cancelar {
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
        #modal-agregar-empleado .modal-agregar-btn-aceptar:hover {
            background: #b8e6b8;
        }
        #modal-agregar-empleado .modal-agregar-btn-cancelar:hover {
            background: #f2bcbc;
        }
    `;
    document.head.appendChild(style);
}

// Función para aplicar estilos mejorados del modal de editar empleado
function aplicarEstilosModalEditarEmpleadoMejorado() {
    if (document.getElementById('modal-editar-style-empleados-mejorado')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'modal-editar-style-empleados-mejorado';
    style.textContent = `
        #modal-editar-empleado {
            display: none;
            position: fixed;
            z-index: 3000;
            left: 0; top: 0; width: 100vw; height: 100vh;
            align-items: center; justify-content: center;
        }
        #modal-editar-empleado .modal-editar-overlay {
            position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.4);
        }
        #modal-editar-empleado .modal-editar-content {
            position: relative;
            background: #e6e7c7;
            border-radius: 32px;
            padding: 24px 0 18px 0;
            min-width: 420px;
            max-width: 480px;
            box-shadow: 0 4px 32px rgba(0,0,0,0.18);
            display: flex;
            flex-direction: column;
            align-items: stretch;
            z-index: 2;
            gap: 10px;
            opacity: 0;
            transform: scale(0.85);
            transition: opacity 0.28s cubic-bezier(.4,1.3,.6,1), transform 0.28s cubic-bezier(.4,1.3,.6,1);
        }
        #modal-editar-empleado.mostrar .modal-editar-content {
            opacity: 1;
            transform: scale(1);
        }
        #modal-editar-empleado .modal-editar-group {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin: 0 32px 0 32px;
            margin-bottom: 8px;
        }
        #modal-editar-empleado .modal-editar-label {
            font-size: 1.3rem;
            font-weight: bold;
            margin-bottom: 2px;
            text-align: center;
        }
        #modal-editar-empleado .modal-editar-placeholder {
            font-size: 1rem;
            color: #444;
            margin-bottom: 2px;
            text-align: center;
        }
        #modal-editar-empleado .modal-editar-input {
            font-size: 1.1rem;
            border: none;
            border-radius: 12px;
            padding: 10px 12px;
            margin-bottom: 2px;
            background: #fff;
            box-shadow: 0 2px 0 #222;
            outline: none;
        }
        #modal-editar-empleado .modal-editar-actions {
            display: flex;
            justify-content: center;
            gap: 48px;
            margin: 18px 32px 0 32px;
        }
        #modal-editar-empleado .modal-editar-btn-aceptar, #modal-editar-empleado .modal-editar-btn-cancelar {
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
        #modal-editar-empleado .modal-editar-btn-aceptar:hover {
            background: #b8e6b8;
        }
        #modal-editar-empleado .modal-editar-btn-cancelar:hover {
            background: #f2bcbc;
        }
    `;
    document.head.appendChild(style);
}

// Función para configurar eventos del modal de agregar empleado
function setupModalAgregarEmpleadoEvents(modal) {
    const btnAceptar = modal.querySelector('.modal-agregar-btn-aceptar');
    const btnCancelar = modal.querySelector('.modal-agregar-btn-cancelar');
    const overlay = modal.querySelector('.modal-agregar-overlay');
    const form = modal.querySelector('.modal-agregar-content');

    // Función para cerrar modal con animación
    function cerrarModal() {
        modal.classList.remove('mostrar');
        setTimeout(() => { 
            if (modal.parentNode) {
                modal.remove(); 
            }
        }, 280);
    }

    // Evento para cerrar modal con Escape
    function handleEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    }

    document.addEventListener('keydown', handleEscape);

    // Cerrar modal con overlay y botón cancelar
    overlay.onclick = function() {
        cerrarModal();
        document.removeEventListener('keydown', handleEscape);
    };
    
    btnCancelar.onclick = function() {
        cerrarModal();
        document.removeEventListener('keydown', handleEscape);
    };

    // Manejar envío del formulario
    form.onsubmit = async function(e) {
        e.preventDefault();
        
        const inputs = modal.querySelectorAll('.modal-agregar-input');
        const empleadoData = {
            nombreUsuario: inputs[0].value.trim(),
            correo: inputs[1].value.trim(),
            contrasena: inputs[2].value.trim(),
            rol: inputs[3].value,
            calle: inputs[4].value.trim(),
            colonia: inputs[5].value.trim(),
            codigoPostal: inputs[6].value.trim()
        };
        
        if (!empleadoData.nombreUsuario || !empleadoData.correo || !empleadoData.contrasena || 
            !empleadoData.rol || !empleadoData.calle || !empleadoData.colonia || !empleadoData.codigoPostal) {
            mostrarSnackbar('Por favor completa todos los campos', true);
            return;
        }
        
        try {
            await postEmpleado(empleadoData);
            cerrarModal();
            mostrarSnackbar('Empleado agregado con éxito');
            document.removeEventListener('keydown', handleEscape);
        } catch (error) {
            console.error('Error al agregar empleado:', error);
            mostrarSnackbar('Error al agregar el empleado', true);
        }
    };
}

// Función para configurar eventos del modal de editar empleado
function setupModalEditarEmpleadoEvents(modal) {
    const btnAceptar = modal.querySelector('.modal-editar-btn-aceptar');
    const btnCancelar = modal.querySelector('.modal-editar-btn-cancelar');
    const overlay = modal.querySelector('.modal-editar-overlay');
    const form = modal.querySelector('.modal-editar-content');
    const nombreUsuarioOriginal = btnAceptar.getAttribute('data-usuario');

    // Función para cerrar modal con animación
    function cerrarModal() {
        modal.classList.remove('mostrar');
        setTimeout(() => { 
            if (modal.parentNode) {
                modal.remove(); 
            }
        }, 280);
        // Limpiar selección
        if (filaSeleccionada) {
            filaSeleccionada.classList.remove('selected-row');
            filaSeleccionada = null;
        }
    }

    // Evento para cerrar modal con Escape
    function handleEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    }

    document.addEventListener('keydown', handleEscape);

    // Cerrar modal con overlay y botón cancelar
    overlay.onclick = function() {
        cerrarModal();
        document.removeEventListener('keydown', handleEscape);
    };
    
    btnCancelar.onclick = function() {
        cerrarModal();
        document.removeEventListener('keydown', handleEscape);
    };

    // Manejar envío del formulario
    form.onsubmit = async function(e) {
        e.preventDefault();
        
        const inputs = modal.querySelectorAll('.modal-editar-input');
        
        const datosActualizados = {
            nombreUsuario: inputs[0].value.trim(),
            correo: inputs[1].value.trim(),
            rol: inputs[3].value,
            calle: inputs[4].value.trim(),
            colonia: inputs[5].value.trim(),
            codigoPostal: inputs[6].value.trim()
        };
        
        // Solo incluir contraseña si se proporcionó una nueva
        const nuevaContrasena = inputs[2].value.trim();
        if (nuevaContrasena) {
            datosActualizados.contrasena = nuevaContrasena;
        }
        
        // Validar campos obligatorios
        if (!datosActualizados.nombreUsuario || !datosActualizados.correo || !datosActualizados.rol || 
            !datosActualizados.calle || !datosActualizados.colonia || !datosActualizados.codigoPostal) {
            mostrarSnackbar('Por favor completa todos los campos', true);
            return;
        }
        
        try {
            await putEmpleado(nombreUsuarioOriginal, datosActualizados);
            cerrarModal();
            mostrarSnackbar('Empleado editado con éxito');
            document.removeEventListener('keydown', handleEscape);
        } catch (error) {
            console.error('Error al editar empleado:', error);
            mostrarSnackbar('Error al editar el empleado', true);
        }
    };
}

// Función para aplicar estilos del formulario (copiado de formsInventario.js)
function aplicarEstilosModalFormulario() {
    // Verificar si ya existen los estilos
    if (document.getElementById('modal-formulario-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'modal-formulario-styles';
    style.textContent = `
        .modal-overlay {
            display: none;
            position: fixed;
            z-index: 3000;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .modal-overlay.active {
            display: flex;
            opacity: 1;
        }
        .modal-container {
            background: #f8f8f2;
            border-radius: 18px;
            width: 95%;
            max-width: 600px;
            max-height: 95vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0,0,0,0.18);
            border: 2.5px solid #bfc0b0;
            margin: 0 auto;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 22px 28px 18px 28px;
            background: #e6e7c7;
            border-radius: 16px 16px 0 0;
            border-bottom: 2px solid #bfc0b0;
        }
        .modal-header h3 {
            margin: 0;
            font-size: 1.6rem;
            font-weight: 600;
            color: #222;
        }
        .modal-close {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            color: #222;
            padding: 0;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }
        .modal-close:hover {
            background: #e9ecef;
            color: #333;
        }
        .modal-form {
            padding: 28px 28px 18px 28px;
        }
        .form-group {
            margin-bottom: 18px;
        }
        .form-group label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #222;
            font-size: 15px;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #222;
            border-radius: 12px;
            font-size: 15px;
            transition: border-color 0.2s;
            box-sizing: border-box;
            background: #fff;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #8bbf8b;
            box-shadow: 0 0 0 2px #e6e7c7;
        }
        .form-group input[readonly] {
            background-color: #f8f9fa;
            color: #6c757d;
        }
        .modal-buttons {
            display: flex;
            gap: 24px;
            justify-content: flex-end;
            margin-top: 18px;
            padding-top: 12px;
            border-top: none;
        }
        .btn-cancel,
        .btn-accept {
            padding: 12px 32px;
            border: 2px solid #222;
            border-radius: 24px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
            min-width: 120px;
        }
        .btn-cancel {
            background: #fff;
            color: #222;
        }
        .btn-cancel:hover {
            background: #f2bcbc;
            color: #222;
        }
        .btn-accept {
            background: #d8f5d0;
            color: #222;
        }
        .btn-accept:hover {
            background: #b8e6b8;
            color: #222;
        }
        @media (max-width: 768px) {
            .modal-container {
                width: 99%;
                margin: 10px;
            }
            .modal-header {
                padding: 14px 16px 12px 16px;
            }
            .modal-header h3 {
                font-size: 1.2rem;
            }
            .modal-form {
                padding: 14px 14px 10px 14px;
            }
            .modal-buttons {
                flex-direction: column;
                gap: 10px;
            }
            .btn-cancel,
            .btn-accept {
                width: 100%;
                min-width: 0;
            }
        }
        @media (max-width: 480px) {
            .modal-container {
                width: 100%;
                height: 100%;
                border-radius: 0;
                max-height: 100vh;
            }
            .modal-header {
                border-radius: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Función para configurar eventos del modal (copiado de formsInventario.js)
function setupModalFormularioEvents(modal) {
    const closeBtn = modal.querySelector(".modal-close");
    const cancelBtns = modal.querySelectorAll(".btn-cancel");
    const form = modal.querySelector("form");
    
    // Cerrar con X
    if (closeBtn) {
        closeBtn.addEventListener("click", () => cerrarModal(modal));
    }
    
    // Cerrar con botón cancelar
    cancelBtns.forEach(btn => {
        btn.addEventListener("click", () => cerrarModal(modal));
    });
    
    // Cerrar haciendo click fuera
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            cerrarModal(modal);
        }
    });
    
    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            cerrarModal(modal);
        }
    });

    // Manejar envío del formulario
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const isEdit = form.id === 'form-edit-empleado';
            
            if (isEdit) {
                // Lógica para editar empleado
                const nombreUsuarioOriginal = form.querySelector('button[data-usuario]').getAttribute('data-usuario');
                
                const datosActualizados = {
                    nombreUsuario: formData.get("nombreUsuario"),
                    correo: formData.get("correo"),
                    rol: formData.get("rol"),
                    calle: formData.get("calle"),
                    colonia: formData.get("colonia"),
                    codigoPostal: formData.get("codigoPostal")
                };
                
                // Solo incluir contraseña si se proporcionó una nueva
                const nuevaContrasena = formData.get("contrasena");
                if (nuevaContrasena && nuevaContrasena.trim()) {
                    datosActualizados.contrasena = nuevaContrasena.trim();
                }
                
                try {
                    await putEmpleado(nombreUsuarioOriginal, datosActualizados);
                    cerrarModal(modal);
                    mostrarSnackbar('Empleado editado con éxito');
                    
                    // Limpiar selección
                    if (filaSeleccionada) {
                        filaSeleccionada.classList.remove('selected-row');
                        filaSeleccionada = null;
                    }
                } catch (error) {
                    console.error('Error al editar empleado:', error);
                    mostrarSnackbar('Error al editar el empleado', true);
                }
            } else {
                // Lógica para agregar empleado
                const empleadoData = {
                    nombreUsuario: formData.get("nombreUsuario"),
                    correo: formData.get("correo"),
                    contrasena: formData.get("contrasena"),
                    rol: formData.get("rol"),
                    calle: formData.get("calle"),
                    colonia: formData.get("colonia"),
                    codigoPostal: formData.get("codigoPostal")
                };
                
                // Validar campos obligatorios
                if (!empleadoData.nombreUsuario || !empleadoData.correo || !empleadoData.contrasena || 
                    !empleadoData.rol || !empleadoData.calle || !empleadoData.colonia || !empleadoData.codigoPostal) {
                    mostrarSnackbar('Por favor completa todos los campos', true);
                    return;
                }
                
                try {
                    await postEmpleado(empleadoData);
                    cerrarModal(modal);
                    mostrarSnackbar('Empleado agregado con éxito');
                } catch (error) {
                    console.error('Error al agregar empleado:', error);
                    mostrarSnackbar('Error al agregar el empleado', true);
                }
            }
        });
    }
}

// Función para cerrar modal
function cerrarModal(modal) {
    modal.classList.remove("active");
}
