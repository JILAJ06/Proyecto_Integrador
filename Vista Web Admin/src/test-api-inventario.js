// Archivo de prueba para verificar conectividad con el API de inventario

// Configurar variables de sesión para pruebas
sessionStorage.setItem('negocioId', '1');
sessionStorage.setItem('nombreUsuario', 'admin'); // Agregar nombre de usuario

// Función para probar la conexión
async function probarConexionAPI() {
    console.log('=== PRUEBA DE CONEXIÓN API INVENTARIO ===');
    
    try {
        // Probar GET - obtener lotes
        console.log('1. Probando GET /negocio/1/lotes...');
        const lotes = await InventarioServices.obtenerTodosLosLotes();
        console.log('✅ GET exitoso:', lotes);
        
        // Probar POST - crear lote (datos de ejemplo)
        console.log('2. Probando POST /negocio/1/lote...');
        const nuevoLote = {
            codigoProducto: 'TEST001',
            nombreUsuario: 'admin', // Asegurarse de incluir usuario
            stockAlmacen: 20,
            stockExhibicion: 5,
            stockMinimo: 5,
            fechaCaducidad: '2025-12-31',
            precioCompra: 10.50,
            fechaEntrada: '2025-07-21',
            margenGanancia: 25.0
        };
        
        const loteCreado = await InventarioServices.crearLote(nuevoLote);
        console.log('✅ POST exitoso:', loteCreado);
        
        // Obtener el ID del lote creado para las pruebas siguientes
        const registroId = loteCreado.id || loteCreado.registro || 'TEST_ID';
        
        // Probar PUT - actualizar lote
        console.log('3. Probando PUT /negocio/1/lote/' + registroId + '...');
        const datosActualizacion = {
            stockExhibicion: 8,
            stockMinimo: 10,
            margenGanancia: 30.0
        };
        
        const loteActualizado = await InventarioServices.actualizarLote(registroId, datosActualizacion);
        console.log('✅ PUT exitoso:', loteActualizado);
        
        // Probar DELETE - eliminar lote
        console.log('4. Probando DELETE /negocio/1/lote/' + registroId + '...');
        const resultado = await InventarioServices.eliminarLote(registroId);
        console.log('✅ DELETE exitoso:', resultado);
        
        console.log('🎉 ¡TODAS LAS PRUEBAS EXITOSAS!');
        
    } catch (error) {
        console.error('❌ Error en las pruebas:', error);
        console.error('Detalles del error:', {
            message: error.message,
            stack: error.stack
        });
    }
}

// Esperar a que la página cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    // Crear botón de prueba
    const btnPrueba = document.createElement('button');
    btnPrueba.textContent = '🔧 Probar API Inventario';
    btnPrueba.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: #007bff;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    `;
    
    btnPrueba.addEventListener('click', probarConexionAPI);
    document.body.appendChild(btnPrueba);
    
    console.log('Botón de prueba de API agregado. Haz clic en él para probar la conexión.');
});

// Función para verificar el estado del servidor
async function verificarEstadoServidor() {
    try {
        const response = await fetch('http://localhost:8080/health');
        if (response.ok) {
            console.log('✅ Servidor disponible');
            return true;
        } else {
            console.log('⚠️ Servidor responde pero con error:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Servidor no disponible:', error.message);
        return false;
    }
}
