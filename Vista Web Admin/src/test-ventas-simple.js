// test-ventas-simple.js - Prueba rápida de endpoints de ventas

async function probarEndpointsVentas() {
    const API_BASE_URL = 'http://localhost:8080';
    const negocioId = '1'; // ID por defecto del negocio
    
    console.log('🧪 Iniciando pruebas de endpoints de ventas...');
    console.log('📍 Usando negocio ID:', negocioId);
    
    try {
        // PASO 1: Probar iniciar venta
        console.log('\n1️⃣ Probando iniciar venta...');
        const responseIniciar = await fetch(`${API_BASE_URL}/negocio/${negocioId}/venta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (responseIniciar.ok) {
            const resultadoIniciar = await responseIniciar.json();
            console.log('✅ Venta iniciada:', resultadoIniciar);
        } else {
            const errorText = await responseIniciar.text();
            console.error('❌ Error al iniciar venta:', responseIniciar.status, errorText);
        }
        
    } catch (error) {
        console.error('❌ Error de conexión al iniciar venta:', error);
    }
    
    try {
        // PASO 2: Probar consultar producto (usar un código de ejemplo)
        console.log('\n2️⃣ Probando consultar producto...');
        const codigoEjemplo = '123456'; // Cambia por un código que exista en tu BD
        
        const responseConsultar = await fetch(`${API_BASE_URL}/negocio/${negocioId}/producto/${codigoEjemplo}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (responseConsultar.ok) {
            const producto = await responseConsultar.json();
            console.log('✅ Producto consultado:', producto);
        } else {
            const errorText = await responseConsultar.text();
            console.error('❌ Error al consultar producto:', responseConsultar.status, errorText);
        }
        
    } catch (error) {
        console.error('❌ Error de conexión al consultar producto:', error);
    }
    
    try {
        // PASO 3: Probar obtener total
        console.log('\n3️⃣ Probando obtener total...');
        
        const responseTotal = await fetch(`${API_BASE_URL}/negocio/${negocioId}/venta/total`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        
        if (responseTotal.ok) {
            const total = await responseTotal.json();
            console.log('✅ Total obtenido:', total);
        } else {
            const errorText = await responseTotal.text();
            console.error('❌ Error al obtener total:', responseTotal.status, errorText);
        }
        
    } catch (error) {
        console.error('❌ Error de conexión al obtener total:', error);
    }
    
    try {
        // PASO 4: Probar guardar detalles (con datos de ejemplo)
        console.log('\n4️⃣ Probando guardar detalles...');
        
        const detallesEjemplo = [
            {
                codigoProducto: "123456",
                nombreProducto: "Producto Ejemplo",
                precioUnitario: 10.50,
                cantidad: 2,
                subtotal: 21.00
            }
        ];
        
        const responseDetalles = await fetch(`${API_BASE_URL}/negocio/${negocioId}/venta/detalles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(detallesEjemplo)
        });
        
        if (responseDetalles.ok) {
            const resultado = await responseDetalles.json();
            console.log('✅ Detalles guardados:', resultado);
        } else {
            const errorText = await responseDetalles.text();
            console.error('❌ Error al guardar detalles:', responseDetalles.status, errorText);
        }
        
    } catch (error) {
        console.error('❌ Error de conexión al guardar detalles:', error);
    }
    
    console.log('\n🏁 Pruebas de endpoints completadas');
}

// Ejecutar pruebas cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    // Agregar botón de prueba al DOM
    const botonPrueba = document.createElement('button');
    botonPrueba.textContent = '🧪 Probar Endpoints';
    botonPrueba.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 10px 15px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10000;
        font-size: 12px;
    `;
    
    botonPrueba.addEventListener('click', probarEndpointsVentas);
    document.body.appendChild(botonPrueba);
    
    console.log('Test de ventas cargado. Haz clic en el botón verde para probar endpoints.');
});
