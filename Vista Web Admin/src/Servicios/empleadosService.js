document.addEventListener('DOMContentLoaded', () => {
    getEmpleados();
});

// URL base de tu API JAR con ID=1
const API_BASE_URL = 'http://localhost:8080/negocio/1';

export async function getEmpleados() {
    const url_endpoint = `${API_BASE_URL}/empleados`;

    try {
        const response = await fetch(url_endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const empleados = data.empleados; // <- accede a la propiedad correcta
        console.log('Empleados:', empleados);

        let tbody = document.querySelector('.products-table tbody');
        tbody.innerHTML = ''; // Limpiar tabla antes de llenar
        
        empleados.forEach((empleado, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${empleado.nombreUsuario || ''}</td>
        <td>${empleado.correo || 'No especificado'}</td>
        <td>${empleado.calle || ''}, ${empleado.colonia || ''}, CP: ${empleado.codigoPostal || ''}</td>
        <td>${empleado.rol || 'Empleado'}</td>
    `;
    tbody.appendChild(fila);
});

    } catch (error) {
        console.error('Error fetching empleados:', error);
        mostrarError('Error al cargar los empleados');
    }
}

export async function postEmpleado(datos) {
    const url_endpoint = `${API_BASE_URL}/empleado`;

    try {
        const empleadoData = {
            nombreUsuario: datos.nombreUsuario,
            correo: datos.correo,
            contrasena: datos.contrasena,
            rol: datos.rol,
            calle: datos.calle,
            colonia: datos.colonia,
            codigoPostal: datos.codigoPostal
        };

        console.log('Datos a enviar:', empleadoData);

        const response = await fetch(url_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleadoData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const resultado = await response.json();
        console.log('Empleado creado:', resultado);
        await getEmpleados();
        return resultado;
    } catch (error) {
        console.error('Error posting empleado:', error);
        mostrarError('Error al crear el empleado: ' + error.message);
        throw error;
    }
}

export async function putEmpleado(nombre, datos) {
    const url_endpoint = `${API_BASE_URL}/empleado/${encodeURIComponent(nombre)}`;

    try {
        const empleadoData = {
            nombreUsuario: datos.nombreUsuario,
            correo: datos.correo,
            rol: datos.rol,
            calle: datos.calle,
            colonia: datos.colonia,
            codigoPostal: datos.codigoPostal
        };

        // Solo incluir contraseña si se proporcionó
        if (datos.contrasena) {
            empleadoData.contrasena = datos.contrasena;
        }

        const response = await fetch(url_endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleadoData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const resultado = await response.json();
        console.log('Empleado actualizado:', resultado);
        
        // Recargar la lista de empleados
        await getEmpleados();
        
        return resultado;
    } catch (error) {
        console.error('Error updating empleado:', error);
        mostrarError('Error al actualizar el empleado');
        throw error;
    }
}

export async function deleteEmpleado(nombre) {
    const url_endpoint = `${API_BASE_URL}/empleado/${encodeURIComponent(nombre)}`;

    try {
        const response = await fetch(url_endpoint, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Empleado eliminado:', nombre);
        
        // Recargar la lista de empleados
        await getEmpleados();
        
        return true;
    } catch (error) {
        console.error('Error deleting empleado:', error);
        mostrarError('Error al eliminar el empleado');
        throw error;
    }
}

// Función auxiliar para mostrar errores
function mostrarError(mensaje) {
    let snackbar = document.getElementById('snackbar-empleados');
    if (!snackbar) {
        snackbar = document.createElement('div');
        snackbar.id = 'snackbar-empleados';
        snackbar.className = 'snackbar-empleados';
        document.body.appendChild(snackbar);
        
        if (!document.getElementById('snackbar-style-empleados')) {
            const style = document.createElement('style');
            style.id = 'snackbar-style-empleados';
            style.textContent = `
                .snackbar-empleados {
                    min-width: 320px;
                    max-width: 400px;
                    background: #f44336;
                    color: white;
                    text-align: center;
                    border-radius: 18px;
                    padding: 18px 24px;
                    position: fixed;
                    z-index: 4000;
                    right: 32px;
                    bottom: 32px;
                    font-size: 1.1rem;
                    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.4s, bottom 0.4s;
                }
                .snackbar-empleados.show {
                    opacity: 1;
                    pointer-events: auto;
                    bottom: 48px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    snackbar.style.background = '#f44336';
    snackbar.textContent = mensaje;
    snackbar.classList.add('show');
    setTimeout(() => {
        snackbar.classList.remove('show');
    }, 3000);
}