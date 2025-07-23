// graficasServices.js
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
        negocioId = 1;
        sessionStorage.setItem('negocioId', negocioId.toString());
    }
    
    const resultado = parseInt(negocioId);
    console.log('ID de negocio para API:', resultado);
    return resultado;
}

// Asegúrate de tener Chart.js cargado en tu HTML antes de usar esto

export const GraficasServices = {
    async obtenerVentasPorSemana(idNegocio, año) {
        idNegocio = getNegocioId();
        const url = `http://localhost:8080/negocio/${idNegocio}/graficasventa/${año}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener ventas por semana");
        return await res.json();
    },

    async obtenerProductosPorSemana(idNegocio, año) {
        idNegocio = getNegocioId();
        const url = `http://localhost:8080/negocio/${idNegocio}/graficasproducto`;
        const res = await fetch(url);
        if (!res.ok) {
            const text = await res.text();
            throw new Error("Error al obtener productos más vendidos: " + text);
        }
        // ✅ AGREGAR ESTA LÍNEA QUE FALTABA
        return await res.json();
    }
};

// === Función principal para graficar al cargar la página ===
document.addEventListener("DOMContentLoaded", async () => {
    const año = new Date().getFullYear();
    const idNegocio = getNegocioId();

    try {
        const ventasSemana = await GraficasServices.obtenerVentasPorSemana(idNegocio, año);
        generarGraficaVentasPorSemana(ventasSemana);

        const productosSemana = await GraficasServices.obtenerProductosPorSemana(idNegocio, año);
        generarGraficaProductosPorSemana(productosSemana);

    } catch (error) {
        console.error("❌ Error al cargar gráficas:", error.message);
        window.mostrarAlertaGlobal('Error al cargar gráficas: ' + error.message, 'error');
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
    console.log("📦 Datos recibidos COMPLETOS:", data);

    const semanas = Object.keys(data);
    console.log("🗓️ Semanas encontradas:", semanas);
    
    // ✅ CORRECCIÓN: Los valores son directamente las cantidades
    const cantidades = semanas.map(sem => {
        const valor = data[sem];
        console.log(`🔢 Procesando semana ${sem} - Valor directo:`, valor);
        
        // El valor ES directamente la cantidad
        let cantidad = parseInt(valor) || 0;
        
        console.log(`   ✅ Cantidad final: ${cantidad}`);
        return cantidad;
    });
    
    // Para los nombres, usar las claves (que parecen ser los nombres de productos)
    const nombres = semanas.map(sem => {
        return sem; // "Papel de baño", "Chips", "Monster"
    });

    console.log("📊 Cantidades procesadas FINALES:", cantidades);
    console.log("🏷️ Nombres procesados FINALES:", nombres);

    new Chart(document.getElementById("graficaProductosSemana"), {
        type: "bar",
        data: {
            labels: nombres, // Usar directamente los nombres de productos
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
                    text: "Productos Más Vendidos"
                },
                tooltip: {
                    callbacks: {
                        label: ctx => `${ctx.label}: ${ctx.raw} unidades`
                    }
                },
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        callback: function(value) {
                            if (Number.isInteger(value)) {
                                return value;
                            }
                        }
                    },
                    suggestedMax: Math.max(...cantidades) + 5
                }
            }
        }
    });
}
