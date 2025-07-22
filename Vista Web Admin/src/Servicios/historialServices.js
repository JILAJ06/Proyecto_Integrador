const BASE_URL = "http://localhost:8080"; // Ajusta el puerto o dominio si es necesario

// Obtener historial de ventas para un negocio específico
export async function obtenerHistorialVentas(idNegocio) {
    try {
        const response = await fetch(`${BASE_URL}/negocio/${idNegocio}/historial`);
        console.log(response);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener historial de ventas:", error);
        return null;
    }
}

// Obtener resumen mensual de ventas
export async function obtenerResumenMensual(idNegocio) {
    try {
        const response = await fetch(`${BASE_URL}/negocio/${idNegocio}/historial/mensual`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Error al obtener resumen mensual:", error);
        return null;
    }
}
