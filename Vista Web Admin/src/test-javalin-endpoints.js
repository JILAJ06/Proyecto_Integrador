// test-javalin-endpoints.js - Descubrir endpoints funcionales de Javalin

async function descubrirEndpointsJavalin() {
    const API_BASE_URL = 'http://localhost:8080';
    const negocioId = '1';
    
    console.log('🔍 Descubriendo endpoints funcionales de Javalin...');
    
    // Lista de endpoints comunes en Javalin para probar
    const endpointsParaProbar = [
        // Ventas
        { metodo: 'GET', url: `/venta`, descripcion: 'Obtener ventas' },
        { metodo: 'POST', url: `/venta`, descripcion: 'Crear venta' },
        { metodo: 'GET', url: `/ventas`, descripcion: 'Obtener todas las ventas' },
        { metodo: 'POST', url: `/ventas`, descripcion: 'Crear nueva venta' },
        
        // Productos
        { metodo: 'GET', url: `/productos`, descripcion: 'Obtener productos' },
        { metodo: 'GET', url: `/producto`, descripcion: 'Obtener producto' },
        { metodo: 'GET', url: `/producto/123456`, descripcion: 'Producto por código' },
        
        // Con negocio ID (como vimos en inventario)
        { metodo: 'GET', url: `/negocio/${negocioId}/venta`, descripcion: 'Venta por negocio' },
        { metodo: 'POST', url: `/negocio/${negocioId}/venta`, descripcion: 'Crear venta por negocio' },
        { metodo: 'GET', url: `/negocio/${negocioId}/producto/123456`, descripcion: 'Producto por negocio' },
        { metodo: 'GET', url: `/negocio/${negocioId}/productos`, descripcion: 'Productos por negocio' },
        
        // Otros patrones
        { metodo: 'GET', url: `/api/venta`, descripcion: 'API Venta' },
        { metodo: 'GET', url: `/api/productos`, descripcion: 'API Productos' },
    ];
    
    const endpointsFuncionales = [];
    
    for (const endpoint of endpointsParaProbar) {
        try {
            console.log(`\n🧪 Probando: ${endpoint.metodo} ${endpoint.url}`);
            
            const opciones = {
                method: endpoint.metodo,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };
            
            // Agregar body para métodos POST
            if (endpoint.metodo === 'POST') {
                opciones.body = JSON.stringify({});
            }
            
            const response = await fetch(`${API_BASE_URL}${endpoint.url}`, opciones);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`✅ ${endpoint.descripcion}: FUNCIONA`);
                console.log(`   Respuesta:`, data);
                endpointsFuncionales.push({...endpoint, respuesta: data});
            } else if (response.status === 405) {
                console.log(`⚠️ ${endpoint.descripcion}: Método no permitido (endpoint existe)`);
            } else if (response.status === 404) {
                console.log(`❌ ${endpoint.descripcion}: No encontrado`);
            } else {
                const errorText = await response.text();
                console.log(`⚠️ ${endpoint.descripcion}: Error ${response.status} - ${errorText}`);
            }
            
            // Pequeña pausa para no saturar el servidor
            await new Promise(resolve => setTimeout(resolve, 100));
            
        } catch (error) {
            console.error(`💥 Error al probar ${endpoint.url}:`, error.message);
        }
    }
    
    console.log('\n📊 RESUMEN DE ENDPOINTS FUNCIONALES:');
    if (endpointsFuncionales.length > 0) {
        endpointsFuncionales.forEach(ep => {
            console.log(`✅ ${ep.metodo} ${ep.url} - ${ep.descripcion}`);
        });
    } else {
        console.log('❌ No se encontraron endpoints funcionales');
    }
    
    return endpointsFuncionales;
}

// Probar endpoints específicos que sabemos que funcionaron
async function probarEndpointsConocidos() {
    const API_BASE_URL = 'http://localhost:8080';
    const negocioId = '1';
    
    console.log('\n🎯 Probando endpoints que sabemos que funcionan...');
    
    try {
        // Este sabemos que funcionó en la prueba anterior
        console.log('\n1️⃣ Probando consultar producto...');
        const responseProducto = await fetch(`${API_BASE_URL}/negocio/${negocioId}/producto/123456`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (responseProducto.ok) {
            const producto = await responseProducto.json();
            console.log('✅ Producto consultado exitosamente:', producto);
        } else {
            console.log('❌ Error al consultar producto:', responseProducto.status);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
    
    try {
        // Este también funcionó
        console.log('\n2️⃣ Probando obtener total...');
        const responseTotal = await fetch(`${API_BASE_URL}/negocio/${negocioId}/venta/total`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (responseTotal.ok) {
            const total = await responseTotal.json();
            console.log('✅ Total obtenido exitosamente:', total);
        } else {
            console.log('❌ Error al obtener total:', responseTotal.status);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}

// Ejecutar cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    // Reemplazar el botón anterior
    const botonAnterior = document.querySelector('button');
    if (botonAnterior && botonAnterior.textContent.includes('Probar Endpoints')) {
        botonAnterior.remove();
    }
    
    // Agregar botones de prueba
    const contenedorBotones = document.createElement('div');
    contenedorBotones.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 5px;
    `;
    
    const botonDescubrir = document.createElement('button');
    botonDescubrir.textContent = '🔍 Descubrir Endpoints';
    botonDescubrir.style.cssText = `
        padding: 8px 12px;
        background: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 11px;
    `;
    botonDescubrir.addEventListener('click', descubrirEndpointsJavalin);
    
    const botonConocidos = document.createElement('button');
    botonConocidos.textContent = '🎯 Probar Conocidos';
    botonConocidos.style.cssText = `
        padding: 8px 12px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 11px;
    `;
    botonConocidos.addEventListener('click', probarEndpointsConocidos);
    
    contenedorBotones.appendChild(botonDescubrir);
    contenedorBotones.appendChild(botonConocidos);
    document.body.appendChild(contenedorBotones);
    
    console.log('🔧 Test de Javalin cargado. Usa los botones para descubrir endpoints.');
});
