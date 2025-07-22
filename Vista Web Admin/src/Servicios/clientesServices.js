// Base URL for the API
const BASE_URL = 'http://localhost:8080';

// Función para obtener el ID del negocio desde sessionStorage
function getNegocioId() {
    // Intentar usar la función global primero
    if (typeof window !== 'undefined' && window.obtenerIdNegocio) {
        return window.obtenerIdNegocio();
    }
    
    // Fallback: buscar directamente en sessionStorage
    let negocioId = sessionStorage.getItem('negocioId') || 
                   sessionStorage.getItem('idNegocio') ||
                   sessionStorage.getItem('id_negocio');
    
    if (!negocioId) {
        console.error('No se encontró el ID del negocio en sessionStorage');
        console.log('Creando ID de negocio por defecto...');
        negocioId = 1;
        sessionStorage.setItem('negocioId', negocioId.toString());
    }
    
    const resultado = parseInt(negocioId);
    console.log('ID de negocio para API:', resultado);
    return resultado;
}

// Get all clients
export async function getClientes() {
    try {
        const NEGOCIO_ID = getNegocioId();
        const url = `${BASE_URL}/negocio/${NEGOCIO_ID}/clientes`;
        console.log('Fetching clientes from:', url);
        
        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const clientes = await response.json();

        // Actualizar tabla
        actualizarTablaClientes(clientes);
        return clientes;
        
    } catch (error) {
        console.error('Error fetching clientes:', error);
        
        // Si hay error de conexión, mostrar datos de prueba
        console.warn('Usando datos de prueba debido a error de conexión');
        const clientesPrueba = [
            { id: 1, nombre: "Juan Pérez", telefono: "961-123-4567" },
            { id: 2, nombre: "María González", telefono: "961-987-6543" },
            { id: 3, nombre: "Carlos López", telefono: "961-555-0123" }
        ];
        
        actualizarTablaClientes(clientesPrueba);
        return clientesPrueba;
    }
}

// Función separada para actualizar la tabla
function actualizarTablaClientes(clientes) {
    console.log('Actualizando tabla con clientes:', clientes);
    
    const tbody = document.querySelector('.clientes-table tbody');
    if (!tbody) {
        console.error('No se encontró tbody de la tabla de clientes');
        return;
    }

    tbody.innerHTML = ''; // Clear existing content

    if (!clientes || clientes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color: #666;">No hay clientes registrados</td></tr>';
        return;
    }

    clientes.forEach(cliente => {
        // Normalizar el objeto cliente - manejar tanto 'id' como 'idCliente'
        const clienteNormalizado = {
            id: cliente.id || cliente.idCliente,
            nombre: cliente.nombre,
            telefono: cliente.telefono
        };
        
        
        // Asegurar que el ID sea un entero
        const clienteId = parseInt(clienteNormalizado.id);
        if (isNaN(clienteId)) {
            console.error('ID de cliente inválido:', clienteNormalizado.id);
            return; // Saltar este cliente si el ID no es válido
        }

        const fila = document.createElement('tr');
        fila.style.cursor = 'pointer';
        
        // Guardar todos los datos como data-attributes y propiedades
        fila.setAttribute('data-cliente-id', clienteId.toString());
        fila.setAttribute('data-cliente-nombre', clienteNormalizado.nombre || '');
        fila.setAttribute('data-cliente-telefono', clienteNormalizado.telefono || '');
        
        // También guardar como propiedades del elemento para acceso directo
        fila.clienteId = clienteId;
        fila.clienteNombre = clienteNormalizado.nombre;
        fila.clienteTelefono = clienteNormalizado.telefono;
        
        fila.innerHTML = `
            <td>${clienteId}</td>
            <td>${clienteNormalizado.nombre || ''}</td>
            <td>${clienteNormalizado.telefono || ''}</td>
        `;
        tbody.appendChild(fila);
    });

    
    // Verificar que las filas tienen los datos correctos
    const filasCreadas = tbody.querySelectorAll('tr');
    filasCreadas.forEach((fila, index) => {
        (`Fila ${index}:`, {
            clienteId: fila.clienteId,
            dataClienteId: fila.getAttribute('data-cliente-id'),
            primeraCelda: fila.children[0]?.textContent
        });
    });
    
    // Reconfigurar selección después de actualizar la tabla
    setTimeout(() => {
        console.log('Intentando reconfigurar selección...');
        
        // Método 1: Usar función global
        if (typeof window !== 'undefined' && window.setupRowSelection) {
            console.log('Usando setupRowSelection global...');
            window.setupRowSelection();
        }
        // Método 2: Configurar directamente aquí
        else {
            console.log('Configurando selección directamente...');
            configurarSeleccionDirecta();
        }
    }, 150);
}

// Función auxiliar para configurar selección directamente
function configurarSeleccionDirecta() {
    const tabla = document.querySelector('.clientes-table tbody');
    if (!tabla) {
        console.error('No se encontró la tabla para configurar selección directa');
        return;
    }

    // Agregar listener de click directamente a cada fila
    const filas = tabla.querySelectorAll('tr');
    console.log(`Configurando ${filas.length} filas directamente`);
    
    filas.forEach((fila, index) => {
        // Verificar que la fila tenga datos válidos
        const primeraCelda = fila.children[0];
        if (primeraCelda && primeraCelda.textContent.trim() !== 'No hay clientes registrados') {
            console.log(`Configurando fila ${index} con ID: ${primeraCelda.textContent}`);
            
            // Asegurar que los datos estén en la fila
            const clienteId = parseInt(primeraCelda.textContent.trim());
            if (!fila.clienteId) {
                fila.clienteId = clienteId;
                fila.setAttribute('data-cliente-id', clienteId.toString());
            }
            
            fila.addEventListener('click', function() {
                console.log('Click directo en fila con ID:', clienteId);
                
                // Llamar a la función de selección global si existe
                if (window.seleccionarFila) {
                    window.seleccionarFila(this);
                } else {
                    // Selección básica
                    seleccionBasica(this);
                }
            });
        }
    });
}

// Función de selección básica
function seleccionBasica(fila) {
    // Remover selección anterior
    document.querySelectorAll('.clientes-table tbody tr').forEach(tr => {
        tr.classList.remove('selected');
        tr.style.backgroundColor = '';
        tr.style.border = '';
    });
    
    // Seleccionar nueva fila
    fila.classList.add('selected');
    fila.style.backgroundColor = '#e6f3fe';
    fila.style.border = '2px solid #2196f3';
    
    console.log('Fila seleccionada con selección básica');
    
    // Actualizar variable global
    if (window.filaSeleccionada !== undefined) {
        window.filaSeleccionada = fila;
    }
}

// Función auxiliar para manejar respuestas del servidor
async function manejarRespuestaServidor(response, operacion = 'operación') {
    console.log(`Manejando respuesta para ${operacion}:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
    });
    
    // Verificar si la respuesta es exitosa
    if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            try {
                const data = await response.json();
                console.log(`✓ ${operacion} exitosa (JSON):`, data);
                return data;
            } catch (jsonError) {
                console.warn(`Respuesta exitosa pero error al parsear JSON:`, jsonError);
                return { success: true, message: `${operacion} completada` };
            }
        } else {
            const text = await response.text();
            console.log(`✓ ${operacion} exitosa (Text):`, text);
            return { success: true, message: text || `${operacion} completada` };
        }
    } else {
        // Respuesta no exitosa
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        
        try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } else {
                const errorText = await response.text();
                if (errorText) {
                    errorMessage = errorText;
                }
            }
        } catch (parseError) {
            console.warn('Error al parsear respuesta de error:', parseError);
        }
        
        console.error(`✗ Error en ${operacion}:`, errorMessage);
        throw new Error(errorMessage);
    }
}

// Función auxiliar para normalizar objetos cliente
function normalizarCliente(cliente) {
    return {
        id: cliente.id || cliente.idCliente,
        nombre: cliente.nombre,
        telefono: cliente.telefono
    };
}

// Get client by ID - CORREGIDO
export async function getClienteById(clienteId) {
    try {
        const NEGOCIO_ID = getNegocioId();
        const url = `${BASE_URL}/negocio/${NEGOCIO_ID}/cliente/${clienteId}`;
        console.log('Obteniendo cliente por ID:', clienteId);
        console.log('URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const cliente = await response.json();
        console.log('Cliente encontrado (raw):', cliente);
        
        // Normalizar el cliente
        const clienteNormalizado = normalizarCliente(cliente);
        console.log('Cliente normalizado:', clienteNormalizado);
        
        return clienteNormalizado;
        
    } catch (error) {
        console.error('Error fetching cliente:', error);
        throw error;
    }
}

// Delete client - CORREGIDO CON MANEJO DE CONSTRAINTS
export async function deleteCliente(clienteId) {
    try {
        const NEGOCIO_ID = getNegocioId();
        const url = `${BASE_URL}/negocio/${NEGOCIO_ID}/cliente/${clienteId}`;
        console.log('Eliminando cliente:', clienteId);
        console.log('URL:', url);
        
        const response = await fetch(url, {
            method: 'DELETE'
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            
            // Manejar diferentes tipos de errores
            if (response.status === 409 || errorText.includes('foreign key constraint') || errorText.includes('CONSTRAINT')) {
                throw new Error('CONSTRAINT_ERROR: El cliente tiene registros asociados y no se puede eliminar');
            } else if (response.status === 404) {
                throw new Error('NOT_FOUND: Cliente no encontrado');
            } else if (response.status === 500) {
                throw new Error('SERVER_ERROR: Error interno del servidor');
            } else {
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
        }
        
        console.log('Cliente eliminado correctamente');
        
        // Refresh the table
        setTimeout(async () => {
            try {
                await getClientes();
                console.log('✓ Tabla actualizada después de eliminar cliente');
            } catch (error) {
                console.warn('Error al actualizar tabla después de eliminar:', error);
            }
        }, 500);
        
        return true;
        
    } catch (error) {
        console.error('Error deleting cliente:', error);
        throw error;
    }
}

// Update client - CORREGIDO CON ACTUALIZACIÓN LOCAL
export async function updateCliente(clienteId, datos) {
    try {
        const NEGOCIO_ID = getNegocioId();
        const url = `${BASE_URL}/negocio/${NEGOCIO_ID}/cliente/${clienteId}`;
        console.log('Actualizando cliente:', clienteId, datos);
        console.log('URL:', url);
        console.log("→ Ejecutando updateCliente con ID:", clienteId);
        console.trace("Traza de stack:");

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            
            // Manejar diferentes tipos de errores
            if (response.status === 409 || errorText.includes('foreign key constraint') || errorText.includes('CONSTRAINT')) {
                throw new Error('CONSTRAINT_ERROR: Error de integridad en la base de datos');
            } else if (response.status === 404) {
                throw new Error('NOT_FOUND: Cliente no encontrado');
            } else if (response.status === 400) {
                throw new Error('BAD_REQUEST: Datos del cliente inválidos');
            } else if (response.status === 500) {
                throw new Error('SERVER_ERROR: Error interno del servidor');
            } else {
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
        }
        
        // Manejar respuesta que puede ser vacía o con contenido
        let clienteActualizado = null;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            clienteActualizado = await response.json();
            console.log('Cliente actualizado (JSON):', clienteActualizado);
            clienteActualizado = normalizarCliente(clienteActualizado);
        } else {
            console.log('Respuesta sin JSON, creando objeto cliente actualizado');
            clienteActualizado = {
                id: clienteId,
                nombre: datos.nombre,
                telefono: datos.telefono
            };
        }
        
        console.log('Cliente actualizado final:', clienteActualizado);
        
        // CAMBIO: Actualizar solo la fila específica en lugar de recargar toda la tabla
        actualizarFilaEspecifica(clienteActualizado);
        
        return clienteActualizado;
        
    } catch (error) {
        console.error('Error updating cliente:', error);
        throw error;
    }
}

// Función para actualizar solo una fila específica
function actualizarFilaEspecifica(clienteActualizado) {
    console.log('Actualizando fila específica para cliente:', clienteActualizado);
    
    const tbody = document.querySelector('.clientes-table tbody');
    if (!tbody) {
        console.error('No se encontró tbody de la tabla');
        return;
    }
    
    // Buscar la fila que corresponde a este cliente
    const filas = tbody.querySelectorAll('tr');
    let filaEncontrada = null;
    
    for (const fila of filas) {
        const clienteId = fila.clienteId || parseInt(fila.getAttribute('data-cliente-id'));
        if (clienteId === clienteActualizado.id) {
            filaEncontrada = fila;
            break;
        }
    }
    
    if (filaEncontrada) {
        console.log('Fila encontrada, actualizando contenido...');
        
        // Actualizar el contenido de la fila
        filaEncontrada.innerHTML = `
            <td>${clienteActualizado.id}</td>
            <td>${clienteActualizado.nombre || ''}</td>
            <td>${clienteActualizado.telefono || ''}</td>
        `;
        
        // Actualizar las propiedades y atributos
        filaEncontrada.clienteId = clienteActualizado.id;
        filaEncontrada.clienteNombre = clienteActualizado.nombre;
        filaEncontrada.clienteTelefono = clienteActualizado.telefono;
        
        filaEncontrada.setAttribute('data-cliente-id', clienteActualizado.id.toString());
        filaEncontrada.setAttribute('data-cliente-nombre', clienteActualizado.nombre || '');
        filaEncontrada.setAttribute('data-cliente-telefono', clienteActualizado.telefono || '');
        
        // Mantener la selección si esta fila estaba seleccionada
        if (filaEncontrada.classList.contains('selected')) {
            console.log('Manteniendo selección en fila actualizada');
            // Actualizar también la variable global si existe
            if (window.clienteSeleccionado) {
                window.clienteSeleccionado = {
                    id: clienteActualizado.id,
                    nombre: clienteActualizado.nombre,
                    telefono: clienteActualizado.telefono
                };
            }
        }
        
        console.log('✓ Fila actualizada exitosamente');
    } else {
        console.warn('No se encontró la fila para actualizar, recargando tabla completa...');
        // Fallback: recargar toda la tabla si no se encuentra la fila
        setTimeout(async () => {
            try {
                await getClientes();
            } catch (error) {
                console.error('Error al recargar tabla:', error);
            }
        }, 500);
    }
}

// Create new client - CORREGIDO
export async function createCliente(datos) {
    try {
        const NEGOCIO_ID = getNegocioId();
        const url = `${BASE_URL}/negocio/${NEGOCIO_ID}/cliente`;
        console.log('Creando cliente:', datos);
        console.log('URL:', url);
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        // Manejar respuesta que puede ser vacía o con contenido
        let cliente = null;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            cliente = await response.json();
            console.log('Cliente creado (JSON):', cliente);
            cliente = normalizarCliente(cliente);
        } else {
            console.log('Respuesta sin JSON, creando objeto cliente');
            cliente = {
                id: Date.now(), // ID temporal
                nombre: datos.nombre,
                telefono: datos.telefono
            };
        }
        
        console.log('Cliente creado final:', cliente);
        
        // Refresh the table
        setTimeout(async () => {
            try {
                await getClientes();
                console.log('✓ Tabla actualizada después de crear cliente');
            } catch (error) {
                console.warn('Error al actualizar tabla después de crear:', error);
            }
        }, 500);
        
        return cliente;
        
    } catch (error) {
        console.error('Error creating cliente:', error);
        throw error;
    }
}

// Función auxiliar para agregar un cliente manualmente a la tabla
function actualizarTablaConNuevoCliente(cliente) {
    console.log('Agregando cliente manualmente a la tabla:', cliente);
    
    const tbody = document.querySelector('.clientes-table tbody');
    if (!tbody) {
        console.error('No se encontró tbody de la tabla');
        return;
    }
    
    // Verificar si ya existe una fila con "No hay clientes"
    const filaVacia = tbody.querySelector('tr td[colspan="3"]');
    if (filaVacia) {
        tbody.innerHTML = '';
    }
    
    const clienteId = parseInt(cliente.id);
    const fila = document.createElement('tr');
    fila.style.cursor = 'pointer';
    
    fila.setAttribute('data-cliente-id', clienteId.toString());
    fila.setAttribute('data-cliente-nombre', cliente.nombre || '');
    fila.setAttribute('data-cliente-telefono', cliente.telefono || '');
    
    fila.clienteId = clienteId;
    fila.clienteNombre = cliente.nombre;
    fila.clienteTelefono = cliente.telefono;
    
    fila.innerHTML = `
        <td>${clienteId}</td>
        <td>${cliente.nombre || ''}</td>
        <td>${cliente.telefono || ''}</td>
    `;
    
    tbody.appendChild(fila);
    
    // Reconfigurar selección
    setTimeout(() => {
        if (window.setupRowSelection) {
            window.setupRowSelection();
        }
    }, 100);
}

// Update client in sale
export async function updateClienteInVenta(datos) {
    try {
        const NEGOCIO_ID = getNegocioId();
        const url = `${BASE_URL}/negocio/${NEGOCIO_ID}/venta/cliente`;
        console.log('Actualizando cliente en venta:', datos);
        
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const resultado = await response.json();
        console.log('Cliente actualizado en venta:', resultado);
        return resultado;
        
    } catch (error) {
        console.error('Error updating cliente in venta:', error);
        throw error;
    }
}
