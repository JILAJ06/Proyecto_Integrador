const BASE_URL = "http://localhost:8080"; // Ajusta el puerto o dominio si es necesario

function getNegocioId() {
    // Intentar usar la función global primero
    if (typeof window !== 'undefined' && window.obtenerIdNegocio) {
        return window.obtenerIdNegocio();
    }
    
    // Fallback: buscar directamente en sessionStorage
    let negocioId = sessionStorage.getItem('negocioId') || 
                   sessionStorage.getItem('idNegocio') ||
                   sessionStorage.getItem('id_negocio');
    
    if (!negocioId) {
        console.error('No se encontró el ID del negocio en sessionStorage');
        console.log('Creando ID de negocio por defecto...');
        negocioId = 1; // Valor por defecto
        sessionStorage.setItem('negocioId', negocioId.toString());
    }
    
    const resultado = parseInt(negocioId);
    console.log('ID de negocio para API:', resultado);
    return resultado;
}

// Obtener historial de ventas para un negocio específico
export async function obtenerHistorialVentas() {
    const negocioId = getNegocioId(); // Obtener el ID del negocio desde sessionStorage
    try {
        const response = await fetch(`${BASE_URL}/negocio/${negocioId}/historial`);
        console.log(response);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener historial de ventas:", error);
        window.mostrarAlertaGlobal('Error al obtener historial de ventas: ' + error.message, 'error');
        return null;
    }
}

// Obtener resumen mensual de ventas
export async function obtenerResumenMensual() {
    const negocioId = getNegocioId(); // Obtener el ID del negocio desde sessionStorage
    try {
        const response = await fetch(`${BASE_URL}/negocio/${negocioId}/historial/mensual`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener resumen mensual:", error);
        window.mostrarAlertaGlobal('Error al obtener resumen mensual: ' + error.message, 'error');
        return null;
    }
}
