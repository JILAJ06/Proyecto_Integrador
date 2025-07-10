document.addEventListener('DOMContentLoaded', () => {
    getInventario();
});

export  async function getInventario() {
    const url_endpoint = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your actual API endpoint

    try {
        const response = await fetch(url_endpoint);
        const inventario = await response.json();
        
        let tbody = document.querySelector('.inventario-table tbody');
        inventario.forEach(i => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
            <td>${i.codigo}</td><td>${i.producto}</td><td>${i.categoria}</td><td>${i.marca}</td>
            <td>${i.fechaCAD}</td><td>${i.id_registro}</td><td>${i.fecha_emtrada}</td><td${i.fecha_sal}></td>
            <td>${i.stock_alm}</td><td>${i.stock_exhi}</td><td>${i.precio}</td>`;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error fetching inventario:', error);
    }
}

export async function postInventario(datos) {
    const url_endpoint = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your actual API endpoint

    try {
        //quitar este comentario despues de acabar los formularios
        /*const datos = {
        nombre: document.querySelector('#nombre').value,
        telefono: document.querySelector('#telefono').value,
        direccion: document.querySelector('#direccion').value
        };*/

        const response = await fetch(url_endpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const inventario = await response.json();
        console.log('Inventario posted:', inventario);
    } catch (e) {
        console.error('Error posting inventario:', e);
    }
}