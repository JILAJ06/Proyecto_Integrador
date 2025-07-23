// ventasServices.js - Servicios de conexión con API REST de ventas

export const VentasServices = {
    // Accede dinámicamente a los datos de sesión
    get idNegocio() {
        const sesion = window.obtenerDatosSesion?.();
        return sesion ? parseInt(sesion.idNegocio) : null;
    },

    get nombreUsuario() {
        const sesion = window.obtenerDatosSesion?.();
        return sesion?.nombreUsuario || null;
    },

    async iniciarVenta() {
    try {
        if (!this.idNegocio || !this.nombreUsuario) {
            throw new Error("No hay sesión activa para iniciar venta");
        }

        const url = `https://clinkapp.zapto.org:8080/negocio/${this.idNegocio}/venta/${this.nombreUsuario}`;
        const res = await fetch(url, { method: "POST" });

        if (!res.ok) {
            throw new Error("No se pudo iniciar venta");
        }

        const text = await res.text();
        if (!text) return {};
        return JSON.parse(text);
    } catch (error) {
        window.mostrarAlertaGlobal('Error al iniciar venta: ' + error.message, 'error');
        throw error;
    }
    },


    async consultarProductoPorCodigo(codigoProducto) {
        try {
            const url = `https://clinkapp.zapto.org :8080/negocio/${this.idNegocio}/venta/lote/${codigoProducto}`;
            const res = await fetch(url);
            console.log(res);

            if (!res.ok) {
                throw new Error("Producto no encontrado");
            }

            return await res.json();
        } catch (error) {
            window.mostrarAlertaGlobal('Error al consultar producto: ' + error.message, 'error');
            throw error;
        }
    },

    async guardarDetallesVenta(listaDetalles) {
        try {
            const url = `https://clinkapp.zapto.org:8080/negocio/venta/detalles`;
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(listaDetalles)
            });

            if (!res.ok) {
                throw new Error("Error al guardar detalles de venta");
            }

            const text = await res.text();

            try {
                return JSON.parse(text);
            } catch (e) {
                return { mensaje: text }; // lo que haya devuelto el servidor
            }
        } catch (error) {
            window.mostrarAlertaGlobal('Error al guardar detalles de venta: ' + error.message, 'error');
            throw error;
        }

    },

    async cancelarVenta() {
        try {
            const url = `https://clinkapp.zapto.org:8080/negocio/${this.idNegocio}/venta`;
            const res = await fetch(url, { method: "DELETE" });

            if (!res.ok) {
                throw new Error("Error al cancelar venta");
            }

            return await res.json();
        } catch (error) {
            window.mostrarAlertaGlobal('Error al cancelar venta: ' + error.message, 'error');
            throw error;
        }
    },

    async obtenerTotalVenta() {
        try {
            const url = `https://clinkapp.zapto.org:8080/negocio/${this.idNegocio}/venta/total`;
            const res = await fetch(url);

            if (!res.ok) {
                throw new Error("No se pudo obtener total de la venta");
            }

            return await res.json();
        } catch (error) {
            window.mostrarAlertaGlobal('Error al obtener total de la venta: ' + error.message, 'error');
            throw error;
        }
    },

    mapearProductoADetalleVenta(producto, cantidad) {
    const precioUnitario = parseFloat(
    producto.precioVentaActual || producto.precio || producto.Precio || producto.precio_unitario || producto.precioUnitario || 0
    );

    const subtotal = parseFloat((cantidad * precioUnitario).toFixed(2));

    return {
        idRegistro: producto.idRegistro || producto.ID_Registro || producto.idRegistroLote || Date.now(),
        codigoProducto: producto.codigoProducto || producto.Codigo_Prod || producto.codigo || producto.codigoBarras,
        nombreProducto: producto.nombreProducto || producto.Nombre_Prod || producto.nombre,
        precioUnitario,
        cantidad,
        subtotal
    };
},



    calcularTotales(lista) {
        const subtotal = lista.reduce((sum, item) => sum + item.subtotal, 0);
        const total = +(subtotal).toFixed(2);
        const cantidadItems = lista.reduce((sum, item) => sum + item.cantidad, 0);

        return { subtotal, total, cantidadItems };
    },

    formatearPrecio(valor) {
        return `$${parseFloat(valor).toFixed(2)}`;
    },

    generarNumeroTicket() {
        return "T-" + Math.floor(Math.random() * 100000);
    },

    // Agregar esta función para obtener el ID de la venta actual
    getVentaActualId() {
        // Esto depende de cómo manejes las ventas en tu aplicación
        // Puede ser que tengas que almacenar el ID cuando inicias una venta
        return ventaActualId || null; // Necesitarás implementar esto según tu lógica
    }
};
