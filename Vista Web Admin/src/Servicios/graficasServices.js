// graficasServices.js

// Asegúrate de tener Chart.js cargado en tu HTML antes de usar esto

export const GraficasServices = {
    async obtenerVentasPorSemana(idNegocio, año) {
        const url = `http://localhost:8080/negocio/${idNegocio}/graficasventa/2025`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener ventas por semana");
        return await res.json();
    },

    async obtenerProductosPorSemana(idNegocio, año) {
        const url = `http://localhost:8080/negocio/${idNegocio}/graficasproducto/${año}`;
        const res = await fetch(url);
        if (!res.ok) {
            const text = await res.text();
            throw new Error("Error al obtener productos más vendidos: " + text);
        }

    }
};

// === Función principal para graficar al cargar la página ===
document.addEventListener("DOMContentLoaded", async () => {
    const idNegocio = sessionStorage.getItem("negocioId") || 1;
    const año = new Date().getFullYear();

    try {
        const ventasSemana = await GraficasServices.obtenerVentasPorSemana(idNegocio, año);
        generarGraficaVentasPorSemana(ventasSemana);

        const productosSemana = await GraficasServices.obtenerProductosPorSemana(idNegocio, año);
        generarGraficaProductosPorSemana(productosSemana);

    } catch (error) {
        console.error("❌ Error al cargar gráficas:", error.message);
    }
});

// === Gráfica de Ventas por Semana ===
function generarGraficaVentasPorSemana(data) {
    const semanas = Object.keys(data);          // ["27", "28"]
    const totales = Object.values(data);        // [292.5, 37.5]

    new Chart(document.getElementById("graficaVentasSemana"), {
        type: "bar",
        data: {
            labels: semanas.map(s => `Semana ${s}`),
            datasets: [{
                label: "Ventas ($)",
                data: totales,
                backgroundColor: "#7ec8e3",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Ventas por Semana"
                },
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: value => `$${value.toLocaleString()}`
                    }
                }
            }
        }
    });
}

// === Gráfica de Producto más vendido por Semana ===
function generarGraficaProductosPorSemana(data) {
    console.log("📦 Datos recibidos:", data);

    const semanas = Object.keys(data); // ["1", "2", "3", ...]
    const cantidades = semanas.map(sem => data[sem].cantidadVendida);
    const nombres = semanas.map(sem => data[sem].nombreProducto + " (" + data[sem].variedad + ")");

    new Chart(document.getElementById("graficaProductosSemana"), {
        type: "bar",
        data: {
            labels: semanas.map(s => `Semana ${s}`),
            datasets: [{
                label: "Unidades vendidas",
                data: cantidades,
                backgroundColor: "#90caf9",
                borderRadius: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Producto más Vendido por Semana"
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${nombres[ctx.dataIndex]}: ${ctx.raw} unidades`
                    }
                },
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
