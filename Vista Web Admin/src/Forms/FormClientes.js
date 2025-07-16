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

// Configurar selección de filas
function setupRowSelection() {
    const tabla = document.querySelector('.clientes-table tbody');
    if (tabla) {
        tabla.addEventListener('click', function(e) {
            const fila = e.target.closest('tr');
            if (fila && fila.querySelector('td') && fila.querySelector('td').textContent.trim() !== '' && fila.querySelector('td').textContent.trim() !== '\u00A0') {
                seleccionarFila(fila);
            }
        });
    }
}

// Seleccionar fila
function seleccionarFila(fila) {
    // Remover selección anterior
    document.querySelectorAll('.clientes-table tbody tr').forEach(tr => {
        tr.classList.remove('selected');
    });
    
    // Seleccionar nueva fila
    fila.classList.add('selected');
    filaSeleccionada = fila;
}

// Función para crear el modal de agregar cliente
function crearModalCliente() {
    console.log('Creando modal de cliente...');
    
    // Verificar si ya existe un modal
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear el overlay del modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Crear el contenedor del modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container cliente-modal';
    
    // HTML del modal
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="form-group">
                <label for="nombreCliente">Escriba el nombre</label>
                <input type="text" id="nombreCliente" class="form-input" placeholder="">
            </div>
            
            <div class="form-group">
                <label for="telefonoCliente">Escriba el teléfono</label>
                <input type="tel" id="telefonoCliente" class="form-input" placeholder="Ejem. 961-XXX-XXXX">
            </div>
            
            <div class="modal-buttons">
                <button type="button" class="btn-accept-cliente">Aceptar</button>
                <button type="button" class="btn-cancel-cliente">Cancelar</button>
            </div>
        </div>
    `;

    // Agregar el modal al overlay
    modalOverlay.appendChild(modalContainer);
    
    // Agregar el overlay al documento
    document.body.appendChild(modalOverlay);
    
    // Aplicar estilos
    aplicarEstilosModal();
    
    // Configurar eventos del modal
    setupModalClienteEvents(modalOverlay);
    
    // Mostrar modal
    setTimeout(() => {
        modalOverlay.classList.add('active');
        const nombreInput = document.getElementById('nombreCliente');
        if (nombreInput) {
            nombreInput.focus();
        }
    }, 10);
}

// Función para configurar los eventos del modal de cliente (agregar)
function setupModalClienteEvents(modalOverlay) {
    const btnAceptar = modalOverlay.querySelector('.btn-accept-cliente');
    const btnCancelar = modalOverlay.querySelector('.btn-cancel-cliente');
    const nombreInput = modalOverlay.querySelector('#nombreCliente');
    const telefonoInput = modalOverlay.querySelector('#telefonoCliente');

    // Evento para cerrar modal con Escape
    function handleEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    }

    document.addEventListener('keydown', handleEscape);

    // Evento para cerrar modal al hacer clic fuera
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            cerrarModal();
        }
    });

    // Evento del botón cancelar
    btnCancelar.addEventListener('click', cerrarModal);

    // Evento del botón aceptar
    btnAceptar.addEventListener('click', function() {
        const nombre = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();

        // Validar campos
        if (!nombre) {
            mostrarToast('Por favor, ingresa el nombre del cliente', 'warning');
            nombreInput.focus();
            return;
        }

        if (!telefono) {
            mostrarToast('Por favor, ingresa el teléfono del cliente', 'warning');
            telefonoInput.focus();
            return;
        }

        // Validar formato de teléfono (opcional)
        const telefonoRegex = /^[0-9\-\(\)\s\+]+$/;
        if (!telefonoRegex.test(telefono)) {
            mostrarToast('Por favor, ingresa un teléfono válido', 'warning');
            telefonoInput.focus();
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
        cerrarModal();
    });

    // Función para cerrar el modal
    function cerrarModal() {
        document.removeEventListener('keydown', handleEscape);
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }

    // Permitir envío con Enter
    [nombreInput, telefonoInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                btnAceptar.click();
            }
        });
    });
}

// Función para configurar los eventos del modal de editar
function setupModalEditarEvents(modalOverlay) {
    const btnAceptar = modalOverlay.querySelector('.btn-accept-cliente');
    const btnCancelar = modalOverlay.querySelector('.btn-cancel-cliente');
    const nombreInput = modalOverlay.querySelector('#editNombreCliente');
    const telefonoInput = modalOverlay.querySelector('#editTelefonoCliente');
    const clienteId = parseInt(btnAceptar.getAttribute('data-id'));

    // Evento para cerrar modal con Escape
    function handleEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    }

    document.addEventListener('keydown', handleEscape);

    // Evento para cerrar modal al hacer clic fuera
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            cerrarModal();
        }
    });

    // Evento del botón cancelar
    btnCancelar.addEventListener('click', cerrarModal);

    // Evento del botón aceptar (guardar cambios)
    btnAceptar.addEventListener('click', function() {
        const nombre = nombreInput.value.trim();
        const telefono = telefonoInput.value.trim();

        // Validar campos
        if (!nombre) {
            mostrarToast('Por favor, ingresa el nombre del cliente', 'warning');
            nombreInput.focus();
            return;
        }

        if (!telefono) {
            mostrarToast('Por favor, ingresa el teléfono del cliente', 'warning');
            telefonoInput.focus();
            return;
        }

        // Validar formato de teléfono
        const telefonoRegex = /^[0-9\-\(\)\s\+]+$/;
        if (!telefonoRegex.test(telefono)) {
            mostrarToast('Por favor, ingresa un teléfono válido', 'warning');
            telefonoInput.focus();
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
            
            // Cerrar modal
            cerrarModal();
        } else {
            mostrarToast('Error al actualizar el cliente', 'error');
        }
    });

    // Función para cerrar el modal
    function cerrarModal() {
        document.removeEventListener('keydown', handleEscape);
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }

    // Permitir envío con Enter
    [nombreInput, telefonoInput].forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                btnAceptar.click();
            }
        });
    });
}

// Función para crear el modal de editar cliente
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
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear el overlay del modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Crear el contenedor del modal
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container cliente-modal';
    
    // HTML del modal de editar
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="form-group">
                <label for="editNombreCliente">Escriba el nombre</label>
                <input type="text" id="editNombreCliente" class="form-input" value="${cliente.nombre}">
            </div>
            
            <div class="form-group">
                <label for="editTelefonoCliente">Escriba el teléfono</label>
                <input type="tel" id="editTelefonoCliente" class="form-input" value="${cliente.telefono}" placeholder="Ejem. 961-XXX-XXXX">
            </div>
            
            <div class="modal-buttons">
                <button type="button" class="btn-accept-cliente" data-id="${cliente.id}">Aceptar</button>
                <button type="button" class="btn-cancel-cliente">Cancelar</button>
            </div>
        </div>
    `;

    // Agregar el modal al overlay
    modalOverlay.appendChild(modalContainer);
    
    // Agregar el overlay al documento
    document.body.appendChild(modalOverlay);
    
    // Aplicar estilos
    aplicarEstilosModal();
    
    // Configurar eventos del modal de editar
    setupModalEditarEvents(modalOverlay);
    
    // Mostrar modal
    setTimeout(() => {
        modalOverlay.classList.add('active');
        const nombreInput = document.getElementById('editNombreCliente');
        if (nombreInput) {
            nombreInput.focus();
        }
    }, 10);
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
    const modalExistente = document.querySelector('.modal-overlay');
    if (modalExistente) {
        modalExistente.remove();
    }

    // Crear el overlay del modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    // Crear el contenedor del modal de eliminar
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container advertencia-modal';
    
    // HTML del modal de eliminar
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="delete-warning">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Advertencia</h3>
                <p>Está a punto de eliminar al cliente "${cliente.nombre}" de esta sección, ¿está seguro de querer realizar esta acción?</p>
            </div>
            <div class="modal-buttons">
                <button type="button" class="btn-accept-advertencia" data-id="${cliente.id}">Aceptar</button>
                <button type="button" class="btn-cancel-advertencia">Cancelar</button>
            </div>
        </div>
    `;

    // Agregar el modal al overlay
    modalOverlay.appendChild(modalContainer);
    
    // Agregar el overlay al documento
    document.body.appendChild(modalOverlay);
    
    // Aplicar estilos de modal de eliminar
    aplicarEstilosModalEliminar();
    
    // Configurar eventos del modal de eliminar
    setupModalEliminarEvents(modalOverlay);
    
    // Mostrar modal
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
}

// Función para configurar eventos del modal de eliminar
function setupModalEliminarEvents(modalOverlay) {
    const btnAceptar = modalOverlay.querySelector('.btn-accept-advertencia');
    const btnCancelar = modalOverlay.querySelector('.btn-cancel-advertencia');
    const clienteId = parseInt(btnAceptar.getAttribute('data-id'));

    // Evento para cerrar modal con Escape
    function handleEscape(e) {
        if (e.key === 'Escape') {
            cerrarModal();
        }
    }

    document.addEventListener('keydown', handleEscape);

    // Evento para cerrar modal al hacer clic fuera
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            cerrarModal();
        }
    });

    // Evento del botón cancelar
    btnCancelar.addEventListener('click', cerrarModal);

    // Evento del botón aceptar (confirmar eliminación)
    btnAceptar.addEventListener('click', function() {
        const cliente = clientes.find(c => c.id === clienteId);
        const nombreCliente = cliente ? cliente.nombre : 'Cliente';
        
        if (eliminarCliente(clienteId)) {
            mostrarToast(`Cliente "${nombreCliente}" eliminado exitosamente`, 'success');
            filaSeleccionada = null; // Limpiar selección
            cerrarModal();
        } else {
            mostrarToast('Error al eliminar el cliente', 'error');
        }
    });

    // Función para cerrar el modal
    function cerrarModal() {
        document.removeEventListener('keydown', handleEscape);
        modalOverlay.classList.remove('active');
        setTimeout(() => {
            modalOverlay.remove();
        }, 300);
    }
}

// Función para aplicar estilos al modal
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

// Función para aplicar estilos específicos al modal de eliminar
function aplicarEstilosModalEliminar() {
    // Verificar si ya existen los estilos del modal de eliminar
    if (document.getElementById('eliminar-modal-styles')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'eliminar-modal-styles';
    style.textContent = `
      /* Estilos especiales para el modal de advertencia de eliminación */
      .advertencia-modal {
        background: #D4C5A1 !important;
        border: 4px solid #8B7355 !important;
        border-radius: 20px !important;
        width: 600px !important;
        height: 451px !important;
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

      .modal-overlay.active .advertencia-modal {
        transform: scale(1);
      }

      .advertencia-modal .modal-content {
        padding: 0 !important;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .advertencia-modal .delete-warning {
        text-align: center;
        padding: 0;
        margin-bottom: 40px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .advertencia-modal .delete-warning i {
        font-size: 80px;
        color: #333;
        margin-bottom: 20px;
        display: block;
      }

      .advertencia-modal .delete-warning h3 {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        margin: 0 0 30px 0;
        font-family: Arial, sans-serif;
      }

      .advertencia-modal .delete-warning p {
        font-size: 18px;
        color: #333;
        line-height: 1.5;
        margin: 0;
        max-width: 500px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
        font-weight: 400;
      }

      .advertencia-modal .modal-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin-top: 0;
        margin-bottom: 20px;
      }

      .btn-accept-advertencia,
      .btn-cancel-advertencia {
        background: white;
        color: #333;
        border: none;
        border-radius: 25px;
        padding: 15px 35px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        font-family: Arial, sans-serif;
      }

      .btn-accept-advertencia:hover,
      .btn-cancel-advertencia:hover {
        background: #f0f0f0;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      }

      /* Responsive para pantallas pequeñas */
      @media (max-width: 650px) {
        .advertencia-modal {
          width: 90vw !important;
          height: auto !important;
          min-height: 400px !important;
          max-height: 90vh !important;
        }
        
        .advertencia-modal .delete-warning i {
          font-size: 60px;
        }
        
        .advertencia-modal .delete-warning h3 {
          font-size: 24px;
        }
        
        .advertencia-modal .delete-warning p {
          font-size: 16px;
        }
        
        .btn-accept-advertencia,
        .btn-cancel-advertencia {
          padding: 12px 25px;
          font-size: 14px;
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