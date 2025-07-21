// ventasServices.js - Servicios para gestión de ventas con Javalin

const API_BASE_URL = 'http://localhost:8080'; // Ajusta según tu configuración

// Clase para manejar servicios de ventas
class VentasServices {
    
    /**
     * PASO 1: Iniciar una nueva venta
     * POST /negocio/{id}/venta/{nombreUsuario}
     */
    static async iniciarVenta() {
        try {
            // Obtener datos desde sessionStorage
            const negocioId = sessionStorage.getItem('negocioId') || '1';
            const nombreUsuario = sessionStorage.getItem('nombreUsuario') || 'admin';
            
            console.log('Iniciando nueva venta para usuario:', nombreUsuario, 'negocio:', negocioId);

            const response = await fetch(`${API_BASE_URL}/negocio/${negocioId}/venta/${nombreUsuario}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al iniciar venta: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const resultado = await response.json();
            console.log('Venta iniciada exitosamente:', resultado);
            
            // Guardar ID de venta en sessionStorage para uso posterior
            if (resultado.idVenta || resultado.id) {
                sessionStorage.setItem('ventaActualId', resultado.idVenta || resultado.id);
            }
            
            return resultado;

        } catch (error) {
            console.error('Error en iniciarVenta:', error);
            throw error;
        }
    }

    /**
     * PASO 2: Consultar producto por código (para escaneo)
     * GET /negocio/{id}/venta/lote/{codigoProducto}
     */
    static async consultarProductoPorCodigo(codigoProducto) {
        try {
            const negocioId = sessionStorage.getItem('negocioId') || '1';
            
            console.log('Consultando producto con código:', codigoProducto);

            const response = await fetch(`${API_BASE_URL}/negocio/${negocioId}/venta/lote/${codigoProducto}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al consultar producto: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const producto = await response.json();
            console.log('Producto consultado:', producto);
            
            return producto;

        } catch (error) {
            console.error('Error en consultarProductoPorCodigo:', error);
            throw error;
        }
    }

    /**
     * PASO 3: Guardar detalles de venta (array de productos)
     * POST /negocio/venta/detalles
     */
    static async guardarDetallesVenta(detallesVenta) {
        try {
            console.log('Guardando detalles de venta:', detallesVenta);

            const response = await fetch(`${API_BASE_URL}/negocio/venta/detalles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(detallesVenta)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al guardar detalles: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const resultado = await response.json();
            console.log('Detalles de venta guardados exitosamente:', resultado);
            
            return resultado;

        } catch (error) {
            console.error('Error en guardarDetallesVenta:', error);
            throw error;
        }
    }

    /**
     * PASO 4: Obtener total de la venta
     * GET /negocio/{id}/venta/total
     */
    static async obtenerTotalVenta() {
        try {
            const negocioId = sessionStorage.getItem('negocioId') || '1';
            
            console.log('Obteniendo total de venta...');

            const response = await fetch(`${API_BASE_URL}/negocio/${negocioId}/venta/total`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al obtener total: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const total = await response.json();
            console.log('Total de venta obtenido:', total);
            
            return total;

        } catch (error) {
            console.error('Error en obtenerTotalVenta:', error);
            throw error;
        }
    }

    /**
     * PASO 5: Cancelar venta (eliminar última venta)
     * DELETE /negocio/{id}/venta
     */
    static async cancelarVenta() {
        try {
            const negocioId = sessionStorage.getItem('negocioId') || '1';
            
            console.log('Cancelando venta...');

            const response = await fetch(`${API_BASE_URL}/negocio/${negocioId}/venta`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al cancelar venta: ${response.status} ${response.statusText} - ${errorText}`);
            }

            // Limpiar sessionStorage
            sessionStorage.removeItem('ventaActualId');
            
            console.log('Venta cancelada exitosamente');
            
            return { message: 'Venta cancelada exitosamente' };

        } catch (error) {
            console.error('Error en cancelarVenta:', error);
            throw error;
        }
    }

    /**
     * Mapear producto consultado al formato requerido para detalles de venta
     * Formato específico según tu flujo:
     * {
     *   "idRegistro": number,
     *   "codigoProducto": string,
     *   "nombreProducto": string,
     *   "precioUnitario": number,
     *   "cantidad": number,
     *   "subtotal": number
     * }
     */
    static mapearProductoADetalleVenta(producto, cantidad = 1) {
        const precioUnitario = parseFloat(producto.precioUnitario || producto.precio || producto.precioventa || 0);
        const subtotal = precioUnitario * cantidad;
        
        return {
            idRegistro: parseInt(producto.idRegistro || producto.id || Math.floor(Math.random() * 10000)),
            codigoProducto: producto.codigoProducto || producto.codigo || '',
            nombreProducto: producto.nombreProducto || producto.nombre || 'Sin nombre',
            precioUnitario: precioUnitario,
            cantidad: parseFloat(cantidad),
            subtotal: parseFloat(subtotal.toFixed(2))
        };
    }

    /**
     * Calcular totales de la venta
     */
    static calcularTotales(listaProductos) {
        const subtotal = listaProductos.reduce((total, item) => total + item.subtotal, 0);
        const impuestos = subtotal * 0.16; // 16% IVA
        const total = subtotal + impuestos;
        const cantidadItems = listaProductos.reduce((total, item) => total + item.cantidad, 0);
        
        return {
            subtotal: parseFloat(subtotal.toFixed(2)),
            impuestos: parseFloat(impuestos.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            cantidadItems: parseInt(cantidadItems)
        };
    }

    /**
     * Formatear precio como moneda
     */
    static formatearPrecio(valor) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(valor || 0);
    }

    /**
     * Generar número de ticket único
     */
    static generarNumeroTicket() {
        const fecha = new Date();
        const timestamp = fecha.getTime();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `TKT-${timestamp}-${random}`;
    }

    /**
     * Validar datos de producto para venta
     */
    static validarProductoParaVenta(producto, cantidad) {
        const errores = [];
        
        if (!producto.codigoProducto && !producto.codigo) {
            errores.push('El producto debe tener un código');
        }
        
        if (!producto.precioUnitario && !producto.precio && !producto.precioventa) {
            errores.push('El producto debe tener un precio');
        }
        
        if (cantidad <= 0) {
            errores.push('La cantidad debe ser mayor a 0');
        }
        
        return errores;
    }
}

// Para compatibilidad con sistemas que no usan modules, hacer disponible globalmente
if (typeof window !== 'undefined') {
    window.VentasServices = VentasServices;
}
