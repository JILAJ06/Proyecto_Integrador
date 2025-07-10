document.addEventListener('DOMContentLoaded', () => {
    getClientes();
});

export async function getClientes() {
    const url_endpoint = 'https://jsonplaceholder.typicode.com/users'; // Replace with your actual API endpoint

    try{ 
        const response = await fetch(url_endpoint);
        const cliente = await response.json();
        console.log(cliente);

        let tbody = document.querySelector('.clientes-table tbody');

        cliente.forEach(user =>{
            const fila =  document.createElement('tr');
            fila.innerHTML =  `
            <td>${user.id}</td><td>${user.name}</td>`;
            tbody.appendChild(fila);
        });

    }catch (error) {
        console.error('Error fetching clientes:', error);
    };
}

export async function postClientes(datos) {
    const url_endpoint = 'https://jsonplaceholder.typicode.com/users'; // Replace with your actual API endpoint\

    try{
        const response = await fetch(url_endpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const cliente = await response.json();
    }catch (e) {
        console.error('Error posting cliente:', e);
    }
}
