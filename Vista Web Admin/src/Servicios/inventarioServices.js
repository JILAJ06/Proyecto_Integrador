// Configuración de la API
const API_CONFIG = {
    baseURL: 'http://54.198.31.200:8080', // Cambia por tu URL base
    headers: {
        'Content-Type': 'application/json',
        // Agrega aquí headers de autenticación si los necesitas
        // 'Authorization': 'Bearer tu-token'
    }
};

// Servicio de API para inventario
export const InventarioServices = {
    // Configuración
    config: API_CONFIG,

    // Método para obtener el ID del negocio desde sessionStorage
    getNegocioId() {
        const negocioId = sessionStorage.getItem('negocioId') || sessionStorage.getItem('idNegocio') || sessionStorage.getItem('id_negocio');
        
        if (!negocioId) {
            console.warn('⚠️ No se encontró ID de negocio en sessionStorage');
            // Puedes retornar un valor por defecto o lanzar un error
            return 1; // Valor por defecto
        }
        
        console.log('📋 ID de negocio obtenido:', negocioId);
        return negocioId;
    },

    // Método para obtener el nombre de usuario desde sessionStorage
    getNombreUsuario() {
        // Primero intentar obtener de las claves directas
        let nombreUsuario = sessionStorage.getItem('nombreUsuario') || 
                           sessionStorage.getItem('usuario') || 
                           sessionStorage.getItem('username') ||
                           sessionStorage.getItem('user') ||
                           sessionStorage.getItem('name');
        
        // Si no se encuentra, intentar buscar en objetos JSON almacenados
        if (!nombreUsuario || nombreUsuario === 'admin') {
            try {
                // Buscar en clink_session_activa
                const sessionActiva = sessionStorage.getItem('clink_session_activa');
                if (sessionActiva) {
                    const sessionData = JSON.parse(sessionActiva);
                    nombreUsuario = sessionData.nombreusuario || 
                                   sessionData.nombreUsuario || 
                                   sessionData.usuario || 
                                   sessionData.username || 
                                   sessionData.user;
                }
            } catch (error) {
                console.warn('⚠️ Error al parsear clink_session_activa:', error);
            }
            
            // Si aún no se encuentra, buscar en otras posibles claves JSON
            if (!nombreUsuario || nombreUsuario === 'admin') {
                const possibleKeys = ['userData', 'userInfo', 'sessionData', 'loginData'];
                
                for (const key of possibleKeys) {
                    try {
                        const data = sessionStorage.getItem(key);
                        if (data) {
                            const parsed = JSON.parse(data);
                            nombreUsuario = parsed.nombreUsuario || 
                                           parsed.nombreusuario || 
                                           parsed.usuario || 
                                           parsed.username || 
                                           parsed.user || 
                                           parsed.name;
                            if (nombreUsuario && nombreUsuario !== 'admin') break;
                        }
                    } catch (error) {
                        // Continuar con la siguiente clave
                        continue;
                    }
                }
            }
        }
        
        if (!nombreUsuario || nombreUsuario === 'admin') {
            console.warn('⚠️ No se encontró nombre de usuario válido en sessionStorage');
            console.log('🔍 Contenido actual de sessionStorage:', this.debugSessionStorage());
            return 'usuario_default'; // Valor por defecto
        }
        
        console.log('👤 Nombre de usuario obtenido:', nombreUsuario);
        return nombreUsuario;
    },

    // Método para actualizar configuración
    setConfig(newConfig) {
        Object.assign(this.config, newConfig);
    },

    // Método para establecer token de autenticación
    setAuthToken(token) {
        this.config.headers['Authorization'] = `Bearer ${token}`;
    },

    // Obtener todos los lotes
    async obtenerLotes() {
        try {
            const negocioId = this.getNegocioId();
            const url = `${this.config.baseURL}/negocio/${negocioId}/lotes`;
            
            console.log('🔄 Obteniendo lotes del servidor...');
            console.log('📍 URL:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.config.headers
            });
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Respuesta completa del servidor:', data);
            
            // Verificar si la respuesta es un array o un objeto con array dentro
            let lotes = data;
            
            if (!Array.isArray(data)) {
                console.log('🔍 Buscando array dentro del objeto...');
                const posiblesArrays = ['lotes', 'data', 'items', 'content', 'results'];
                
                for (const prop of posiblesArrays) {
                    if (data[prop] && Array.isArray(data[prop])) {
                        console.log(`✅ Array encontrado en propiedad: ${prop}`);
                        lotes = data[prop];
                        break;
                    }
                }
                
                if (!Array.isArray(lotes)) {
                    console.log('🔄 Convirtiendo objeto a array...');
                    lotes = [data];
                }
            }

            // Procesar cada lote para parsear el producto
            const lotesProcesados = lotes.map(lote => {
                const productoParseado = parsearProducto(lote.producto);
                
                return {
                    ...lote,
                    // Mantener el producto original
                    productoOriginal: lote.producto,
                    // Agregar campos parseados
                    nombre: productoParseado.nombre,
                    marca: productoParseado.marca,
                    categoria: productoParseado.categoria,
                    envase: productoParseado.envase,
                    presentacion: productoParseado.presentacion
                };
            });

            console.log('✅ Lotes procesados:', lotesProcesados);
            console.log('📊 Cantidad final de lotes:', lotesProcesados.length);
            
            return lotesProcesados;
            
        } catch (error) {
            console.error('❌ Error al obtener lotes:', error);
            throw new Error(`Error al obtener lotes: ${error.message}`);
            window.mostrarAlertaGlobal('Error al obtener lotes: ' + error.message, 'error');
        }
    },

    // Crear un nuevo lote
    async crearLote(loteData) {
        try {
            const negocioId = this.getNegocioId();
            const nombreUsuario = loteData.nombreUsuario || this.getNombreUsuario();
            const url = `${this.config.baseURL}/negocio/${negocioId}/lote`;
            
            console.log('🔄 Creando nuevo lote...');
            console.log('📍 URL:', url);
            console.log('📦 Datos recibidos del formulario:', loteData);
            console.log('👤 Usuario a utilizar:', nombreUsuario);
            
            // Validar datos requeridos
            if (!loteData.codigoProducto || !nombreUsuario) {
                throw new Error('Faltan campos obligatorios: codigoProducto, nombreUsuario');
                window.mostrarAlertaGlobal('Faltan campos obligatorios: codigoProducto, nombreUsuario', 'error');
            }
            
            // Transformar datos al formato EXACTO que espera el backend
            // SOLO incluir los campos que el backend espera
            const loteParaBackend = {
                idNegocio: parseInt(this.getNegocioId()) || 1,
                codigoProducto: String(loteData.codigoProducto).trim(),
                nombreUsuario: String(nombreUsuario).trim(),
                stockAlmacen: parseInt(loteData.stockAlmacen) || 0,
                stockExhibicion: parseInt(loteData.stockExhibicion) || 0,
                stockMinimo: parseInt(loteData.stockMinimo) || 0,
                fechaCaducidad: loteData.fechaCaducidad,
                precioCompra: parseFloat(loteData.precioCompra) || 0.0,
                fechaEntrada: loteData.fechaEntrada,
                margenGanancia: parseFloat(loteData.margenGanancia) || 0.0
            };

            
            console.log('📦 JSON final para el backend:', JSON.stringify(loteParaBackend, null, 2));
            
            const response = await fetch(url, {
                method: 'POST',
                headers: this.config.headers,
                body: JSON.stringify(loteParaBackend)
            });

            
            console.log('📡 Response status:', response.status);
            console.log('📡 Response headers:', [...response.headers.entries()]);
            
            // Obtener el texto de respuesta para debug
            const responseText = await response.text();
            console.log('📄 Response body (raw):', responseText);
            
            if (!response.ok) {
                console.error('❌ Error del servidor:', responseText);
                throw new Error(`Error HTTP: ${response.status} - ${responseText}`);
                window.mostrarAlertaGlobal('Error al crear lote: ' + responseText, 'error');
            }
            
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                console.warn('⚠️ La respuesta no es JSON válido, usando texto plano');
                data = { message: responseText };
            }
            
            console.log('✅ Lote creado exitosamente:', data);
            return data;
            window.mostrarAlertaGlobal('Lote creado exitosamente', 'success');
            
        } catch (error) {
            console.error('❌ Error completo al crear lote:', error);
            throw new Error(`Error al crear lote: ${error.message}`);
            window.mostrarAlertaGlobal('Error al crear lote: ' + error.message, 'error');
        }
    },

    // Actualizar un lote
    async actualizarLote(idRegistro, loteData) {
    const url = `${this.config.baseURL}/negocio/${this.getNegocioId()}/lote/${idRegistro}`;

    const datosParaBackend = {
        stockExhibicion: parseInt(loteData.stockExhibicion) || 0,
        stockMinnimo: parseInt(loteData.stockMinimo) || 0, // 👈 nombre exacto del backend
        margenGanancia: parseFloat(loteData.margenGanancia) || 0.0
    };

    try {
        const response = await fetch(url, {
        method: 'PUT',
        headers: this.config.headers,
        body: JSON.stringify(datosParaBackend)
        });

        if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error al actualizar lote:", errorText);
        window.mostrarAlertaGlobal('Error al actualizar lote: ' + errorText, 'error');
        throw new Error(`Error HTTP ${response.status}`);
        }

        console.log("✅ Lote actualizado exitosamente");
        window.mostrarAlertaGlobal('Lote actualizado exitosamente', 'success');
        const contentType = response.headers.get("content-type");

        if (response.status === 204 || !contentType?.includes("application/json")) {
        console.log("✅ Lote actualizado (sin contenido en respuesta)");
        return null;
        }

        return await response.json();

    } catch (error) {
        console.error("❌ Excepción al actualizar lote:", error);
        throw error;
    }
},


    // Eliminar un lote
    async eliminarLote(registroId) {
        try {
            const negocioId = this.getNegocioId();
            const url = `${this.config.baseURL}/negocio/${negocioId}/lote/${registroId}`;
            
            console.log(`🔄 Eliminando lote ${registroId}...`);
            console.log('📍 URL:', url);
            
            if (!registroId) {
                throw new Error('ID de registro es requerido para eliminar');
            }
            
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.config.headers
            });
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error del servidor:', errorText);
            window.mostrarAlertaGlobal('Error al eliminar lote: ' + errorText, 'error');
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
            }
            
            console.log('✅ Lote eliminado exitosamente');
            window.mostrarAlertaGlobal('Lote eliminado exitosamente', 'success');
            return true;
            
        } catch (error) {
            console.error('❌ Error al eliminar lote:', error);
            throw new Error(`Error al eliminar lote: ${error.message}`);
            window.mostrarAlertaGlobal('Error al eliminar lote: ' + error.message, 'error');
        }
    },

    // Método para obtener un lote específico (opcional)
    async obtenerLotePorId(registroId) {
        try {
            const negocioId = this.getNegocioId();
            const url = `${this.config.baseURL}/negocio/${negocioId}/lote/${registroId}`;
            
            console.log(`🔄 Obteniendo lote ${registroId}...`);
            console.log('📍 URL:', url);
            
            if (!registroId) {
                throw new Error('ID de registro es requerido');
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.config.headers
            });
            
            console.log('📡 Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('✅ Lote obtenido exitosamente:', data);
            return data;
            
        } catch (error) {
            console.error('❌ Error al obtener lote:', error);
            throw new Error(`Error al obtener lote: ${error.message}`);
        }
    },

    // Método para verificar conexión con el servidor
    async verificarConexion() {
        try {
            const negocioId = this.getNegocioId();
            const url = `${this.config.baseURL}/negocio/${negocioId}/lotes`;
            
            console.log('🔄 Verificando conexión con el servidor...');
            console.log('📍 URL de prueba:', url);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.config.headers
            });
            
            const isConnected = response.ok;
            console.log(isConnected ? '✅ Conexión exitosa' : '❌ Conexión fallida');
            console.log('📡 Status de conexión:', response.status);
            
            return isConnected;
            
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            return false;
        }
    },

    // Método para debugear la respuesta del servidor
    async debugRespuestaServidor() {
        try {
            const negocioId = this.getNegocioId();
            const url = `${this.config.baseURL}/negocio/${negocioId}/lotes`;
            
            console.log('🐛 DEBUG: Analizando respuesta del servidor...');
            console.log('📍 URL:', url);
            console.log('🏢 Negocio ID:', negocioId);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.config.headers
            });
            
            console.log('📡 Status:', response.status);
            console.log('📡 Status Text:', response.statusText);
            console.log('📡 Headers:', [...response.headers.entries()]);
            
            const textResponse = await response.text();
            console.log('📄 Respuesta como texto:', textResponse);
            
            try {
                const jsonResponse = JSON.parse(textResponse);
                console.log('📋 Respuesta parseada:', jsonResponse);
                console.log('📊 Estructura del objeto:', Object.keys(jsonResponse));
                
                if (Array.isArray(jsonResponse)) {
                    console.log('✅ Es un array con', jsonResponse.length, 'elementos');
                } else {
                    console.log('⚠️ No es un array, buscando arrays anidados...');
                    for (const [key, value] of Object.entries(jsonResponse)) {
                        console.log(`🔍 ${key}:`, typeof value, Array.isArray(value) ? `(array con ${value.length} elementos)` : '');
                    }
                }
                
                return jsonResponse;
            } catch (parseError) {
                console.error('❌ Error al parsear JSON:', parseError);
                return null;
            }
            
        } catch (error) {
            console.error('❌ Error en debug:', error);
            return null;
        }
    },

    // Método helper para debugear sessionStorage
    debugSessionStorage() {
        const debug = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            const value = sessionStorage.getItem(key);
            
            // Intentar parsear si parece JSON
            try {
                if (value.startsWith('{') || value.startsWith('[')) {
                    debug[key] = JSON.parse(value);
                } else {
                    debug[key] = value;
                }
            } catch {
                debug[key] = value;
            }
        }
        return debug;
    }
};

// Función helper para establecer el ID del negocio en sessionStorage
export const setNegocioId = (id) => {
    sessionStorage.setItem('negocioId', id);
    console.log('💾 ID de negocio guardado en sessionStorage:', id);
};

// Función helper para establecer el nombre de usuario en sessionStorage
export const setNombreUsuario = (nombreUsuario) => {
    // Establecer en la clave directa
    sessionStorage.setItem('nombreUsuario', nombreUsuario);
    
    // También actualizar en clink_session_activa si existe
    try {
        const sessionActiva = sessionStorage.getItem('clink_session_activa');
        if (sessionActiva) {
            const sessionData = JSON.parse(sessionActiva);
            sessionData.nombreusuario = nombreUsuario;
            sessionData.nombreUsuario = nombreUsuario; // Por si acaso
            sessionStorage.setItem('clink_session_activa', JSON.stringify(sessionData));
        }
    } catch (error) {
        console.warn('⚠️ Error al actualizar clink_session_activa:', error);
    }
    
    console.log('💾 Nombre de usuario guardado en sessionStorage:', nombreUsuario);
};

// Función para forzar el uso de un nombre de usuario específico
export const setNombreUsuarioFromSession = () => {
    try {
        const sessionActiva = sessionStorage.getItem('clink_session_activa');
        if (sessionActiva) {
            const sessionData = JSON.parse(sessionActiva);
            const nombreUsuario = sessionData.nombreusuario || sessionData.nombreUsuario;
            
            if (nombreUsuario) {
                sessionStorage.setItem('nombreUsuario', nombreUsuario);
                console.log('✅ Nombre de usuario extraído de sesión activa:', nombreUsuario);
                return nombreUsuario;
            }
        }
    } catch (error) {
        console.error('❌ Error al extraer nombre de usuario de sesión:', error);
    }
    
    return null;
};

// Función helper para obtener información de sessionStorage
export const getSessionInfo = () => {
    const keys = Object.keys(sessionStorage);
    console.log('🔑 Claves en sessionStorage:', keys);
    
    keys.forEach(key => {
        console.log(`📝 ${key}:`, sessionStorage.getItem(key));
    });
    
    return {
        negocioId: sessionStorage.getItem('negocioId'),
        idNegocio: sessionStorage.getItem('idNegocio'),
        id_negocio: sessionStorage.getItem('id_negocio'),
        nombreUsuario: sessionStorage.getItem('nombreUsuario'),
        usuario: sessionStorage.getItem('usuario'),
        username: sessionStorage.getItem('username'),
        user: sessionStorage.getItem('user'),
        name: sessionStorage.getItem('name'),
        allKeys: keys
    };
};

// Función para parsear la información del producto
function parsearProducto(productoString) {
    if (!productoString || typeof productoString !== 'string') {
        return {
            nombre: 'Sin nombre',
            marca: 'Sin marca',
            categoria: 'Sin categoría',
            envase: 'Sin envase',
            presentacion: 'Sin presentación'
        };
    }

    // Ejemplo: "Sabritas bolsa Ruffles MegaCrunch Jalapeño 45.0 kg"
    const resultado = {
        nombre: '',
        marca: '',
        categoria: '',
        envase: '',
        presentacion: ''
    };

    // Listas de palabras clave para identificar cada campo
    const marcas = ['Coca-Cola', 'Pepsi', 'Sabritas', 'Barcel', 'Bimbo', 'Lala', 'Nestlé', 'Doritos', 'Cheetos', 'Ruffles', 'Lay\'s'];
    const envases = ['bolsa', 'botella', 'lata', 'frasco', 'caja', 'tetrapack', 'envase', 'paquete'];
    const categorias = ['refresco', 'agua', 'snack', 'dulce', 'galleta', 'cereal', 'leche', 'yogurt', 'pan'];

    // Convertir a minúsculas para comparación
    const textoLower = productoString.toLowerCase();
    const palabras = productoString.split(' ');

    // Buscar marca
    for (const marca of marcas) {
        if (textoLower.includes(marca.toLowerCase())) {
            resultado.marca = marca;
            break;
        }
    }

    // Buscar envase
    for (const envase of envases) {
        if (textoLower.includes(envase.toLowerCase())) {
            resultado.envase = envase;
            break;
        }
    }

    // Buscar categoría
    for (const categoria of categorias) {
        if (textoLower.includes(categoria.toLowerCase())) {
            resultado.categoria = categoria;
            break;
        }
    }

    // Extraer presentación (buscar patrones como "45.0 kg", "600ml", "2L", etc.)
    const patronPresentacion = /(\d+(?:\.\d+)?)\s*(kg|g|ml|l|lt|oz|pz|piezas?)/gi;
    const matchPresentacion = productoString.match(patronPresentacion);
    if (matchPresentacion) {
        resultado.presentacion = matchPresentacion[0];
    }

    // El nombre será lo que quede después de quitar marca, envase y presentación
    let nombre = productoString;
    if (resultado.marca) {
        nombre = nombre.replace(new RegExp(resultado.marca, 'gi'), '').trim();
    }
    if (resultado.envase) {
        nombre = nombre.replace(new RegExp(resultado.envase, 'gi'), '').trim();
    }
    if (resultado.presentacion) {
        nombre = nombre.replace(new RegExp(resultado.presentacion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '').trim();
    }

    // Limpiar espacios múltiples y asignar nombre
    resultado.nombre = nombre.replace(/\s+/g, ' ').trim() || 'Producto';

    // Si no se encontró marca, usar la primera palabra
    if (!resultado.marca && palabras.length > 0) {
        resultado.marca = palabras[0];
    }

    // Si no se encontró categoría, intentar deducir por palabras clave
    if (!resultado.categoria) {
        if (textoLower.includes('cola') || textoLower.includes('refresco')) {
            resultado.categoria = 'bebidas';
        } else if (textoLower.includes('agua')) {
            resultado.categoria = 'bebidas';
        } else if (textoLower.includes('chip') || textoLower.includes('papas')) {
            resultado.categoria = 'snacks';
        } else if (textoLower.includes('dulce') || textoLower.includes('chocolate')) {
            resultado.categoria = 'dulces';
        } else {
            resultado.categoria = 'general';
        }
    }

    return resultado;
}

// Exportar también la función de parseo para uso externo
export { parsearProducto };

// Exportar también la configuración por si se necesita acceso directo
export { API_CONFIG };

// Exportar por defecto el servicio
export default InventarioServices;