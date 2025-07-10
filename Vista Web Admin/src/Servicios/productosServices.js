document.addEventListener('DOMContentLoaded', () => {
    getProductos();
});

export async function getProductos() {
    const url_endpoint = 'https://jsonplaceholder.typicode.com/user'; // Replace with your actual API endpoint

    try{
        const response = await fetch(url_endpoint);
        const productos = await response.json();
        
        let tbody = document.querySelector('.products-table tbdoy');
        productos.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
            <td>${producto.id}</td><td>${producto.cat}</td><td>${producto.marca}</td>
            <td>${producto.producto}</td><td>${producto.envase}</td><td>${producto.variedad}</td>
            <td>${producto.cont_neto}</td><td>${producto.medida}</td><td>${producto.Precio}</td>`
            tbody.appendChild(fila);
        });
    }catch(e){
        console.error('Error fetching productos:', e);
    }
}