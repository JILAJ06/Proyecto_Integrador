document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos iniciales si estamos en la página de productos
    if (window.location.pathname.includes('producto') || window.location.pathname.includes('productos')) {
        cargarDatosIniciales();
        // Cargar productos inmediatamente
        setTimeout(() => {
            if (typeof getProductos === 'function') {
                getProductos();
            }
        }, 100);
    }
});

// Función para obtener datos de sesión
function obtenerDatosSesion() {
    const sesionActiva = sessionStorage.getItem('clink_sesion_activa');
    return sesionActiva ? JSON.parse(sesionActiva) : null;
}

// Función para obtener API URL dinámica
function obtenerAPIBaseURL() {
    const sesion = obtenerDatosSesion();
    if (sesion && sesion.idNegocio) {
        return `http://localhost:8080/negocio/${sesion.idNegocio}`;
    }
    return 'http://localhost:8080/negocio/1'; // Fallback
}

const API_BASE_URL = obtenerAPIBaseURL();

// Cargar datos iniciales para formularios
async function cargarDatosIniciales() {
    try {
        await Promise.all([
            cargarCategorias(),
            cargarEnvases(), 
            cargarMarcas()
        ]);
        console.log('Datos iniciales cargados correctamente');
    } catch (error) {
        console.error('Error cargando datos iniciales:', error);
    }
}

// ===== FUNCIONES PRINCIPALES DEL API =====

// Obtener categorías disponibles - SIMPLIFICAR
async function getCategorias() {
    // CORRECCIÓN: Usar el endpoint correcto del backend
    const url_endpoint = `${API_BASE_URL}/producto/categorias`;
    
    try {
        console.log('Obteniendo categorías desde:', url_endpoint);
        
        const response = await fetch(url_endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categorías RAW sin procesar:', data);
        
        // DEVOLVER LOS DATOS TAL COMO VIENEN DEL BACKEND
        return data;
        
    } catch (error) {
        console.error('Error fetching categorías:', error);
        mostrarError('Error al cargar las categorías desde el servidor');
        return [];
    }
}

// Obtener envases disponibles - SIMPLIFICAR
async function getEnvases() {
    // CORRECCIÓN: Usar el endpoint correcto del backend
    const url_endpoint = `${API_BASE_URL}/producto/envases`;
    
    try {
        console.log('Obteniendo envases desde:', url_endpoint);
        
        const response = await fetch(url_endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Envases RAW sin procesar:', data);
        
        // DEVOLVER LOS DATOS TAL COMO VIENEN DEL BACKEND
        return data;
        
    } catch (error) {
        console.error('Error fetching envases:', error);
        mostrarError('Error al cargar los envases desde el servidor');
        return [];
    }
}

// Obtener marcas disponibles - SIMPLIFICAR
async function getMarcas() {
    // CORRECCIÓN: Usar el endpoint correcto del backend
    const url_endpoint = `${API_BASE_URL}/producto/marcas`;
    
    try {
        console.log('Obteniendo marcas desde:', url_endpoint);
        
        const response = await fetch(url_endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Marcas RAW sin procesar:', data);
        
        // DEVOLVER LOS DATOS TAL COMO VIENEN DEL BACKEND
        return data;
        
    } catch (error) {
        console.error('Error fetching marcas:', error);
        mostrarError('Error al cargar las marcas desde el servidor');
        return [];
    }
}

// Obtener productos usando el endpoint GET correcto
async function getProductos() {
    // CORRECCIÓN: Usar el endpoint correcto del backend
    const url_endpoint = `${API_BASE_URL}/productos`;
    
    try {
        console.log('Obteniendo productos desde:', url_endpoint);
        
        const response = await fetch(url_endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Productos obtenidos RAW:', data);
        
        // Mejorar el mapeo de la respuesta del backend
        let productos = [];
        
        // Si data es un array directamente
        if (Array.isArray(data)) {
            productos = data;
        }
        // Si data tiene una propiedad productos
        else if (data && data.productos && Array.isArray(data.productos)) {
            productos = data.productos;
        }
        // Si data es un objeto con los productos como propiedades
        else if (data && typeof data === 'object') {
            productos = [data];
        }
        
        // CORREGIR EL MAPEO para acceder correctamente a los objetos anidados
        const productosFormateados = productos.map(producto => {
            console.log('Procesando producto:', producto);
            
            // Extraer datos de los objetos anidados correctamente
            return {
                codigo: producto.codigoProducto || 'N/A',
                nombre: producto.nombreComercial || 'Sin nombre',
                marca: producto.marca ? producto.marca.nombreMarca : 'Sin marca',
                envase: producto.envase ? producto.envase.nombreEnvase : 'Sin envase',
                categoria: producto.categoria ? producto.categoria.nombreCategoria : 'Sin categoría',
                variedad: producto.variedad || 'Sin variedad',
                medida: producto.medida || 'pz',
                contenido: producto.contNeto?.toString() || '0',
                precio: producto.precioVenta || 0,
                _original: producto
            };
        });
        
        console.log('Productos mapeados correctamente:', productosFormateados);
        
        // Actualizar la tabla directamente desde el servicio
        actualizarTablaProductos(productosFormateados);
        
        return productosFormateados;
        
    } catch (error) {
        console.error('Error fetching productos:', error);
        mostrarError('Error al cargar los productos desde el servidor');
        // Limpiar la tabla en caso de error
        const tbody = document.querySelector('.productos-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">Error al cargar productos</td></tr>';
        }
        return [];
    }
}

// Función auxiliar para extraer texto solo cuando sea realmente necesario
function extraerTextoSeguro(valor) {
    if (valor === null || valor === undefined) return '';
    
    // Si ya es string, devolverlo
    if (typeof valor === 'string') return valor;
    
    // Si es número, convertir
    if (typeof valor === 'number') return valor.toString();
    
    // Si es objeto, intentar extraer nombre pero sin forzar
    if (typeof valor === 'object' && valor !== null) {
        // Solo si realmente tiene una propiedad nombre
        if (valor.nombre) return valor.nombre;
        if (valor.value) return valor.value;
        if (valor.text) return valor.text;
    }
    
    // Si no podemos extraer nada útil, devolver string vacío
    return '';
}

// Función para actualizar tabla de productos SIN sobre-formatear
function actualizarTablaProductos(productos) {
    const tbody = document.querySelector('.productos-table tbody');
    if (!tbody) {
      console.warn('No se encontró tbody de la tabla');
      return;
    }
    
    tbody.innerHTML = '';
    
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; padding: 20px;">No hay productos disponibles</td></tr>';
        return;
    }
    
    productos.forEach(producto => {
        const row = tbody.insertRow();
        
        // USAR LOS VALORES DIRECTAMENTE SIN SOBRE-PROCESAR
        const codigo = producto.codigo || 'N/A';
        const categoria = producto.categoria || 'Sin categoría';
        const marca = producto.marca || 'Sin marca';
        const nombre = producto.nombre || 'Sin nombre';
        const envase = producto.envase || 'Sin envase';
        const variedad = producto.variedad || 'Sin variedad';
        const contenido = producto.contenido || '0';
        const medida = producto.medida || 'pz';
        const precio = producto.precio || 0;
        
        row.innerHTML = `
            <td>${codigo}</td>
            <td>${categoria}</td>
            <td>${marca}</td>
            <td>${nombre}</td>
            <td>${envase}</td>
            <td>${variedad}</td>
            <td>${contenido}</td>
            <td>${medida}</td>
            <td>$${parseFloat(precio).toFixed(2)}</td>
        `;
        
        // IMPORTANTE: Agregar eventos de selección a cada fila
        row.addEventListener('click', () => {
            // Quitar selección anterior
            const filaAnterior = tbody.querySelector('tr.selected');
            if (filaAnterior) {
                filaAnterior.classList.remove('selected');
            }
            
            // Seleccionar nueva fila
            row.classList.add('selected');
            
            // CRÍTICO: Actualizar la variable global en formProducto
            if (window.formProducto && window.formProducto.setFilaSeleccionada) {
                window.formProducto.setFilaSeleccionada(row);
            }
            
            // También actualizar la variable local del formProducto si existe
            if (window.seleccionarFilaProducto) {
                window.seleccionarFilaProducto(row);
            }
            
            console.log('Fila seleccionada:', row);
        });
        
        // Agregar clase para hover
        row.addEventListener('mouseenter', () => {
            if (!row.classList.contains('selected')) {
                row.style.backgroundColor = '#f5f5f5';
            }
        });
        
        row.addEventListener('mouseleave', () => {
            if (!row.classList.contains('selected')) {
                row.style.backgroundColor = '';
            }
        });
    });
    
    console.log(`Tabla actualizada con ${productos.length} productos SIN formateo excesivo`);
}

// Crear un nuevo producto - ESTRUCTURA CORREGIDA
async function postProducto(datosProducto) {
    // CORRECCIÓN: Usar el endpoint correcto del backend
    const url_endpoint = `${API_BASE_URL}/producto`;

    try {
        const sesion = obtenerDatosSesion();
        
        if (!sesion) {
            throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
        }

        // Validar datos requeridos
        if (!datosProducto.codigo) {
            throw new Error('El código del producto es requerido');
        }
        if (!datosProducto.nombre) {
            throw new Error('El nombre del producto es requerido');
        }
        if (!datosProducto.marca) {
            throw new Error('La marca del producto es requerida');
        }
        if (!datosProducto.categoria) {
            throw new Error('La categoría del producto es requerida');
        }
        if (!datosProducto.envase) {
            throw new Error('El envase del producto es requerido');
        }

        // ESTRUCTURA CORREGIDA según tu guía JSON
        const productoData = {
            codigoProducto: String(datosProducto.codigo).trim(),
            nombreProducto: String(datosProducto.nombre).trim(),
            nombreMarca: String(datosProducto.marca).trim(),
            nombreEnvase: String(datosProducto.envase).trim(),
            nombreCategoria: String(datosProducto.categoria).trim(),
            variedad: String(datosProducto.variedad || 'Sin variedad').trim(),
            medida: String(datosProducto.medida || 'pz').trim(),
            contNeto: parseFloat(datosProducto.contenido) || 0,
            precioVenta: parseFloat(datosProducto.precio) || 0
        };

        console.log('Datos del producto a enviar (ESTRUCTURA CORRECTA):', productoData);
        console.log('URL endpoint:', url_endpoint);

        const response = await fetch(url_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            let errorText;
            try {
                errorText = await response.text();
                console.error('Error text:', errorText);
            } catch (e) {
                errorText = 'No se pudo leer la respuesta del servidor';
            }
            
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        let resultado;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            try {
                resultado = await response.json();
            } catch (e) {
                console.log('Respuesta no es JSON válido, pero la operación fue exitosa');
                resultado = { 
                    message: 'Producto creado exitosamente',
                    codigoProducto: productoData.codigoProducto,
                    nombreProducto: productoData.nombreProducto
                };
            }
        } else {
            resultado = { 
                message: 'Producto creado exitosamente',
                codigoProducto: productoData.codigoProducto,
                nombreProducto: productoData.nombreProducto
            };
        }
        
        console.log('Producto creado:', resultado);
        mostrarExito('Producto creado exitosamente');
        
        // Recargar productos después de crear
        setTimeout(() => {
            getProductos();
        }, 500);
        
        return resultado;
        
    } catch (error) {
        console.error('Error posting producto:', error);
        mostrarError('Error al crear el producto: ' + error.message);
        throw error;
    }
}

// Editar producto - ESTRUCTURA CORREGIDA
async function putProducto(codigo, datosProducto) {
    // CORRECCIÓN: Usar el endpoint correcto del backend
    const url_endpoint = `${API_BASE_URL}/producto`;

    try {
        const sesion = obtenerDatosSesion();
        
        if (!sesion) {
            throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
        }

        // Validar datos requeridos
        if (!datosProducto.nombre) {
            throw new Error('El nombre del producto es requerido');
        }
        if (!datosProducto.marca) {
            throw new Error('La marca del producto es requerida');
        }
        if (!datosProducto.categoria) {
            throw new Error('La categoría del producto es requerida');
        }
        if (!datosProducto.envase) {
            throw new Error('El envase del producto es requerido');
        }

        // ESTRUCTURA CORREGIDA según tu guía JSON
        const productoData = {
            codigoProducto: String(datosProducto.codigo || codigo).trim(),
            nombreProducto: String(datosProducto.nombre).trim(),
            nombreMarca: String(datosProducto.marca).trim(),
            nombreEnvase: String(datosProducto.envase).trim(),
            nombreCategoria: String(datosProducto.categoria).trim(),
            variedad: String(datosProducto.variedad || 'Sin variedad').trim(),
            medida: String(datosProducto.medida || 'pz').trim(),
            contNeto: parseFloat(datosProducto.contenido) || 0,
            precioVenta: parseFloat(datosProducto.precio) || 0
        };

        console.log('Editando producto con datos (ESTRUCTURA CORRECTA):', productoData);
        console.log('URL endpoint:', url_endpoint);

        const response = await fetch(url_endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
        });

        if (!response.ok) {
            let errorText;
            try {
                errorText = await response.text();
                console.error('Error text:', errorText);
            } catch (e) {
                errorText = 'No se pudo leer la respuesta del servidor';
            }
            
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        let resultado;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            try {
                resultado = await response.json();
            } catch (e) {
                console.log('Respuesta no es JSON válido, pero la operación fue exitosa');
                resultado = { 
                    message: 'Producto editado exitosamente',
                    codigoProducto: codigo
                };
            }
        } else {
            resultado = { 
                message: 'Producto editado exitosamente',
                codigoProducto: codigo
            };
        }
        
        console.log('Producto editado:', resultado);
        mostrarExito('Producto editado exitosamente');
        
        // Recargar productos después de editar
        setTimeout(() => {
            getProductos();
        }, 500);
        
        return resultado;
        
    } catch (error) {
        console.error('Error editing producto:', error);
        mostrarError('Error al editar el producto: ' + error.message);
        throw error;
    }
}

// Eliminar producto - YA ESTÁ CORRECTO  
async function deleteProducto(codigo) {
    // CORRECTO: /negocio/{id}/producto/{codigo}
    const url_endpoint = `${API_BASE_URL}/producto/${codigo}`;

    try {
        console.log('Eliminando producto:', codigo);
        console.log('URL endpoint CORREGIDA:', url_endpoint);

        const response = await fetch(url_endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            let errorText;
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = 'No se pudo leer la respuesta del servidor';
            }
            
            console.error('Error response:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        console.log('Producto eliminado exitosamente');
        mostrarExito('Producto eliminado exitosamente');
        
        // Recargar productos después de eliminar
        await getProductos();
        
        return { message: 'Producto eliminado exitosamente' };
        
    } catch (error) {
        console.error('Error deleting producto:', error);
        mostrarError('Error al eliminar el producto: ' + error.message);
        throw error;
    }
}

// ===== FUNCIONES AUXILIARES PARA POBLAR DROPDOWNS =====

async function cargarCategorias() {
    try {
        const data = await getCategorias();
        console.log('Data de categorías recibida:', data);
        
        const selectCategorias = document.querySelectorAll('select[name="categoria"], #categoria-producto, #edit-categoria-producto');
        
        selectCategorias.forEach(select => {
            // Mantener la primera opción (placeholder)
            const primeraOpcion = select.firstElementChild;
            select.innerHTML = '';
            if (primeraOpcion) {
                select.appendChild(primeraOpcion);
            }
            
            // Procesar datos según la estructura que venga del backend
            let categorias = [];
            if (Array.isArray(data)) {
                categorias = data;
            } else if (data && data.categorias) {
                categorias = data.categorias;
            } else if (data && typeof data === 'object') {
                categorias = [data];
            }
            
            // Agregar opciones extrayendo el texto solo cuando sea necesario
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                const texto = extraerTextoSeguro(categoria) || categoria;
                option.value = texto;
                option.textContent = texto;
                select.appendChild(option);
            });
        });
        
        console.log('Categorías cargadas en selects sin formateo excesivo');
    } catch (error) {
        console.error('Error cargando categorías en selects:', error);
    }
}

async function cargarEnvases() {
    try {
        const data = await getEnvases();
        console.log('Data de envases recibida:', data);
        
        const selectEnvases = document.querySelectorAll('select[name="envase"], #envase, #edit-envase');
        
        selectEnvases.forEach(select => {
            const primeraOpcion = select.firstElementChild;
            select.innerHTML = '';
            if (primeraOpcion) {
                select.appendChild(primeraOpcion);
            }
            
            // Procesar datos según la estructura que venga del backend
            let envases = [];
            if (Array.isArray(data)) {
                envases = data;
            } else if (data && data.envases) {
                envases = data.envases;
            } else if (data && typeof data === 'object') {
                envases = [data];
            }
            
            // Agregar opciones extrayendo el texto solo cuando sea necesario
            envases.forEach(envase => {
                const option = document.createElement('option');
                const texto = extraerTextoSeguro(envase) || envase;
                option.value = texto;
                option.textContent = texto;
                select.appendChild(option);
            });
        });
        
        console.log('Envases cargados en selects sin formateo excesivo');
    } catch (error) {
        console.error('Error cargando envases en selects:', error);
    }
}

async function cargarMarcas() {
    try {
        const data = await getMarcas();
        console.log('Data de marcas recibida:', data);
        
        const inputsMarca = document.querySelectorAll('input[name="marca"], #marca-producto, #edit-marca-producto');
        
        // Procesar datos según la estructura que venga del backend
        let marcas = [];
        if (Array.isArray(data)) {
            marcas = data;
        } else if (data && data.marcas) {
            marcas = data.marcas;
        } else if (data && typeof data === 'object') {
            marcas = [data];
        }
        
        if (marcas.length > 0) {
            let datalist = document.getElementById('marcas-datalist');
            if (!datalist) {
                datalist = document.createElement('datalist');
                datalist.id = 'marcas-datalist';
                document.body.appendChild(datalist);
            }
            
            datalist.innerHTML = '';
            marcas.forEach(marca => {
                const option = document.createElement('option');
                const texto = extraerTextoSeguro(marca) || marca;
                option.value = texto;
                datalist.appendChild(option);
            });
            
            // Asociar datalist a los inputs de marca
            inputsMarca.forEach(input => {
                input.setAttribute('list', 'marcas-datalist');
            });
        }
        
        console.log('Marcas cargadas en datalist sin formateo excesivo');
    } catch (error) {
        console.error('Error cargando marcas:', error);
    }
}

// ===== FUNCIONES DE UTILIDAD =====

function capitalizarTexto(texto) {
    // Validar que el texto sea válido y convertirlo a string
    if (!texto || texto === null || texto === undefined) return '';
    
    // Convertir a string si no lo es
    const textoStr = String(texto);
    
    // Verificar que no esté vacío después de la conversión
    if (textoStr.length === 0) return '';
    
    return textoStr.charAt(0).toUpperCase() + textoStr.slice(1).toLowerCase();
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    if (typeof mostrarAlertaVisual === 'function') {
        mostrarAlertaVisual(mensaje);
    } else {
        console.log(mensaje);
        // Crear alerta simple si no existe la función
        const alerta = document.createElement('div');
        alerta.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-size: 14px;
        `;
        alerta.textContent = mensaje;
        document.body.appendChild(alerta);
        setTimeout(() => alerta.remove(), 3000);
    }
}

// Función auxiliar para mostrar errores
function mostrarError(mensaje) {
    if (typeof mostrarAlertaVisual === 'function') {
        mostrarAlertaVisual(mensaje);
    } else {
        console.error(mensaje);
        // Crear alerta simple si no existe la función
        const alerta = document.createElement('div');
        alerta.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10001;
            font-size: 14px;
        `;
        alerta.textContent = mensaje;
        document.body.appendChild(alerta);
        setTimeout(() => alerta.remove(), 3000);
    }
}

// ===== EXPORTAR FUNCIONES PARA USO GLOBAL - Sin export =====

window.getCategorias = getCategorias;
window.getEnvases = getEnvases;
window.getMarcas = getMarcas;
window.postProducto = postProducto;
window.getProductos = getProductos;
window.putProducto = putProducto;
window.deleteProducto = deleteProducto;
window.cargarDatosIniciales = cargarDatosIniciales;
window.capitalizarTexto = capitalizarTexto;

// Funciones auxiliares globales
window.cargarCategorias = cargarCategorias;
window.cargarEnvases = cargarEnvases;
window.cargarMarcas = cargarMarcas;