document.addEventListener('DOMContentLoaded', () =>{
    getEmpleados();
});

export async function getEmpleados() {
    const url_endpoint = 'https://jsonplaceholder.typicode.com/users'; // Replace with your actual API endpoint

    try {
        const response = await fetch(url_endpoint);
        const empleados = await response.json();
        const direccion =  `${empleado.calle}, ${empleado.colonia}, ${empleado.codigo_postal}`;

        let tbody = document.querySelector('.empleados-table tbody');
        empleados.forEach(empleado => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
            <td>${empleado.id}</td><td>${empleado.nombre}</td><td>${empleado.telefono}</td>
            <td>${direccion}</td>`;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error fetching empleados:', error);
    }
}

export async function postEmpleados(datos) {
    const url_endpoint = 'https://jsonplaceholder.typicode.com/users'; // Replace with your actual API endpoint\

    try{
        //quitar este comentario despues de acabar los formularios
        /*const datos = {
        nombre: document.querySelector('#nombre').value,
        telefono: document.querySelector('#correo').value,
        rol: document.querySelector('#rol').value,
        calle: document.querySelector('#calle').value,
        colonia: document.querySelector('#colonia').value,
        codigo_postal: document.querySelector('#codigo_postal').value
        contrasena: document.querySelector('#contrasena').value
        };*/

        const response = await fetch(url_endpoint, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        const cliente = await response.json();
    }catch (e) {
        console.error('Error posting empleado:', e);
    }
}