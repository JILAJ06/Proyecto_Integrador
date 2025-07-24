document.addEventListener('DOMContentLoaded', () => {
    getEmpleados();
});

// Función para obtener datos de sesión
function obtenerDatosSesion() {
    const sesionActiva = sessionStorage.getItem('clink_sesion_activa');
    return sesionActiva ? JSON.parse(sesionActiva) : null;
}

// Función para obtener API URL dinámica
function obtenerAPIBaseURL() {
    const sesion = obtenerDatosSesion();
    if (sesion && sesion.idNegocio) {
        return `http://localhost:8080/negocio/${sesion.idNegocio}`;
    }
    return sessionStorage.getItem('clink_api_base_url') || 'http://localhost:8080/negocio/1';
}

// URL base dinámica
const API_BASE_URL = obtenerAPIBaseURL();

export async function getEmpleados() {
    const url_endpoint = `${API_BASE_URL}/empleados`;

    try {
        const response = await fetch(url_endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const empleados = data.empleados;
        console.log('Empleados:', empleados);

        let tbody = document.querySelector('.products-table tbody');
        if (tbody) {
            tbody.innerHTML = '';
            empleados.forEach(empleado => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${empleado.nombreUsuario}</td>
                    <td>${empleado.correo}</td>
                    <td>${empleado.calle}, ${empleado.colonia}, ${empleado.codigoPostal}</td>
                `;
            });
        }
    } catch (error) {
        console.error('Error fetching empleados:', error);
        window.mostrarAlertaGlobal('Error al cargar los empleados', 'error');
    }
}

export async function postEmpleado(datos) {
    const url_endpoint = `${API_BASE_URL}/empleado`;

    try {
        // Obtener datos de la sesión actual
        const sesion = obtenerDatosSesion();
        
        if (!sesion) {
            throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
        }

        // Estructura que incluye el negocio como objeto anidado
        const empleadoData = {
            nombreUsuario: datos.nombreUsuario,
            correo: datos.correo,
            contrasena: datos.contrasena,
            rol: datos.rol,
            calle: datos.calle,
            colonia: datos.colonia,
            codigoPostal: datos.codigoPostal,
            negocio: {
                idNegocio: parseInt(sesion.idNegocio)
            },
            creador: {
                nombreUsuario: sesion.nombreUsuario
            }
        };

        console.log('Datos a enviar:', empleadoData);
        console.log('Sesión actual:', sesion);

        const response = await fetch(url_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleadoData)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            let errorText;
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = 'No se pudo leer la respuesta del servidor';
            }
            
            console.error('Error response:', errorText);
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        // Verificar si la respuesta tiene contenido JSON válido
        const contentType = response.headers.get('content-type');
        let resultado;
        
        if (contentType && contentType.includes('application/json')) {
            try {
                resultado = await response.json();
            } catch (e) {
                resultado = { 
                    message: 'Empleado creado exitosamente',
                    nombreUsuario: empleadoData.nombreUsuario 
                };
            }
        } else {
            resultado = { 
                message: 'Empleado creado exitosamente',
                nombreUsuario: empleadoData.nombreUsuario 
            };
        }
        
        console.log('Empleado creado:', resultado);
        await getEmpleados();
        window.mostrarAlertaGlobal('Empleado creado exitosamente', 'success');
        return resultado;
        
    } catch (error) {
        console.error('Error posting empleado:', error);
        window.mostrarAlertaGlobal('Error al crear el empleado: ' + error.message, 'error');
        throw error;
    }
}

export async function putEmpleado(nombre, datos) {
    const url_endpoint = `${API_BASE_URL}/empleado/${encodeURIComponent(nombre)}`;

    try {
        // Estructura simplificada para actualización
        const empleadoData = {
            nombreUsuario: datos.nombreUsuario,
            correo: datos.correo,
            rol: datos.rol,
            calle: datos.calle,
            colonia: datos.colonia,
            codigoPostal: datos.codigoPostal
        };

        // Solo incluir contraseña si se proporcionó
        if (datos.contrasena && datos.contrasena.trim() !== '') {
            empleadoData.contrasena = datos.contrasena;
        }

        console.log('Datos a actualizar:', empleadoData);

        const response = await fetch(url_endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleadoData)
        });

        if (!response.ok) {
            let errorText;
            try {
                errorText = await response.text();
            } catch (e) {
                errorText = 'Error desconocido';
            }
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        let resultado;
        try {
            resultado = await response.json();
        } catch (e) {
            resultado = { message: 'Empleado actualizado exitosamente' };
        }
        
        console.log('Empleado actualizado:', resultado);
        await getEmpleados();
        window.mostrarAlertaGlobal('Empleado actualizado exitosamente', 'success');
        
        return resultado;
    } catch (error) {
        console.error('Error updating empleado:', error);
        window.mostrarAlertaGlobal('Error al actualizar el empleado: ' + error.message, 'error');
        throw error;
    }
}

export async function deleteEmpleado(nombre) {
    const url_endpoint = `${API_BASE_URL}/empleado/${encodeURIComponent(nombre)}`;

    try {
        const response = await fetch(url_endpoint, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Empleado eliminado:', nombre);
        
        // Recargar la lista de empleados
        await getEmpleados();
        
        return { message: 'Empleado eliminado exitosamente' };
    } catch (error) {
        console.error('Error deleting empleado:', error);
        window.mostrarAlertaGlobal('Error al eliminar el empleado', 'error');
        throw error;
    }
}


// Función auxiliar para mostrar errores (actualizada)