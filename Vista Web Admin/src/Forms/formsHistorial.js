import { obtenerHistorialVentas, obtenerResumenMensual } from '../Servicios/historialServices.js';

const idNegocio = sessionStorage.getItem("idNegocio");

obtenerHistorialVentas(idNegocio).then(historial => {
    if (!historial) return;

    const cuerpoTabla = document.getElementById("bodyHistorial");
    cuerpoTabla.innerHTML = ""; // limpia antes de insertar

    historial.forEach(venta => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${venta.fecha}</td>
            <td>${venta.idVenta}</td>
            <td>${venta.producto}</td>
            <td>${venta.categoria}</td>
            <td>${venta.cantidad}</td>
            <td>$${venta.total.toFixed(2)}</td>
        `;

        cuerpoTabla.appendChild(fila);
    });
});

// Obtener resumen mensual
obtenerResumenMensual(idNegocio).then(data => {
    console.log("Resumen mensual:", data);
    // Aquí puedes mostrar gráficos, resúmenes, etc.
});
