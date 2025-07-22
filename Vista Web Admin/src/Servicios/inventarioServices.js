// inventarioServices.js - Servicios para gestión de inventario

const API_BASE_URL = 'http://localhost:8080'; // Ajusta según tu configuración

// Clase para manejar servicios de inventario
class InventarioServices {
    
    /**
     * Obtener todos los lotes del inventario
     * GET /negocio/{id}/lotes
     */
    static async obtenerTodosLosLotes() {
        try {
            // Obtener el ID del negocio desde sessionStorage
            const negocioId = sessionStorage.getItem('negocioId') || '1'; // Default 1 si no existe
            
            const response = await fetch(`${API_BASE_URL}/negocio/${negocioId}/lotes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener lotes: ${response.status} ${response.statusText}`);
            }

            const lotes = await response.json();
            console.log('Lotes obtenidos:', lotes);
            return lotes;

        } catch (error) {
            console.error('Error en obtenerTodosLosLotes:', error);
            throw error;
        }
    }

    /**
     * Crear un nuevo lote
     * POST /negocio/{id}/lote
     */
    static async crearLote(datosLote) {
        try {
            const negocioId = sessionStorage.getItem('negocioId') || '1';
            
            console.log('Enviando datos del lote:', datosLote);

            const response = await fetch(`${API_BASE_URL}/negocio/${negocioId}/lote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(datosLote)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear lote: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const resultado = await response.json();
            console.log('Lote creado exitosamente:', resultado);
            return resultado;

        } catch (error) {
            console.error('Error en crearLote:', error);
            throw error;
        }
    }

    /**
     * Actualizar un lote existente
     * PUT /negocio/{id}/lote/{registro}
     */
    static async actualizarLote(registroId, datosActualizacion) {
        try {
            const negocioId = sessionStorage.getItem('negocioId') || '1';
            
            // Validar que solo se envíen los campos permitidos según el endpoint
            const camposPermitidos = {
                stockExhibicion: datosActualizacion.stockExhibicion || 0,
                stockMinimo: datosActualizacion.stockMinimo || 0,
                margenGanancia: datosActualizacion.margenGanancia || 0.0
            };

            console.log('Datos a enviar para actualización:', camposPermitidos);
            console.log('Registro ID:', registroId);

            const response = await fetch(`${API_BASE_URL}/negocio/${negocioId}/lote/${registroId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(camposPermitidos)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al actualizar lote: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const resultado = await response.json();
            console.log('Lote actualizado exitosamente:', resultado);
            return resultado;

        } catch (error) {
            console.error('Error en actualizarLote:', error);
            throw error;
        }
    }

    /**
     * Eliminar un lote
     * DELETE /negocio/{id}/lote/{registro}
     */
    static async eliminarLote(registroId) {
        try {
            const negocioId = sessionStorage.getItem('negocioId') || '1';
            
            console.log('Eliminando lote con registro:', registroId);

            const response = await fetch(`${API_BASE_URL}/negocio/${negocioId}/lote/${registroId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al eliminar lote: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // El DELETE puede retornar un mensaje o estar vacío
            let resultado;
            try {
                resultado = await response.json();
            } catch {
                resultado = { message: 'Lote eliminado exitosamente' };
            }

            console.log('Lote eliminado exitosamente:', resultado);
            return resultado;

        } catch (error) {
            console.error('Error en eliminarLote:', error);
            throw error;
        }
    }

    /**
     * Mapear datos del formulario al formato esperado por la API
     */
    static mapearDatosFormularioAAPI(formData) {
        return {
            // Mapear a los nombres que espera el backend según el error
            codigoProducto: formData.codigo || '',
            nombreUsuario: sessionStorage.getItem('nombreUsuario') || 'admin', // Agregar usuario desde session
            stockAlmacen: parseInt(formData.stockAlmacen) || 0,
            stockExhibicion: parseInt(formData.stockExhibicion) || 0,
            stockMinimo: parseInt(formData.stockMinimo) || 0,
            fechaCaducidad: formData.fechaCaducidad || '',
            precioCompra: parseFloat(formData.precioCompra) || 0.0,
            fechaEntrada: formData.fechaEntrada || '',
            margenGanancia: parseFloat(formData.margenGanancia) || 0.0
        };
    }

    /**
     * Mapear datos de la API al formato de la tabla
     */
    static mapearDatosAPIATabla(loteAPI) {
        return {
            // Mapear considerando posibles nombres de campos del backend
            codigo: loteAPI.codigoProducto || loteAPI.codigo || '',
            producto: loteAPI.nombreProducto || loteAPI.producto || 'Producto no encontrado',
            categoria: loteAPI.categoria || 'Sin categoría',
            marca: loteAPI.marca || 'Sin marca', 
            fechaCaducidad: loteAPI.fechaCaducidad || '',
            id: loteAPI.idRegistro || loteAPI.registro || loteAPI.id || '',
            fechaEntrada: loteAPI.fechaEntrada || '',
            fechaSalida: loteAPI.fechaSalida || '-',
            stockAlmacen: loteAPI.stockAlmacen || 0,
            stockExhibicion: loteAPI.stockExhibicion || 0,
            precio: loteAPI.precioCompra || 0.0,
            stockMinimo: loteAPI.stockMinimo || 0,
            margenGanancia: loteAPI.margenGanancia || 0.0
        };
    }

    /**
     * Validar datos antes de enviar
     */
    static validarDatosLote(datos) {
        const errores = [];

        // Validar código de producto (puede ser codigo o codigoProducto)
        const codigo = datos.codigoProducto || datos.codigo;
        if (!codigo || codigo.trim() === '') {
            errores.push('El código del producto es obligatorio');
        }

        if (!datos.fechaEntrada) {
            errores.push('La fecha de entrada es obligatoria');
        }

        if (!datos.fechaCaducidad) {
            errores.push('La fecha de caducidad es obligatoria');
        }

        if (datos.stockMinimo < 0) {
            errores.push('El stock mínimo no puede ser negativo');
        }

        if (datos.precioCompra <= 0) {
            errores.push('El precio de compra debe ser mayor a 0');
        }

        if (datos.margenGanancia < 0) {
            errores.push('El margen de ganancia no puede ser negativo');
        }

        if (datos.stockAlmacen < 0) {
            errores.push('El stock en almacén no puede ser negativo');
        }

        if (datos.stockExhibicion < 0) {
            errores.push('El stock en exhibición no puede ser negativo');
        }

        return errores;
    }

    /**
     * Filtrar lotes por categoría
     */
    static filtrarPorCategoria(lotes, categoria) {
        if (!categoria || categoria === 'all') {
            return lotes;
        }
        return lotes.filter(lote => lote.categoria && lote.categoria.toLowerCase() === categoria.toLowerCase());
    }

    /**
     * Buscar lote por ID de registro
     */
    static buscarLotePorRegistro(lotes, registroId) {
        return lotes.find(lote => lote.id === registroId || lote.registro === registroId);
    }

    /**
     * Formatear fecha para mostrar en la interfaz
     */
    static formatearFecha(fecha) {
        if (!fecha) return '-';
        try {
            const fechaObj = new Date(fecha);
            return fechaObj.toLocaleDateString('es-ES');
        } catch {
            return fecha;
        }
    }

    /**
     * Formatear precio para mostrar en la interfaz
     */
    static formatearPrecio(precio) {
        if (precio === undefined || precio === null) return '$0.00';
        return `$${parseFloat(precio).toFixed(2)}`;
    }
}

// Exportar la clase para uso global
window.InventarioServices = InventarioServices;

// También exportar como módulo ES6 si se usa
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InventarioServices };
}
