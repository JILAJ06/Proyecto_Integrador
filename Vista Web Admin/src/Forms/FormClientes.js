// Array para almacenar los clientes
let clientes = [];
let filaSeleccionada = null;

// Datos de ejemplo para inicializar
const datosEjemplo = [
    {
        id: 1,
        nombre: "Juan Pérez",
        telefono: "961-123-4567",
        fechaRegistro: "2024-01-15"
    },
    {
        id: 2,
        nombre: "María González",
        telefono: "961-987-6543",
        fechaRegistro: "2024-01-20"
    }
];

// Función principal que se ejecuta cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function() {
    console.log('Inicializando módulo de clientes...');
    
    // Cargar datos iniciales
    cargarClientesIniciales();
    
    // Configurar eventos de botones
    setupEventListeners();
    
    // Cargar tabla de clientes
    cargarTablaClientes();
});

// Configurar eventos de los botones
function setupEventListeners() {
    const btnAdd = document.querySelector('.btn-add');
    const btnEdit = document.querySelector('.btn-edit');
    const btnDelete = document.querySelector('.btn-delete');
    
    if (btnAdd) {
        btnAdd.addEventListener('click', function() {
            console.log('Botón Agregar clickeado');
            crearModalCliente();
        });
    }
    
    if (btnEdit) {
        btnEdit.addEventListener('click', function() {
            console.log('Botón Editar clickeado');
            if (filaSeleccionada) {
                crearModalEditarCliente();
            } else {
                mostrarToast('Por favor, selecciona un cliente para editar', 'warning');
            }
        });
    }
    
    if (btnDelete) {
        btnDelete.addEventListener('click', function() {
            console.log('Botón Eliminar clickeado');
            if (filaSeleccionada) {
                crearModalEliminarCliente();
            } else {
                mostrarToast('Por favor, selecciona un cliente para eliminar', 'warning');
            }
        });
    }
    
    // Configurar selección de filas
    setupRowSelection();
}

// Seleccionar fila - CORREGIR ESTA FUNCIÓN
function seleccionarFila(fila) {
    // Asegurar que los estilos CSS para selección existan
    if (!document.getElementById('row-selection-styles')) {
        const style = document.createElement('style');
        style.id = 'row-selection-styles';
        style.textContent = `
            .clientes-table tbody tr.selected {
                background-color: #e6f3fe !important;
                border: 2.5px solid #2196f3 !important;
                box-shadow: none !important;
            }
            .clientes-table tbody tr {
                cursor: pointer !important;
                transition: all 0.2s ease !important;
            }
            .clientes-table tbody tr:hover {
                background-color: rgba(212, 197, 161, 0.2) !important;
                transform: translateY(-1px) !important;
            }
            .clientes-table tbody tr.selected:hover {
                background-color: #d2eafd !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remover selección anterior
    document.querySelectorAll('.clientes-table tbody tr').forEach(tr => {
        tr.classList.remove('selected');
    });
    
    // Seleccionar nueva fila
    fila.classList.add('selected');
    filaSeleccionada = fila;
    
    console.log('Fila seleccionada:', filaSeleccionada); // Para debug
    
    // Obtener datos del cliente seleccionado
    const celdas = fila.querySelectorAll('td');
    if (celdas.length >= 3) {
        const clienteData = {
            id: celdas[0].textContent,
            nombre: celdas[1].textContent,
            telefono: celdas[2].textContent
        };
        console.log('Cliente seleccionado:', clienteData); // Para debug
    }
}

// Configurar selección de filas - MEJORAR ESTA FUNCIÓN
function setupRowSelection() {
    const tabla = document.querySelector('.clientes-table tbody');
    if (tabla) {
        tabla.addEventListener('click', function(e) {
            const fila = e.target.closest('tr');
            if (fila && fila.children.length > 0) {
                const primeraCelda = fila.children[0];
                const contenidoCelda = primeraCelda.textContent.trim();
                
                // Solo seleccionar si la fila tiene contenido real (no está vacía)
                if (contenidoCelda && 
                    contenidoCelda !== '' && 
                    contenidoCelda !== '\u00A0' && 
                    contenidoCelda !== '&nbsp;' &&
                    !isNaN(parseInt(contenidoCelda))) { // Verificar que sea un ID válido
                    
                    seleccionarFila(fila);
                }
            }
        });
    } else {
        console.error('No se encontró la tabla de clientes para configurar selección');
    }
}

// Función para crear el modal de agregar cliente (ACTUALIZADA con diseño de formsInventario.js)
function crearModalCliente() {
    console.log('Creando modal de cliente...');
    
    // Verificar si ya existe un modal
    const modalExistente = document.getElementById('modal-add-cliente');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear el modal con el diseño de formsInventario.js
    const modal = document.createElement('div');
    modal.id = 'modal-add-cliente';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Agregar Nuevo Cliente</h3>
                <button class="modal-close">&times;</button>
            </div>
            <form id="form-add-cliente" class="modal-form">
                <div class="form-group">
                    <label>Nombre del cliente</label>
                    <input type="text" name="nombre" required placeholder="Juan Pérez">
                </div>
                
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="tel" name="telefono" required placeholder="961-123-4567">
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
    aplicarEstilosModalFormularioClientes();
    
    // Configurar eventos del modal
    setupModalFormularioEventsClientes(modal);
    
    // Mostrar modal
    modal.classList.add('active');
    
    // Auto-enfocar primer input
    setTimeout(() => {
        const primerInput = modal.querySelector('input[name="nombre"]');
        if (primerInput) primerInput.focus();
    }, 300);
}

// Función para crear el modal de editar cliente (ACTUALIZADA con diseño de formsInventario.js)
function crearModalEditarCliente() {
    if (!filaSeleccionada) {
        mostrarToast('Por favor, selecciona un cliente para editar', 'warning');
        return;
    }

    const celdas = filaSeleccionada.querySelectorAll('td');
    const clienteId = parseInt(celdas[0].textContent);
    const cliente = clientes.find(c => c.id === clienteId);

    if (!cliente) {
        mostrarToast('Cliente no encontrado', 'error');
        return;
    }

    // Verificar si ya existe un modal
    const modalExistente = document.getElementById('modal-edit-cliente');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear el modal con el diseño de formsInventario.js
    const modal = document.createElement('div');
    modal.id = 'modal-edit-cliente';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-container">
            <div class="modal-header">
                <h3>Modificar Cliente</h3>
                <button class="modal-close">&times;</button>
            </div>
            <form id="form-edit-cliente" class="modal-form">
                <div class="form-group">
                    <label>ID del cliente</label>
                    <input type="text" name="id" value="${cliente.id}" required readonly>
                </div>
                
                <div class="form-group">
                    <label>Nombre del cliente</label>
                    <input type="text" name="nombre" value="${cliente.nombre}" required>
                </div>
                
                <div class="form-group">
                    <label>Teléfono</label>
                    <input type="tel" name="telefono" value="${cliente.telefono}" required>
                </div>
                
                <div class="modal-buttons">
                    <button type="button" class="btn-cancel">Cancelar</button>
                    <button type="submit" class="btn-accept" data-id="${cliente.id}">Guardar Cambios</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Aplicar estilos del formulario de inventario
    aplicarEstilosModalFormularioClientes();
    
    // Configurar eventos del modal
    setupModalFormularioEventsClientes(modal);
    
    // Mostrar modal
    modal.classList.add('active');
    
    // Auto-enfocar primer input editable
    setTimeout(() => {
        const primerInput = modal.querySelector('input[name="nombre"]');
        if (primerInput) primerInput.focus();
    }, 300);
}

// Función para aplicar estilos del formulario (copiado de formsInventario.js)
function aplicarEstilosModalFormularioClientes() {
    // Verificar si ya existen los estilos
    if (document.getElementById('modal-formulario-clientes-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'modal-formulario-clientes-styles';
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
function setupModalFormularioEventsClientes(modal) {
    const closeBtn = modal.querySelector(".modal-close");
    const cancelBtns = modal.querySelectorAll(".btn-cancel");
    const form = modal.querySelector("form");
    
    // Cerrar con X
    if (closeBtn) {
        closeBtn.addEventListener("click", () => cerrarModalCliente(modal));
    }
    
    // Cerrar con botón cancelar
    cancelBtns.forEach(btn => {
        btn.addEventListener("click", () => cerrarModalCliente(modal));
    });
    
    // Cerrar haciendo click fuera
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            cerrarModalCliente(modal);
        }
    });
    
    // Cerrar con Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            cerrarModalCliente(modal);
        }
    });

    // Manejar envío del formulario
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const isEdit = form.id === 'form-edit-cliente';
            
            if (isEdit) {
                // Lógica para editar cliente
                const clienteId = parseInt(formData.get("id"));
                const nombre = formData.get("nombre").trim();
                const telefono = formData.get("telefono").trim();

                // Validar campos
                if (!nombre) {
                    mostrarToast('Por favor, ingresa el nombre del cliente', 'warning');
                    return;
                }

                if (!telefono) {
                    mostrarToast('Por favor, ingresa el teléfono del cliente', 'warning');
                    return;
                }

                // Validar formato de teléfono
                const telefonoRegex = /^[0-9\-\(\)\s\+]+$/;
                if (!telefonoRegex.test(telefono)) {
                    mostrarToast('Por favor, ingresa un teléfono válido', 'warning');
                    return;
                }

                // Actualizar cliente
                const datosActualizados = {
                    nombre: nombre,
                    telefono: telefono
                };

                const clienteActualizado = editarCliente(clienteId, datosActualizados);
                
                if (clienteActualizado) {
                    console.log('Cliente actualizado:', clienteActualizado);
                    
                    // Actualizar la tabla
                    cargarTablaClientes();
                    
                    // Mostrar mensaje de éxito
                    mostrarToast('Cliente actualizado exitosamente', 'success');
                    
                    // Limpiar selección
                    filaSeleccionada = null;
                    
                    // Cerrar modal
                    cerrarModalCliente(modal);
                } else {
                    mostrarToast('Error al actualizar el cliente', 'error');
                }
            } else {
                // Lógica para agregar cliente
                const nombre = formData.get("nombre").trim();
                const telefono = formData.get("telefono").trim();

                // Validar campos
                if (!nombre) {
                    mostrarToast('Por favor, ingresa el nombre del cliente', 'warning');
                    return;
                }

                if (!telefono) {
                    mostrarToast('Por favor, ingresa el teléfono del cliente', 'warning');
                    return;
                }

                // Validar formato de teléfono
                const telefonoRegex = /^[0-9\-\(\)\s\+]+$/;
                if (!telefonoRegex.test(telefono)) {
                    mostrarToast('Por favor, ingresa un teléfono válido', 'warning');
                    return;
                }

                // Crear objeto cliente
                const nuevoCliente = {
                    id: Date.now(), // ID único basado en timestamp
                    nombre: nombre,
                    telefono: telefono,
                    fechaRegistro: new Date().toLocaleDateString()
                };

                // Agregar cliente al array
                clientes.push(nuevoCliente);
                
                // Guardar en localStorage
                localStorage.setItem('clientes', JSON.stringify(clientes));

                console.log('Cliente agregado:', nuevoCliente);

                // Actualizar la tabla
                cargarTablaClientes();

                // Mostrar mensaje de éxito
                mostrarToast('Cliente agregado exitosamente', 'success');

                // Cerrar modal
                cerrarModalCliente(modal);
            }
        });
    }
}

// Función para cerrar modal
function cerrarModalCliente(modal) {
    modal.classList.remove("active");
}

// Función para crear el modal de eliminar cliente
function crearModalEliminarCliente() {
    if (!filaSeleccionada) {
        mostrarToast('Por favor, selecciona un cliente para eliminar', 'warning');
        return;
    }

    const celdas = filaSeleccionada.querySelectorAll('td');
    const clienteId = parseInt(celdas[0].textContent);
    const cliente = clientes.find(c => c.id === clienteId);

    if (!cliente) {
        mostrarToast('Cliente no encontrado', 'error');
        return;
    }

    // Verificar si ya existe un modal
    const modalExistente = document.getElementById('modal-advertencia');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear el modal usando el mismo diseño que modalAdvertencia.js
    const modal = document.createElement('div');
    modal.id = 'modal-advertencia';
    modal.innerHTML = `
        <div class="modal-advertencia-overlay"></div>
        <div class="modal-advertencia-content">
            <div class="modal-advertencia-icon">&#9888;</div>
            <div class="modal-advertencia-title">Advertencia</div>
            <div class="modal-advertencia-text">Está a punto de eliminar al cliente<br>"${cliente.nombre}" de esta sección,<br>¿está seguro de querer realizar esta acción?</div>
            <div class="modal-advertencia-actions">
                <button class="modal-advertencia-btn-aceptar" data-id="${cliente.id}">Aceptar</button>
                <button class="modal-advertencia-btn-cancelar">Cancelar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Aplicar estilos del modal de advertencia
    aplicarEstilosModalAdvertencia();
    
    // Configurar eventos del modal de eliminar
    setupModalAdvertenciaEvents(modal);
    
    // Mostrar modal con animación
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('mostrar'), 10);
}

// Función para aplicar estilos específicos del modal de advertencia
function aplicarEstilosModalAdvertencia() {
    // Verificar si ya existen los estilos
    if (document.getElementById('modal-advertencia-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'modal-advertencia-styles';
    style.textContent = `
        #modal-advertencia {
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

        #modal-advertencia .modal-advertencia-overlay {
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100vw; 
            height: 100vh;
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
            line-height: 1.4;
        }

        #modal-advertencia .modal-advertencia-actions {
            display: flex;
            justify-content: center;
            gap: 48px;
            width: 100%;
        }

        #modal-advertencia .modal-advertencia-btn-aceptar, 
        #modal-advertencia .modal-advertencia-btn-cancelar {
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

        /* Responsive para pantallas pequeñas */
        @media (max-width: 480px) {
            #modal-advertencia .modal-advertencia-content {
                min-width: 320px;
                padding: 30px 25px 25px 25px;
                margin: 20px;
            }
            
            #modal-advertencia .modal-advertencia-icon {
                font-size: 2.8rem;
            }
            
            #modal-advertencia .modal-advertencia-title {
                font-size: 1.6rem;
            }
            
            #modal-advertencia .modal-advertencia-text {
                font-size: 1rem;
            }
            
            #modal-advertencia .modal-advertencia-actions {
                gap: 20px;
            }
            
            #modal-advertencia .modal-advertencia-btn-aceptar, 
            #modal-advertencia .modal-advertencia-btn-cancelar {
                font-size: 1.1rem;
                padding: 12px 0;
            }
        }
    `;

    document.head.appendChild(style);
}

// Función para configurar eventos del modal de advertencia
function setupModalAdvertenciaEvents(modal) {
    const btnAceptar = modal.querySelector('.modal-advertencia-btn-aceptar');
    const btnCancelar = modal.querySelector('.modal-advertencia-btn-cancelar');
    const overlay = modal.querySelector('.modal-advertencia-overlay');
    const clienteId = parseInt(btnAceptar.getAttribute('data-id'));

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
    btnAceptar.onclick = function() {
        const cliente = clientes.find(c => c.id === clienteId);
        const nombreCliente = cliente ? cliente.nombre : 'Cliente';
        
        if (eliminarCliente(clienteId)) {
            mostrarToast(`Cliente "${nombreCliente}" eliminado exitosamente`, 'success');
            filaSeleccionada = null; // Limpiar selección
            cerrarModal();
        } else {
            mostrarToast('Error al eliminar el cliente', 'error');
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

// Función para aplicar estilos al modal - ACTUALIZAR PARA QUITAR ESTILOS DUPLICADOS
function aplicarEstilosModal() {
    // Verificar si ya existen los estilos
    if (document.getElementById('cliente-modal-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'cliente-modal-styles';
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .cliente-modal {
        background: #D4C5A1 !important;
        border: 4px solid #8B7355 !important;
        border-radius: 20px !important;
        width: 400px !important;
        height: auto !important;
        min-height: 300px !important;
        text-align: center !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        padding: 40px !important;
        box-sizing: border-box !important;
        transform: scale(0.7);
        transition: all 0.3s ease;
      }

      .modal-overlay.active .cliente-modal {
        transform: scale(1);
      }

      .cliente-modal .modal-content {
        padding: 0 !important;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 25px;
      }

      .cliente-modal .form-group {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 0;
      }

      .cliente-modal .form-group label {
        font-size: 18px;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
        font-family: Arial, sans-serif;
        text-align: center;
      }

      .cliente-modal .form-input {
        width: 300px;
        padding: 12px 15px;
        border: none;
        border-radius: 10px;
        background: white;
        font-size: 14px;
        color: #333;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        font-family: Arial, sans-serif;
        border-bottom: 3px solid #8B7355;
        outline: none;
        transition: all 0.2s ease;
      }

      .cliente-modal .form-input:focus {
        border-bottom: 3px solid #6B5635;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
      }

      .cliente-modal .form-input::placeholder {
        color: #888;
        font-style: italic;
      }

      .cliente-modal .modal-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin-top: 10px;
      }

      .btn-accept-cliente,
      .btn-cancel-cliente {
        background: white;
        color: #333;
        border: none;
        border-radius: 25px;
        padding: 12px 30px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 100px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        font-family: Arial, sans-serif;
      }

      .btn-accept-cliente:hover,
      .btn-cancel-cliente:hover {
        background: #f0f0f0;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      }

      .btn-accept-cliente:active,
      .btn-cancel-cliente:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      /* Estilos para la tabla */
      .clientes-table tbody tr {
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .clientes-table tbody tr:hover {
        background-color: rgba(212, 197, 161, 0.1);
      }

      .clientes-table tbody tr.selected {
        background-color: rgba(212, 197, 161, 0.3);
        border-left: 4px solid #8B7355;
      }

      /* Responsive para pantallas pequeñas */
      @media (max-width: 450px) {
        .cliente-modal {
          width: 90vw !important;
          padding: 30px !important;
        }
        
        .cliente-modal .form-input {
          width: 100%;
          max-width: 280px;
        }
        
        .btn-accept-cliente,
        .btn-cancel-cliente {
          padding: 10px 20px;
          font-size: 14px;
          min-width: 80px;
        }
      }
    `;

    document.head.appendChild(style);
}

// Función para cargar datos iniciales
function cargarClientesIniciales() {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
        clientes = JSON.parse(clientesGuardados);
    } else {
        // Cargar datos de ejemplo si no hay datos guardados
        clientes = [...datosEjemplo];
        localStorage.setItem('clientes', JSON.stringify(clientes));
    }
    console.log('Clientes cargados:', clientes);
}

// Función para cargar la tabla de clientes
function cargarTablaClientes() {
    const tbody = document.querySelector('.clientes-table tbody');
    if (!tbody) {
        console.error('No se encontró la tabla de clientes');
        return;
    }

    tbody.innerHTML = '';

    clientes.forEach(cliente => {
        const fila = crearFilaCliente(cliente);
        tbody.appendChild(fila);
    });

    // Agregar filas vacías si es necesario (máximo 8 filas visibles)
    const filasVacias = Math.max(0, 8 - clientes.length);
    for (let i = 0; i < filasVacias; i++) {
        const filaVacia = document.createElement('tr');
        filaVacia.innerHTML = `
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
        `;
        tbody.appendChild(filaVacia);
    }
}

// Función para crear una fila de cliente
function crearFilaCliente(cliente) {
    const fila = document.createElement('tr');
    
    const campos = [
        cliente.id,
        cliente.nombre,
        cliente.telefono
    ];

    campos.forEach(campo => {
        const celda = document.createElement('td');
        celda.textContent = campo;
        fila.appendChild(celda);
    });

    return fila;
}

// Función para cargar clientes desde localStorage
function cargarClientes() {
    cargarClientesIniciales();
    cargarTablaClientes();
}

// Función para obtener todos los clientes
function obtenerClientes() {
    return clientes;
}

// Función para buscar cliente por ID
function buscarClientePorId(id) {
    return clientes.find(cliente => cliente.id === id);
}

// Función para eliminar cliente
function eliminarCliente(id) {
    const index = clientes.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
        clientes.splice(index, 1);
        localStorage.setItem('clientes', JSON.stringify(clientes));
        cargarTablaClientes(); // Actualizar tabla
        return true;
    }
    return false;
}

// Función para editar cliente
function editarCliente(id, datosActualizados) {
    const index = clientes.findIndex(cliente => cliente.id === id);
    if (index !== -1) {
        clientes[index] = { ...clientes[index], ...datosActualizados };
        localStorage.setItem('clientes', JSON.stringify(clientes));
        return clientes[index];
    }
    return null;
}

// Cargar clientes al inicializar
// (Eliminado porque ya se maneja en DOMContentLoaded)

// Sistema de notificaciones Toast
function mostrarToast(mensaje, tipo = 'info') {
    // Crear contenedor de toast si no existe
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
        `;
        document.body.appendChild(toastContainer);
    }

    // Crear el toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    // Iconos según el tipo
    const iconos = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    // Colores según el tipo
    const colores = {
        success: { bg: '#d4edda', border: '#c3e6cb', color: '#155724', icon: '#28a745' },
        error: { bg: '#f8d7da', border: '#f5c6cb', color: '#721c24', icon: '#dc3545' },
        warning: { bg: '#fff3cd', border: '#ffeaa7', color: '#856404', icon: '#ffc107' },
        info: { bg: '#d1ecf1', border: '#bee5eb', color: '#0c5460', icon: '#17a2b8' }
    };

    const colorConfig = colores[tipo];

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="${iconos[tipo]}" style="color: ${colorConfig.icon}; font-size: 18px;"></i>
            <span style="flex: 1; font-size: 14px; font-weight: 500;">${mensaje}</span>
            <button class="toast-close" style="background: none; border: none; color: ${colorConfig.color}; cursor: pointer; font-size: 16px; opacity: 0.7;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    toast.style.cssText = `
        background: ${colorConfig.bg};
        border: 1px solid ${colorConfig.border};
        border-left: 4px solid ${colorConfig.icon};
        color: ${colorConfig.color};
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        font-family: Arial, sans-serif;
        min-width: 300px;
        word-wrap: break-word;
    `;

    // Agregar toast al contenedor
    toastContainer.appendChild(toast);

    // Configurar botón de cerrar
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        cerrarToast(toast);
    });

    // Mostrar toast con animación
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);

    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            cerrarToast(toast);
        }
    }, 4000);

    return toast;
}

// Función para cerrar toast
function cerrarToast(toast) {
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Exportar funciones para uso en otros archivos
window.crearModalCliente = crearModalCliente;
window.crearModalEditarCliente = crearModalEditarCliente;
window.crearModalEliminarCliente = crearModalEliminarCliente;
window.obtenerClientes = obtenerClientes;
window.buscarClientePorId = buscarClientePorId;
window.eliminarCliente = eliminarCliente;
window.editarCliente = editarCliente;
window.cargarClientes = cargarClientes;
window.cargarTablaClientes = cargarTablaClientes;
window.mostrarToast = mostrarToast;