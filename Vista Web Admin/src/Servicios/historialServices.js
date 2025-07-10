document.addEventListener('DOMContentLoaded', () =>{
    getHistorial();
});

export async function getHistorial() {
    const url_endpoint = 'https://jsonplaceholder.typicode.com/users'; // Replace with your actual API endpoint

    try {
        const response = await fetch(url_endpoint);
        const empleados = await response.json();

        let tbody = document.querySelector('.historial-table tbody');
        empleados.forEach(h => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
            <td>${h.fecha}</td><td>${h.id_venta}</td><td>${h.producto}</td><td>${h.categoria}</td><td>${h.cantidad}</td><td>${h.total}</td>`
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error fetching historial:', error);
    }
}

