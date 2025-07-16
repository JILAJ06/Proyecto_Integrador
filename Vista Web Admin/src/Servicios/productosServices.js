document.addEventListener('DOMContentLoaded', () => {
    // Cargar datos iniciales si estamos en la página de productos
    if (window.location.pathname.includes('producto')) {
        cargarDatosIniciales();
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

// Obtener categorías disponibles
export async function getCategorias() {
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
        console.log('Categorías obtenidas:', data);
        
        return data.categorias || data || [];
        
    } catch (error) {
        console.error('Error fetching categorías:', error);
        mostrarError('Error al cargar las categorías');
        return getCategoriasEjemplo(); // Fallback a datos de ejemplo
    }
}

// Obtener envases disponibles
export async function getEnvases() {
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
        console.log('Envases obtenidos:', data);
        
        return data.envases || data || [];
        
    } catch (error) {
        console.error('Error fetching envases:', error);
        mostrarError('Error al cargar los envases');
        return getEnvasesEjemplo(); // Fallback a datos de ejemplo
    }
}

// Obtener marcas disponibles
export async function getMarcas() {
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
        console.log('Marcas obtenidas:', data);
        
        return data.marcas || data || [];
        
    } catch (error) {
        console.error('Error fetching marcas:', error);
        mostrarError('Error al cargar las marcas');
        return getMarcasEjemplo(); // Fallback a datos de ejemplo
    }
}

// Crear un nuevo producto
export async function postProducto(datosProducto) {
    const url_endpoint = `${API_BASE_URL}/producto`;

    try {
        const sesion = obtenerDatosSesion();
        
        if (!sesion) {
            throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
        }

        // Estructura del producto según la guía JSON proporcionada
        const productoData = {
            codigoProducto: datosProducto.codigo,
            nombreProducto: datosProducto.nombre,
            nombreMarca: datosProducto.marca,
            nombreEnvase: datosProducto.envase,
            nombreCategoria: datosProducto.categoria,
            variedad: datosProducto.variedad,
            medida: datosProducto.medida,
            contNeto: parseInt(datosProducto.contenido),
            precioVenta: parseFloat(datosProducto.precio)
        };

        console.log('Datos del producto a enviar:', productoData);

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
            } catch (e) {
                errorText = 'No se pudo leer la respuesta del servidor';
            }
            
            console.error('Error response:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        // Verificar si la respuesta tiene contenido JSON válido
        const contentType = response.headers.get('content-type');
        let resultado;
        
        if (contentType && contentType.includes('application/json')) {
            try {
                resultado = await response.json();
            } catch (e) {
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
        return resultado;
        
    } catch (error) {
        console.error('Error posting producto:', error);
        mostrarError('Error al crear el producto: ' + error.message);
        throw error;
    }
}

// Obtener productos usando el endpoint GET correcto
export async function getProductos() {
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
        console.log('Productos obtenidos:', data);
        
        // Mapear la respuesta del backend al formato usado en el frontend
        const productos = (data.productos || data || []).map(producto => ({
            codigo: producto.codigoProducto,
            nombre: producto.nombreProducto,
            marca: producto.nombreMarca,
            envase: producto.nombreEnvase,
            categoria: producto.nombreCategoria,
            variedad: producto.variedad,
            medida: producto.medida,
            contenido: producto.contNeto?.toString() || '0',
            precio: producto.precioVenta
        }));
        
        // Llenar la tabla de productos si estamos en la página correcta
        const tbody = document.querySelector('.productos-table tbody');
        if (tbody) {
            tbody.innerHTML = '';
            
            productos.forEach(producto => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${producto.codigo}</td>
                    <td>${capitalizarTexto(producto.categoria)}</td>
                    <td>${producto.marca}</td>
                    <td>${producto.nombre}</td>
                    <td>${capitalizarTexto(producto.envase)}</td>
                    <td>${producto.variedad}</td>
                    <td>${producto.contenido}</td>
                    <td>${producto.medida}</td>
                    <td>$${parseFloat(producto.precio).toFixed(2)}</td>
                `;
            });
        }
        
        return productos;
        
    } catch (error) {
        console.error('Error fetching productos:', error);
        mostrarError('Error al cargar los productos');
        return [];
    }
}

// Editar producto usando el endpoint PUT correcto
export async function putProducto(codigo, datosProducto) {
    const url_endpoint = `${API_BASE_URL}/producto/${codigo}`;

    try {
        const sesion = obtenerDatosSesion();
        
        if (!sesion) {
            throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
        }

        // Estructura del producto según la guía JSON proporcionada
        const productoData = {
            codigoProducto: datosProducto.codigo || codigo,
            nombreProducto: datosProducto.nombre,
            nombreMarca: datosProducto.marca,
            nombreEnvase: datosProducto.envase,
            nombreCategoria: datosProducto.categoria,
            variedad: datosProducto.variedad,
            medida: datosProducto.medida,
            contNeto: parseInt(datosProducto.contenido),
            precioVenta: parseFloat(datosProducto.precio)
        };

        console.log('Editando producto:', codigo, 'con datos:', productoData);

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
            } catch (e) {
                errorText = 'No se pudo leer la respuesta del servidor';
            }
            
            console.error('Error response:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const contentType = response.headers.get('content-type');
        let resultado;
        
        if (contentType && contentType.includes('application/json')) {
            try {
                resultado = await response.json();
            } catch (e) {
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
        return resultado;
        
    } catch (error) {
        console.error('Error editing producto:', error);
        mostrarError('Error al editar el producto: ' + error.message);
        throw error;
    }
}

// Eliminar producto usando el endpoint DELETE correcto
export async function deleteProducto(codigo) {
    const url_endpoint = `${API_BASE_URL}/producto/${codigo}`;

    try {
        console.log('Eliminando producto:', codigo);

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
        if (typeof getProductos === 'function') {
            await getProductos();
        }
        
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
        const categorias = await getCategorias();
        const selectCategorias = document.querySelectorAll('select[name="categoria"], #categoria-producto, #edit-categoria-producto');
        
        selectCategorias.forEach(select => {
            // Mantener la primera opción (placeholder)
            const primeraOpcion = select.firstElementChild;
            select.innerHTML = '';
            if (primeraOpcion) {
                select.appendChild(primeraOpcion);
            }
            
            // Agregar nuevas opciones
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.nombre || categoria.id || categoria;
                option.textContent = categoria.nombre || categoria;
                select.appendChild(option);
            });
        });
        
        console.log('Categorías cargadas en selects');
    } catch (error) {
        console.error('Error cargando categorías en selects:', error);
    }
}

async function cargarEnvases() {
    try {
        const envases = await getEnvases();
        const selectEnvases = document.querySelectorAll('select[name="envase"], #envase, #edit-envase');
        
        selectEnvases.forEach(select => {
            const primeraOpcion = select.firstElementChild;
            select.innerHTML = '';
            if (primeraOpcion) {
                select.appendChild(primeraOpcion);
            }
            
            envases.forEach(envase => {
                const option = document.createElement('option');
                option.value = envase.nombre || envase.id || envase;
                option.textContent = envase.nombre || envase;
                select.appendChild(option);
            });
        });
        
        console.log('Envases cargados en selects');
    } catch (error) {
        console.error('Error cargando envases en selects:', error);
    }
}

async function cargarMarcas() {
    try {
        const marcas = await getMarcas();
        const inputsMarca = document.querySelectorAll('input[name="marca"], #marca-producto, #edit-marca-producto');
        
        // Para marcas, podemos crear un datalist para autocompletado
        let datalist = document.getElementById('marcas-datalist');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'marcas-datalist';
            document.body.appendChild(datalist);
        }
        
        datalist.innerHTML = '';
        marcas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca.nombre || marca;
            datalist.appendChild(option);
        });
        
        // Asociar datalist a los inputs de marca
        inputsMarca.forEach(input => {
            input.setAttribute('list', 'marcas-datalist');
        });
        
        console.log('Marcas cargadas en datalist');
    } catch (error) {
        console.error('Error cargando marcas:', error);
    }
}

// ===== DATOS DE EJEMPLO COMO FALLBACK =====

function getCategoriasEjemplo() {
    return [
        { nombre: 'bebidas' },
        { nombre: 'snacks' },
        { nombre: 'dulces' },
        { nombre: 'lacteos' },
        { nombre: 'panaderia' },
        { nombre: 'limpieza' },
        { nombre: 'higiene' }
    ];
}

function getEnvasesEjemplo() {
    return [
        { nombre: 'botella' },
        { nombre: 'lata' },
        { nombre: 'bolsa' },
        { nombre: 'caja' },
        { nombre: 'frasco' },
        { nombre: 'tetrapack' },
        { nombre: 'sobre' }
    ];
}

function getMarcasEjemplo() {
    return [
        { nombre: 'Coca Cola' },
        { nombre: 'Pepsi' },
        { nombre: 'Sabritas' },
        { nombre: 'Bimbo' },
        { nombre: 'Lala' },
        { nombre: 'Cloralex' },
        { nombre: 'Nestlé' },
        { nombre: 'Barcel' }
    ];
}

// ===== FUNCIONES DE UTILIDAD =====

function capitalizarTexto(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    if (typeof mostrarAlertaVisual === 'function') {
        mostrarAlertaVisual(mensaje);
    } else {
        console.log(mensaje);
        // Crear alerta simple si no existe la función
        alert(mensaje);
    }
}

// Función auxiliar para mostrar errores
function mostrarError(mensaje) {
    if (typeof mostrarAlertaVisual === 'function') {
        mostrarAlertaVisual(mensaje);
    } else {
        console.error(mensaje);
        // Crear alerta simple si no existe la función
        alert('Error: ' + mensaje);
    }
}

// ===== EXPORTAR FUNCIONES PARA USO GLOBAL =====

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