// Base URL de tu API Javalin
const API_BASE_URL = 'http://localhost:8080/negocio'; // Ajusta el puerto según tu configuración de Javalin

document.addEventListener('DOMContentLoaded', () => {
    getInventario();
    setupEventListeners();
});

// Función para obtener el ID de negocio del sessionStorage
function obtenerIdNegocio() {
    // USAR LA CLAVE EXACTA QUE TIENES EN TU SESSIONSTORAGE
    const idNegocio = sessionStorage.getItem('idNegocio'); // Debería devolver "1"
    
    console.log('ID de negocio obtenido del sessionStorage:', idNegocio);
    
    if (!idNegocio) {
        console.error('No se encontró ID de negocio en sessionStorage');
        // Mostrar todos los elementos del sessionStorage para debug
        console.log('Contenido completo del sessionStorage:');
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            console.log(`${key}: ${sessionStorage.getItem(key)}`);
        }
        return 1; // Valor por defecto
    }
    
    return parseInt(idNegocio);
}

// Obtener todos los lotes del inventario
export async function getInventario() {
    try {
        const negocioId = obtenerIdNegocio(); // Usar función para obtener ID
        const response = await fetch(`${API_BASE_URL}/${negocioId}/lotes`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const inventario = await response.json();
        renderInventarioTable(inventario);
        console.log('Datos recibidos de la API:', inventario);
    } catch (error) {
        console.error('Error fetching inventario:', error);
        showErrorMessage('Error al cargar el inventario');
    }
}

// Crear un nuevo lote
export async function crearLote(datosLote) {
    try {
        const negocioId = obtenerIdNegocio(); // Usar función para obtener ID
        const url = `${API_BASE_URL}/${negocioId}/lote`;
        
        console.log('=== REQUEST DEBUG ===');
        console.log('URL:', url);
        console.log('ID de negocio usado:', negocioId);
        console.log('Datos a enviar:', datosLote);
        console.log('JSON stringified:', JSON.stringify(datosLote, null, 2));
        console.log('====================');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosLote)
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        const responseText = await response.text();
        console.log('Response text:', responseText);
        
        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                errorMessage = responseText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        let nuevoLote;
        try {
            nuevoLote = JSON.parse(responseText);
        } catch (e) {
            console.log('Respuesta no es JSON válido, usando texto:', responseText);
            nuevoLote = { message: responseText };
        }
        
        console.log('Lote creado:', nuevoLote);
        
        // Recargar la tabla
        await getInventario();
        showSuccessMessage('Lote creado exitosamente');
        
        return nuevoLote;
    } catch (error) {
        console.error('Error creating lote:', error);
        showErrorMessage('Error al crear el lote: ' + error.message);
        throw error;
    }
}

// Actualizar un lote existente
export async function actualizarLote(registroId, datosLote) {
    try {
        const negocioId = obtenerIdNegocio();
        
        // Validar y convertir el ID
        if (!registroId || registroId === 'undefined') {
            throw new Error('ID de registro no proporcionado');
        }

        const idRegistro = parseInt(registroId);
        if (isNaN(idRegistro)) {
            throw new Error('ID de registro no válido');
        }

        // Convertir y validar los datos
        const datosActualizar = {
            stockExhibicion: parseInt(datosLote.stockExhibicion) || 0,
            stockMinimo: parseInt(datosLote.stockMinimo) || 0,
            margenGanancia: parseFloat(datosLote.margenGanancia) || 0.0
        };

        console.log('Datos a actualizar:', {
            url: `${API_BASE_URL}/${negocioId}/lote/${idRegistro}`,
            datos: datosActualizar
        });

        const response = await fetch(`${API_BASE_URL}/${negocioId}/lote/${idRegistro}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizar)
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`Error al actualizar: ${text}`);
        }

        const resultado = await response.json();
        
        // Recargar la tabla
        await getInventario();
        showSuccessMessage('Lote actualizado exitosamente');
        
        return resultado;

    } catch (error) {
        console.error('Error al actualizar lote:', error);
        showErrorMessage(error.message);
        throw error;
    }
}

// Eliminar un lote
export async function eliminarLote(registroId) {
    try {
        const negocioId = obtenerIdNegocio();
        
        console.log('Intentando eliminar lote:', {
            registroId,
            tipo: typeof registroId,
            negocioId
        });

        // Validar que tengamos un ID
        if (!registroId || registroId === 'undefined' || registroId === '-') {
            throw new Error('ID de registro no válido');
        }

        // Limpiar el ID y asegurarse de que sea un número
        const idLimpio = registroId.toString().trim();
        const idNumerico = parseInt(idLimpio);

        if (isNaN(idNumerico)) {
            throw new Error('El ID del registro no es un número válido');
        }

        const url = `${API_BASE_URL}/${negocioId}/lote/${idNumerico}`;
        console.log('URL de eliminación:', url);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al eliminar: ${errorText}`);
        }

        return true;

    } catch (error) {
        console.error('Error detallado al eliminar lote:', error);
        throw error;
    }
}

// Función mejorada para extraer el nombre del producto
function extractProductName(lote) {
    // Usar el nombre que viene de la base de datos, solo limpiarlo
    if (lote.producto && lote.producto.trim() !== '') {
        return limpiarNombreProducto(lote.producto.trim());
    }
    
    // Fallback al código si no hay nombre
    return lote.codigoProducto || 'Producto desconocido';
}

// AGREGAR esta nueva función para limpiar nombres:
function limpiarNombreProducto(nombre) {
    if (!nombre) return 'Producto desconocido';
    
    let nombreLimpio = String(nombre).trim();
    console.log('Limpiando nombre original:', nombreLimpio);
    
    // Caso específico: "sabritas bolsa Sabritas Switch Switch 51.0 g"
    if (nombreLimpio.toLowerCase().includes('sabritas bolsa sabritas')) {
        nombreLimpio = nombreLimpio.replace(/sabritas bolsa /gi, '');
    }
    
    // Remover duplicados consecutivos
    const palabras = nombreLimpio.split(/\s+/);
    const palabrasSinDuplicados = [];
    
    for (let i = 0; i < palabras.length; i++) {
        if (i === 0 || palabras[i].toLowerCase() !== palabras[i-1].toLowerCase()) {
            palabrasSinDuplicados.push(palabras[i]);
        }
    }
    
    // Capitalizar apropiadamente
    const palabrasFinales = palabrasSinDuplicados.map((palabra) => {
        if (/^\d/.test(palabra) || palabra.toLowerCase() === 'g' || palabra.toLowerCase() === 'ml') {
            return palabra;
        }
        return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    });
    
    const resultado = palabrasFinales.join(' ');
    console.log('Resultado final:', resultado);
    
    return resultado || 'Producto desconocido';
}

// TAMBIÉN actualizar extractBrand y extractCategory para usar el nombre del producto:
function extractBrand(lote) {
    // Usar la marca que viene de la base de datos
    if (lote.marca && lote.marca.trim() !== '' && lote.marca !== 'Marca desconocida') {
        return lote.marca;
    }
    
    // Si no hay marca, extraerla del nombre del producto
    const nombreProducto = (lote.producto || '').toLowerCase();
    if (nombreProducto.includes('sabritas')) return 'Sabritas';
    if (nombreProducto.includes('coca')) return 'Coca Cola';
    if (nombreProducto.includes('pepsi')) return 'Pepsi';
    
    return 'Marca desconocida';
}

function extractCategory(lote) {
    // Usar la categoría que viene de la base de datos
    if (lote.categoria && lote.categoria.trim() !== '' && lote.categoria !== 'Sin categoría') {
        return lote.categoria;
    }
    
    // Si no hay categoría, deducirla del nombre del producto
    const nombreProducto = (lote.producto || '').toLowerCase();
    if (nombreProducto.includes('sabritas') || nombreProducto.includes('switch')) return 'Snacks';
    if (nombreProducto.includes('coca') || nombreProducto.includes('pepsi')) return 'Bebidas';
    
    return 'Sin categoría';
}

// Renderizar la tabla de inventario - VERSIÓN MEJORADA CON MEJOR DEBUG
function renderInventarioTable(inventario) {
    const tbody = document.querySelector('.products-table tbody');
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (!inventario || inventario.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center;">No hay datos disponibles</td></tr>';
        return;
    }
    
    inventario.forEach((lote, index) => {
        console.log(`=== LOTE ${index + 1} ===`);
        console.log('Datos originales:', lote);
        
        const fila = document.createElement('tr');
        fila.dataset.registroId = lote.id_registro || lote.registro || lote.id;
        
        // Usar las funciones mejoradas de extracción
        const productName = extractProductName(lote);
        const brand = extractBrand(lote);
        const category = extractCategory(lote);
        
        console.log('Datos procesados:');
        console.log('- Producto:', productName);
        console.log('- Marca:', brand);
        console.log('- Categoría:', category);
        console.log('====================');
        
        fila.innerHTML = `
            <td>${lote.codigoProducto || lote.codigo || '-'}</td>
            <td>${productName}</td>
            <td>${category}</td>
            <td>${brand}</td>
            <td>${formatDate(lote.fechaCaducidad || lote.fecha_caducidad)}</td>
            <td>${lote.id_registro || lote.idRegistro || lote.id || '-'}</td>
            <td>${formatDate(lote.fechaEntrada)}</td>
            <td>${formatDate(lote.fechaSalida)}</td>
            <td>${lote.stockAlmacen || lote.stock_almacen || 0}</td>
            <td>${lote.stockExhibicion || lote.stock_exhibicion || 0}</td>
            <td>$${(lote.precioCompra || lote.precioUnitario || 0).toFixed(2)}</td>
        `;
        
        // Agregar event listener para selección de fila
        fila.addEventListener('click', () => {
            document.querySelectorAll('.products-table tbody tr').forEach(r => r.classList.remove('selected'));
            fila.classList.add('selected');
        });
        
        tbody.appendChild(fila);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botón agregar lote
    const btnAdd = document.querySelector('.btn-add');
    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            openAddLoteModal();
        });
    }
    
    // Botón modificar lote
    const btnEdit = document.querySelector('.btn-edit');
    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            const selectedRow = document.querySelector('.products-table tbody tr.selected');
            if (!selectedRow) {
                showErrorMessage('Selecciona un lote para modificar');
                return;
            }
            const registroId = selectedRow.dataset.registroId;
            openEditLoteModal(registroId);
        });
    }
    
    // Botón eliminar lote
    const btnDelete = document.querySelector('.btn-delete');
    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            const selectedRow = document.querySelector('.products-table tbody tr.selected');
            if (!selectedRow) {
                showErrorMessage('Selecciona un lote para eliminar');
                return;
            }
            const registroId = selectedRow.dataset.registroId;
            
            if (confirm('¿Estás seguro de que deseas eliminar este lote?')) {
                eliminarLote(registroId);
            }
        });
    }

    // Botón categoría (dropdown)
    const btnCategory = document.querySelector('.btn-category');
    if (btnCategory) {
        btnCategory.addEventListener('click', () => {
            toggleCategoryDropdown();
        });
    }
}

// Funciones auxiliares
function formatDate(dateString) {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    } catch (error) {
        return '-';
    }
}

function showSuccessMessage(message) {
    createNotification(message, 'success');
}

function showErrorMessage(message) {
    createNotification(message, 'error');
}

function createNotification(message, type) {
    // Remover notificaciones existentes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar la notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Funciones para modales - ahora las conectamos con formsInventario.js
function openAddLoteModal() {
    // Buscar el modal que ya está creado en formsInventario.js
    const modal = document.getElementById('modal-add');
    if (modal) {
        modal.classList.add('active');
    } else {
        console.error('Modal de agregar no encontrado');
    }
}

function openEditLoteModal(registroId) {
    // Buscar el modal que ya está creado en formsInventario.js
    const modal = document.getElementById('modal-edit');
    if (modal) {
        // Aquí puedes cargar los datos del lote para editar
        cargarDatosParaEditar(registroId);
        modal.classList.add('active');
    } else {
        console.error('Modal de editar no encontrado');
    }
}

// Función para cargar datos del lote para editar
export async function cargarDatosParaEditar(registroId) {
    try {
        console.log('Cargando datos para editar, ID:', registroId);
        
        const filaSeleccionada = document.querySelector('.products-table tbody tr.selected');
        if (!filaSeleccionada) {
            console.error('No hay fila seleccionada');
            return;
        }
        
        const celdas = filaSeleccionada.querySelectorAll('td');
        console.log('Celdas encontradas:', celdas.length);
        console.log('Contenido de las celdas:');
        celdas.forEach((celda, index) => {
            console.log(`Celda ${index}: "${celda.textContent}"`);
        });
        
        // Buscar los campos del formulario de edición
        const campos = {
            // Campos editables:
            stockExhibicion: document.querySelector('#edit-stockExhibicion') || 
                           document.querySelector('#modal-edit input[name="stockExhibicion"]'),
            
            stockMinimo: document.querySelector('#edit-stockMinimo') || 
                        document.querySelector('#modal-edit input[name="stockMinimo"]'),
            
            margenGanancia: document.querySelector('#edit-margenGanancia') || 
                           document.querySelector('#modal-edit input[name="margenGanancia"]'),
            
            // Campos de solo lectura:
            codigo: document.querySelector('#edit-codigo') || 
                   document.querySelector('#modal-edit input[name="codigo"]'),
            
            producto: document.querySelector('#edit-producto') || 
                     document.querySelector('#modal-edit input[name="producto"]'),
            
            stockAlmacen: document.querySelector('#edit-stockAlmacen') || 
                         document.querySelector('#modal-edit input[name="stockAlmacen"]')
        };
        
        console.log('=== CAMPOS ENCONTRADOS ===');
        Object.keys(campos).forEach(key => {
            console.log(`${key}:`, campos[key] ? 'ENCONTRADO' : 'NO ENCONTRADO');
        });
        console.log('==========================');
        
        // Llenar los campos que existan
        if (campos.codigo) {
            campos.codigo.value = celdas[0]?.textContent || '';
            campos.codigo.readOnly = true;
        }
        
        if (campos.producto) {
            campos.producto.value = celdas[1]?.textContent || '';
            campos.producto.readOnly = true;
        }
        
        if (campos.stockAlmacen) {
            campos.stockAlmacen.value = celdas[8]?.textContent || '0';
            campos.stockAlmacen.readOnly = true;
        }
        
        // Campos editables con valores actuales:
        if (campos.stockExhibicion) {
            campos.stockExhibicion.value = celdas[9]?.textContent || '0';
            // AGREGAR atributo para stock original
            campos.stockExhibicion.dataset.originalValue = celdas[9]?.textContent || '0';
        }
        
        if (campos.stockMinimo) {
            campos.stockMinimo.value = '5'; // Valor por defecto
        }
        
        if (campos.margenGanancia) {
            campos.margenGanancia.value = '20.0'; // Valor por defecto
        }
        
        console.log('Datos cargados en el formulario');
        
    } catch (error) {
        console.error('Error cargando datos para editar:', error);
        showErrorMessage('Error al cargar los datos para editar');
    }
}

// Función auxiliar para convertir fecha
function convertirFechaParaInput(fechaTexto) {
    if (!fechaTexto || fechaTexto === '-') return '';
    try {
        const partes = fechaTexto.split('/');
        if (partes.length === 3) {
            return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
        }
    } catch (error) {
        console.error('Error convirtiendo fecha:', error);
    }
    return '';
}

// Función para dropdown de categorías
function toggleCategoryDropdown() {
    let dropdown = document.querySelector('.category-dropdown');
    
    if (!dropdown) {
        // Crear dropdown si no existe
        dropdown = createCategoryDropdown();
        document.querySelector('.dropdown-container').appendChild(dropdown);
    }
    
    dropdown.classList.toggle('show');
}

function createCategoryDropdown() {
    const dropdown = document.createElement('div');
    dropdown.className = 'category-dropdown';
    
    // Categorías de ejemplo - puedes obtenerlas de la API
    const categories = ['Todas', 'Electrónicos', 'Ropa', 'Hogar', 'Deportes', 'Libros'];
    
    categories.forEach(category => {
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.textContent = category;
        item.addEventListener('click', () => {
            filterByCategory(category);
            dropdown.classList.remove('show');
        });
        dropdown.appendChild(item);
    });
    
    return dropdown;
}

function filterByCategory(category) {
    const rows = document.querySelectorAll('.products-table tbody tr');
    
    rows.forEach(row => {
        if (category === 'Todas') {
            row.style.display = '';
        } else {
            const categoryCell = row.cells[2]; // Columna de categoría
            if (categoryCell && categoryCell.textContent.trim() === category) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.category-dropdown');
    const dropdownContainer = document.querySelector('.dropdown-container');
    
    if (dropdown && !dropdownContainer.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});