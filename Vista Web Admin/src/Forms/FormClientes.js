import { getClientes, createCliente, updateCliente, deleteCliente, getClienteById } from '../Servicios/clientesServices.js';

// Array para almacenar los clientes
let clientes = [];
let filaSeleccionada = null;

// Función principal que se ejecuta cuando el DOM está listo
document.addEventListener("DOMContentLoaded", function() {
    console.log('Inicializando módulo de clientes...');
    
    // Configurar eventos de botones
    setupEventListeners();
    
    // Cargar tabla de clientes desde la API
    cargarTablaClientesDesdeAPI();
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

// Cargar tabla de clientes desde la API
async function cargarTablaClientesDesdeAPI() {
    try {
        mostrarToast('Cargando clientes...', 'info');
        const clientesAPI = await getClientes();
        clientes = clientesAPI;
        
        // Esperar un poco para asegurar que la tabla esté actualizada
        setTimeout(() => {
            setupRowSelection(); // Reconfigurar selección después de cargar
        }, 300); // Aumenté el tiempo de espera
        
    } catch (error) {
        console.error('✗ Error al cargar clientes:', error);
        mostrarToast('Error al cargar clientes desde el servidor', 'error');
    }
}

// Configurar selección de filas - MEJORADO
function setupRowSelection() {
    
    const tabla = document.querySelector('.clientes-table tbody');
    if (!tabla) {
        console.error('No se encontró la tabla de clientes para configurar selección');
        return;
    }

    const filas = tabla.querySelectorAll('tr');

    // Verificar que hay filas válidas
    const filasValidas = Array.from(filas).filter(fila => {
        const primeraCelda = fila.children[0];
        const contenido = primeraCelda ? primeraCelda.textContent.trim() : '';
        return contenido && contenido !== 'No hay clientes registrados' && !isNaN(parseInt(contenido));
    });


    if (filasValidas.length === 0) {
        console.warn('No hay filas válidas para configurar selección');
        return;
    }

    // Remover listeners anteriores clonando la tabla
    const nuevaTabla = tabla.cloneNode(true);
    tabla.parentNode.replaceChild(nuevaTabla, tabla);

    // Configurar cada fila individualmente
    const nuevasFilas = nuevaTabla.querySelectorAll('tr');

    nuevasFilas.forEach((fila, index) => {
        const primeraCelda = fila.children[0];
        if (!primeraCelda) return;

        const contenidoCelda = primeraCelda.textContent.trim();
        
        // Solo configurar filas válidas
        if (contenidoCelda && 
            contenidoCelda !== 'No hay clientes registrados' && 
            !isNaN(parseInt(contenidoCelda))) {
            
            
            // Asegurar que los datos estén en la fila
            const clienteId = parseInt(contenidoCelda);
            if (!fila.clienteId) {
                fila.clienteId = clienteId;
                fila.setAttribute('data-cliente-id', clienteId.toString());
            }
            if (!fila.clienteNombre && fila.children[1]) {
                fila.clienteNombre = fila.children[1].textContent.trim();
                fila.setAttribute('data-cliente-nombre', fila.clienteNombre);
            }
            if (!fila.clienteTelefono && fila.children[2]) {
                fila.clienteTelefono = fila.children[2].textContent.trim();
                fila.setAttribute('data-cliente-telefono', fila.clienteTelefono);
            }

            // Agregar evento de click
            fila.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleRowClick(this);
            });

            // Agregar estilos de hover
            fila.style.cursor = 'pointer';
            fila.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected')) {
                    this.style.backgroundColor = 'rgba(212, 197, 161, 0.2)';
                }
            });
            fila.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.backgroundColor = '';
                }
            });
        }
    });
    
}

function handleRowClick(fila) {
    
    // Verificar que la fila tenga contenido válido
    const primeraCelda = fila.children[0];
    if (!primeraCelda) {
        console.log('ERROR: No se encontró primera celda');
        return;
    }

    const contenidoCelda = primeraCelda.textContent.trim();
    
    // Verificar que sea una fila válida con datos de cliente
    if (contenidoCelda && 
        contenidoCelda !== '' && 
        contenidoCelda !== 'No hay clientes registrados' &&
        !isNaN(parseInt(contenidoCelda))) {
        
        console.log('✓ Fila válida, seleccionando...');
        seleccionarFila(fila);
    } else {
        console.log('✗ Fila no válida para selección:', contenidoCelda);
    }
}

// Seleccionar fila - CORREGIDO para manejar IDs como enteros
function seleccionarFila(fila) {

    // Asegurar que los estilos CSS para selección existan
    if (!document.getElementById('row-selection-styles')) {
        const style = document.createElement('style');
        style.id = 'row-selection-styles';
        style.textContent = `
            .clientes-table tbody tr.selected {
                background-color: #e6f3fe !important;
                border: 2.5px solid #2196f3 !important;
                box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3) !important;
            }
            .clientes-table tbody tr {
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                border: 2px solid transparent;
            }
            .clientes-table tbody tr:hover {
                background-color: rgba(212, 197, 161, 0.2) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
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
    
    
    // Obtener datos del cliente seleccionado - MÉTODO MEJORADO
    let clienteId = null;
    let clienteNombre = '';
    let clienteTelefono = '';
    
    // Método 1: Usar propiedades directas del elemento
    if (fila.clienteId) {
        clienteId = fila.clienteId;
        clienteNombre = fila.clienteNombre || '';
        clienteTelefono = fila.clienteTelefono || '';
    }
    // Método 2: Usar data attributes
    else if (fila.getAttribute('data-cliente-id')) {
        clienteId = parseInt(fila.getAttribute('data-cliente-id'));
        clienteNombre = fila.getAttribute('data-cliente-nombre') || '';
        clienteTelefono = fila.getAttribute('data-cliente-telefono') || '';
        console.log('✓ Datos obtenidos de data attributes');
    }
    // Método 3: Leer directamente de las celdas
    else {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 3) {
            clienteId = parseInt(celdas[0].textContent.trim());
            clienteNombre = celdas[1].textContent.trim();
            clienteTelefono = celdas[2].textContent.trim();
            
            // Guardar en propiedades para uso futuro
            fila.clienteId = clienteId;
            fila.clienteNombre = clienteNombre;
            fila.clienteTelefono = clienteTelefono;
            fila.setAttribute('data-cliente-id', clienteId.toString());
            fila.setAttribute('data-cliente-nombre', clienteNombre);
            fila.setAttribute('data-cliente-telefono', clienteTelefono);
        }
    }
    
    // Validar que el ID sea un entero válido
    if (isNaN(clienteId) || clienteId <= 0) {
        console.error('✗ ID de cliente inválido:', clienteId);
        mostrarToast('Error: ID de cliente inválido', 'error');
        return;
    }
    
    const clienteData = {
        id: clienteId,  // Ya es un entero
        nombre: clienteNombre,
        telefono: clienteTelefono
    };
    
    console.log('✓ Cliente seleccionado (datos finales):', clienteData);
    console.log('✓ Tipo de ID:', typeof clienteData.id, 'Valor:', clienteData.id);
    
    // Guardar datos del cliente seleccionado globalmente
    window.clienteSeleccionado = clienteData;
    
    console.log('=== SELECCIÓN COMPLETADA ===');
}

// Función para crear el modal de agregar cliente
function crearModalCliente() {
    console.log('Creando modal de cliente...');
    console.log('[CREAR] Modal de cliente abierto');
    console.trace();
    
    // Verificar si ya existe un modal
    const modalExistente = document.getElementById('modal-add-cliente');
    if (modalExistente) {
        modalExistente.remove();
    }

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
    aplicarEstilosModalFormularioClientes();
    setupModalFormularioEventsClientes(modal);
    modal.classList.add('active');
    
    setTimeout(() => {
        const primerInput = modal.querySelector('input[name="nombre"]');
        if (primerInput) primerInput.focus();
    }, 300);
}

// Función para crear el modal de editar cliente - CORREGIDO
async function crearModalEditarCliente() {
    console.log('Creando modal de editar cliente...');
    console.log('Fila seleccionada:', filaSeleccionada);
    console.log('[EDITAR] Modal de edición de cliente abierto');
    console.trace();
    
    if (!filaSeleccionada) {
        mostrarToast('Por favor, selecciona un cliente para editar', 'warning');
        return;
    }

    // Obtener ID del cliente usando el método mejorado
    let clienteId = null;
    
    // Método 1: Propiedad directa
    if (filaSeleccionada.clienteId) {
        clienteId = filaSeleccionada.clienteId;
    }
    // Método 2: Data attribute
    else if (filaSeleccionada.getAttribute('data-cliente-id')) {
        clienteId = parseInt(filaSeleccionada.getAttribute('data-cliente-id'));
    }
    // Método 3: Primera celda
    else {
        const celdas = filaSeleccionada.querySelectorAll('td');
        if (celdas.length > 0) {
            clienteId = parseInt(celdas[0].textContent.trim());
        }
    }
    
    console.log('ID obtenido para editar:', clienteId, 'Tipo:', typeof clienteId);
    
    if (!clienteId || isNaN(clienteId) || clienteId <= 0) {
        console.error('ID de cliente inválido para editar:', clienteId);
        mostrarToast('Error: No se pudo obtener un ID válido del cliente', 'error');
        return;
    }
    
    try {
        // Obtener cliente desde la API
        const cliente = await getClienteById(clienteId);
        
        if (!cliente) {
            mostrarToast('Cliente no encontrado', 'error');
            return;
        }

        console.log('Cliente obtenido de la API para editar:', cliente);

        // Verificar si ya existe un modal
        const modalExistente = document.getElementById('modal-edit-cliente');
        if (modalExistente) {
            modalExistente.remove();
        }
        
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
                    <input type="hidden" name="id" value="${cliente.id}">
                    
                    <div class="form-group">
                        <label>ID del cliente</label>
                        <input type="number" value="${cliente.id}" readonly>
                    </div>
                    
                    <div class="form-group">
                        <label>Nombre del cliente</label>
                        <input type="text" name="nombre" value="${cliente.nombre || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" name="telefono" value="${cliente.telefono || ''}" required>
                    </div>
                    
                    <div class="modal-buttons">
                        <button type="button" class="btn-cancel">Cancelar</button>
                        <button type="submit" class="btn-accept">Guardar Cambios</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        aplicarEstilosModalFormularioClientes();
        setupModalFormularioEventsClientes(modal);
        modal.classList.add('active');
        
        setTimeout(() => {
            const primerInput = modal.querySelector('input[name="nombre"]');
            if (primerInput) primerInput.focus();
        }, 300);
        
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        mostrarToast('Error al cargar datos del cliente', 'error');
    }
}

// Función para crear el modal de eliminar cliente - CORREGIDO
async function crearModalEliminarCliente() {
    console.log('Creando modal de eliminar cliente...');
    console.log('Fila seleccionada:', filaSeleccionada);
    
    if (!filaSeleccionada) {
        mostrarToast('Por favor, selecciona un cliente para eliminar', 'warning');
        return;
    }

    // Obtener ID del cliente usando el método mejorado
    let clienteId = null;
    
    // Método 1: Propiedad directa
    if (filaSeleccionada.clienteId) {
        clienteId = filaSeleccionada.clienteId;
    }
    // Método 2: Data attribute
    else if (filaSeleccionada.getAttribute('data-cliente-id')) {
        clienteId = parseInt(filaSeleccionada.getAttribute('data-cliente-id'));
    }
    // Método 3: Primera celda
    else {
        const celdas = filaSeleccionada.querySelectorAll('td');
        if (celdas.length > 0) {
            clienteId = parseInt(celdas[0].textContent.trim());
        }
    }
    
    console.log('ID obtenido para eliminar:', clienteId, 'Tipo:', typeof clienteId);
    
    if (!clienteId || isNaN(clienteId) || clienteId <= 0) {
        console.error('ID de cliente inválido para eliminar:', clienteId);
        mostrarToast('Error: No se pudo obtener un ID válido del cliente', 'error');
        return;
    }
    
    try {
        const cliente = await getClienteById(clienteId);

        if (!cliente) {
            mostrarToast('Cliente no encontrado', 'error');
            return;
        }

        console.log('Cliente obtenido de la API para eliminar:', cliente);

        // Verificar si ya existe un modal
        const modalExistente = document.getElementById('modal-advertencia');
        if (modalExistente) {
            modalExistente.remove();
        }

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
        aplicarEstilosModalAdvertencia();
        setupModalAdvertenciaEvents(modal);
        
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('mostrar'), 10);
        
    } catch (error) {
        console.error('Error al obtener cliente:', error);
        mostrarToast('Error al cargar datos del cliente', 'error');
    }
}

// Configurar eventos del modal
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
    
    // Función para manejar la tecla Escape
    const handleEscape = (e) => {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            cerrarModalCliente(modal);
            document.removeEventListener("keydown", handleEscape);
        }
    };
    
    // Cerrar con Escape
    document.addEventListener("keydown", handleEscape);

    // Manejar envío del formulario
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("🧪 Evento submit capturado para:", form.id);

            
            const formData = new FormData(form);
            const isEdit = modal.id === 'modal-edit-cliente';
            
            if (isEdit) {
                // Lógica para editar cliente usando API
                const clienteId = parseInt(formData.get("id")); // Usar el campo hidden
                const nombre = formData.get("nombre").trim();
                const telefono = formData.get("telefono").trim();

                console.log('=== INICIANDO EDICIÓN DE CLIENTE DESDE FORMULARIO ===');
                console.log('Datos del formulario de edición:');
                console.log('- ID (hidden field):', formData.get("id"), 'Tipo:', typeof formData.get("id"));
                console.log('- ID parseado:', clienteId, 'Tipo:', typeof clienteId);
                console.log('- Nombre:', nombre);
                console.log('- Teléfono:', telefono);
                console.log('- filaSeleccionada:', filaSeleccionada);
                console.log('- filaSeleccionada.clienteId:', filaSeleccionada?.clienteId);

                // Validar que el ID sea un entero válido
                if (isNaN(clienteId) || clienteId <= 0) {
                    mostrarToast('Error: ID del cliente no válido', 'error');
                    console.error('ID inválido:', clienteId);
                    return;
                }
                
                // DOBLE VERIFICACIÓN: Comparar con el ID de la fila seleccionada
                const idFilaSeleccionada = filaSeleccionada?.clienteId || parseInt(filaSeleccionada?.getAttribute('data-cliente-id'));
                if (idFilaSeleccionada && idFilaSeleccionada !== clienteId) {
                    console.error('¡INCONSISTENCIA! ID del formulario no coincide con fila seleccionada');
                    console.error('ID formulario:', clienteId, 'ID fila:', idFilaSeleccionada);
                    mostrarToast('Error: Inconsistencia en el ID del cliente', 'error');
                    return;
                }

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

                try {
                    // Mostrar toast de carga
                    const toastCarga = mostrarToast('Actualizando cliente...', 'info');
                    
                    // CAMBIO: Verificar que estamos editando, no creando
                    console.log('=== CONFIRMANDO OPERACIÓN DE EDICIÓN ===');
                    console.log('Método HTTP: PUT');
                    console.log('Endpoint: /cliente/' + clienteId);
                    console.log('Es edición (no creación): true');
                    
                    // Actualizar cliente usando API
                    const datosActualizados = {
                        nombre: nombre,
                        telefono: telefono
                    };

                    console.log('=== ENVIANDO DATOS DE ACTUALIZACIÓN ===');
                    console.log('ID a actualizar:', clienteId);
                    console.log('Datos a enviar:', datosActualizados);
                    
                    const clienteActualizado = await updateCliente(clienteId, datosActualizados);
                    
                    console.log('=== RESPUESTA DEL SERVIDOR ===');
                    console.log('Cliente actualizado recibido:', clienteActualizado);
                    console.log('ID original vs ID actualizado:', clienteId, 'vs', clienteActualizado.id);
                    
                    // VERIFICACIÓN CRÍTICA: El ID debe mantenerse igual
                    if (clienteActualizado.id !== clienteId) {
                        console.error('¡PROBLEMA CRÍTICO! El servidor cambió el ID del cliente');
                        console.error('Esto indica que se creó un nuevo cliente en lugar de actualizar');
                        console.error('ID enviado:', clienteId, 'ID recibido:', clienteActualizado.id);
                        
                        // Mostrar advertencia al usuario
                        mostrarToast('Advertencia: El servidor creó un nuevo cliente en lugar de actualizar', 'warning');
                        
                        // Recargar la tabla para mostrar el estado real
                        setTimeout(async () => {
                            try {
                                await cargarTablaClientesDesdeAPI();
                            } catch (error) {
                                console.error('Error al recargar tabla:', error);
                            }
                        }, 1000);
                    } else {
                        console.log('✓ ID mantenido correctamente, actualización exitosa');
                    }
                    
                    // Verificar que el ID del cliente actualizado coincide
                    if (clienteActualizado.id !== clienteId) {
                        console.warn('⚠️ ADVERTENCIA: El ID del cliente actualizado no coincide!');
                        console.warn('ID original:', clienteId);
                        console.warn('ID devuelto:', clienteActualizado.id);
                    }
                    
                    // Cerrar toast de carga si existe
                    if (toastCarga && toastCarga.parentNode) {
                        cerrarToast(toastCarga);
                    }
                    
                    // Mostrar mensaje de éxito
                    mostrarToast('Cliente actualizado exitosamente', 'success');
                    
                    // Limpiar selección
                    filaSeleccionada = null;
                    
                    // Remover listener de escape
                    document.removeEventListener("keydown", handleEscape);
                    
                    // Cerrar modal
                    cerrarModalCliente(modal);
                    
                    console.log('=== EDICIÓN DE CLIENTE COMPLETADA ===');
                    
                } catch (error) {
                    console.error('Error al actualizar cliente:', error);
                    
                    // Cerrar toast de carga si existe
                    if (toastCarga && toastCarga.parentNode) {
                        cerrarToast(toastCarga);
                    }
                    
                    // Determinar el tipo de error
                    let mensajeError = 'Error al actualizar el cliente';
                    
                    if (error.message.includes('CONSTRAINT_ERROR')) {
                        mensajeError = 'Error: No se puede actualizar debido a registros relacionados';
                    } else if (error.message.includes('NOT_FOUND')) {
                        mensajeError = 'Cliente no encontrado';
                    } else if (error.message.includes('BAD_REQUEST')) {
                        mensajeError = 'Datos del cliente inválidos';
                    } else if (error.message.includes('SERVER_ERROR')) {
                        mensajeError = 'Error del servidor. Inténtalo más tarde';
                    } else if (error.message.includes('fetch') || error.message.includes('network')) {
                        mensajeError = 'Error de conexión. Verifica tu red';
                    }
                    
                    mostrarToast(mensajeError, 'error');
                }
            } else {
                // Lógica para agregar cliente usando API
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

                try {
                    console.log('=== INICIANDO CREACIÓN DE CLIENTE ===');
                    
                    // Mostrar toast de carga
                    const toastCarga = mostrarToast('Creando cliente...', 'info');
                    
                    // Crear cliente usando API
                    const nuevoCliente = {
                        nombre: nombre,
                        telefono: telefono
                    };

                    console.log('Datos del nuevo cliente:', nuevoCliente);
                    
                    const clienteCreado = await createCliente(nuevoCliente);
                    
                    console.log('✓ Cliente creado exitosamente:', clienteCreado);
                    
                    // Cerrar toast de carga si existe
                    if (toastCarga && toastCarga.parentNode) {
                        cerrarToast(toastCarga);
                    }
                    
                    // Mostrar mensaje de éxito
                    mostrarToast('Cliente agregado exitosamente', 'success');

                    // Remover listener de escape
                    document.removeEventListener("keydown", handleEscape);

                    // Cerrar modal
                    cerrarModalCliente(modal);
                    
                    console.log('=== CREACIÓN DE CLIENTE COMPLETADA ===');
                    
                } catch (error) {
                    console.error('Error al crear cliente:', error);
                    
                    // Determinar el tipo de error
                    let mensajeError = 'Error al agregar el cliente';
                    
                    if (error.message.includes('400')) {
                        mensajeError = 'Datos del cliente inválidos';
                    } else if (error.message.includes('409')) {
                        mensajeError = 'El cliente ya existe';
                    } else if (error.message.includes('500')) {
                        mensajeError = 'Error del servidor. Inténtalo más tarde';
                    } else if (error.message.includes('fetch') || error.message.includes('network')) {
                        mensajeError = 'Error de conexión. Verifica tu red';
                        
                        // En caso de error de red, intentar recargar la tabla por si el cliente se creó
                        console.warn('Error de red - verificando si el cliente se creó...');
                        setTimeout(async () => {
                            try {
                                await cargarTablaClientesDesdeAPI();
                                mostrarToast('Se ha verificado la lista de clientes', 'info');
                            } catch (reloadError) {
                                console.warn('No se pudo verificar:', reloadError);
                            }
                        }, 2000);
                    }
                    
                    mostrarToast(mensajeError, 'error');
                }
            }
        });
    }
}

// Configurar eventos del modal de advertencia
function setupModalAdvertenciaEvents(modal) {
    const btnAceptar = modal.querySelector('.modal-advertencia-btn-aceptar');
    const btnCancelar = modal.querySelector('.modal-advertencia-btn-cancelar');
    const overlay = modal.querySelector('.modal-advertencia-overlay');
    const clienteId = parseInt(btnAceptar.getAttribute('data-id'));

    function cerrarModal() {
        modal.classList.remove('mostrar');
        setTimeout(() => { 
            if (modal.parentNode) {
                modal.remove(); 
            }
        }, 280);
    }

    function handleEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    }

    document.addEventListener('keydown', handleEscape);

    btnAceptar.onclick = async function() {
        try {
            console.log('=== INICIANDO ELIMINACIÓN DE CLIENTE ===');
            console.log('ID del cliente a eliminar:', clienteId);
            
            // Mostrar toast de carga
            const toastCarga = mostrarToast('Eliminando cliente...', 'info');
            
            const resultado = await deleteCliente(clienteId);
            
            console.log('✓ Cliente eliminado exitosamente:', resultado);
            
            // Cerrar toast de carga si existe
            if (toastCarga && toastCarga.parentNode) {
                cerrarToast(toastCarga);
            }
            
            mostrarToast('Cliente eliminado exitosamente', 'success');
            filaSeleccionada = null;
            cerrarModal();
            
            console.log('=== ELIMINACIÓN DE CLIENTE COMPLETADA ===');
            
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            
            // Determinar el tipo de error
            let mensajeError = 'Error al eliminar el cliente';
            
            if (error.message.includes('404')) {
                mensajeError = 'Cliente no encontrado';
            } else if (error.message.includes('409')) {
                mensajeError = 'No se puede eliminar: el cliente tiene registros asociados';
            } else if (error.message.includes('500')) {
                mensajeError = 'Error del servidor. Inténtalo más tarde';
            } else if (error.message.includes('fetch') || error.message.includes('network')) {
                mensajeError = 'Error de conexión. Verifica tu red';
            }
            
            mostrarToast(mensajeError, 'error');
        }
        
        document.removeEventListener('keydown', handleEscape);
    };

    btnCancelar.onclick = function() {
        cerrarModal();
        document.removeEventListener('keydown', handleEscape);
    };

    overlay.onclick = function() {
        cerrarModal();
        document.removeEventListener('keydown', handleEscape);
    };
}

// Función para cerrar modal - CORREGIDA
function cerrarModalCliente(modal) {
    modal.classList.remove("active");
    // Agregar tiempo para la transición y luego ocultar/remover el modal
    setTimeout(() => {
        modal.style.display = 'none';
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 300); // Tiempo que coincide con la transición CSS
}

// Función para aplicar estilos del formulario - ACTUALIZADA
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
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        .modal-overlay.active .modal-container {
            transform: scale(1);
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

function aplicarEstilosModalAdvertencia() {
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

// Sistema de notificaciones Toast
function mostrarToast(mensaje, tipo = 'info') {
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

    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    const iconos = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

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
        transform: translateX(400px);
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
    `;

    // Configurar cierre del toast
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => cerrarToast(toast));

    toastContainer.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 10);

    // Auto cerrar después de 5 segundos
    setTimeout(() => {
        cerrarToast(toast);
    }, 5000);

    return toast; // Devolver el toast para poder cerrarlo manualmente
}

// Función para cerrar toast - AÑADIDA
function cerrarToast(toast) {
    if (!toast || !toast.parentNode) return;
    
    toast.style.transform = 'translateX(400px)';
    toast.style.opacity = '0';
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

window.crearModalEditarCliente = crearModalEditarCliente;
window.crearModalEliminarCliente = crearModalEliminarCliente;
window.mostrarToast = mostrarToast;
window.setupRowSelection = setupRowSelection;
window.seleccionarFila = seleccionarFila;
window.handleRowClick = handleRowClick;
window.cargarTablaClientesDesdeAPI = cargarTablaClientesDesdeAPI;