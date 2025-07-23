document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya hay una sesión activa
    verificarSesionExistente();

    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const idNegocio = document.getElementById('id').value.trim();
            const nombreUsuario = document.getElementById('username').value.trim();
            const contrasena = document.getElementById('password').value.trim();
            
            // Validar campos
            if (!idNegocio || !nombreUsuario || !contrasena) {
                mostrarError('Por favor completa todos los campos');
                return;
            }
            
            try {
                mostrarCargando(true);
                await autenticarUsuario(idNegocio, nombreUsuario, contrasena);
            } catch (error) {
                console.error('Error en login:', error);
                mostrarError('Error de autenticación: ' + error.message);
            } finally {
                mostrarCargando(false);
            }
        });
    }
});

// Función para verificar si ya existe una sesión
function verificarSesionExistente() {
    const sesionActiva = sessionStorage.getItem('clink_sesion_activa');
    
    if (sesionActiva) {
        const datosUsuario = JSON.parse(sesionActiva);
        console.log('Sesión existente encontrada:', datosUsuario);
        redirigirSegunRol(datosUsuario.rol, datosUsuario);
    }
}

// Función principal de autenticación
async function autenticarUsuario(idNegocio, nombreUsuario, contrasena) {
    const API_BASE_URL = `/api/negocio/${idNegocio}`;
    
    try {
        // 1. Verificar que el negocio existe
        const responseNegocio = await fetch(`/api/negocio/${idNegocio}`);
        if (!responseNegocio.ok) {
            throw new Error('ID de negocio no válido');
        }
        
        // 2. Obtener empleados del negocio
        const responseEmpleados = await fetch(`${API_BASE_URL}/empleados`);
        if (!responseEmpleados.ok) {
            throw new Error('Error al obtener empleados del negocio');
        }
        
        const data = await responseEmpleados.json();
        const empleados = data.empleados;
        
        // 3. Buscar usuario en la lista de empleados
        const usuario = empleados.find(emp => 
            emp.nombreUsuario === nombreUsuario && emp.contrasena === contrasena
        );
        
        if (!usuario) {
            throw new Error('Credenciales incorrectas');
        }
        
        // 4. Guardar datos de sesión
        const datosUsuario = {
            idNegocio: idNegocio,
            nombreUsuario: usuario.nombreUsuario,
            correo: usuario.correo,
            rol: usuario.rol,
            calle: usuario.calle,
            colonia: usuario.colonia,
            codigoPostal: usuario.codigoPostal,
            fechaLogin: new Date().toISOString()
        };
        
        // Guardar en sessionStorage (se borra al cerrar navegador)
        sessionStorage.setItem('clink_sesion_activa', JSON.stringify(datosUsuario));
        sessionStorage.setItem('clink_api_base_url', API_BASE_URL);
        
        console.log('Login exitoso:', datosUsuario);
        mostrarExito('¡Bienvenido ' + datosUsuario.nombreUsuario + '!');
        
        // 5. Redirigir según el rol
        setTimeout(() => {
            redirigirSegunRol(datosUsuario.rol, datosUsuario);
        }, 1000);
        
    } catch (error) {
        throw error;
    }
}

// Función para redirigir según el rol del usuario
function redirigirSegunRol(rol, datosUsuario) {
    console.log('Redirigiendo usuario con rol:', rol);
    
    switch (rol.toLowerCase()) {
        case 'admin':
        case 'administrador':
            // Redirigir a la vista de administrador
            window.location.href = '/Vista Web Admin/html/Ventas.html';
            break;
            
        case 'empleado':
        case 'employee':
            // Redirigir a la vista de empleado
            window.location.href = '/Vista Web_Empleados/HTML/Ventas_Empleados.html';
            break;
            
        default:
            console.warn('Rol no reconocido:', rol);
            // Por defecto, redirigir a vista de empleado
            window.location.href = '/Vista Web_Empleados/HTML/Ventas_Empleados.html';
            break;
    }
}

// Función para cerrar sesión (usar en todas las vistas)
function cerrarSesion() {
    sessionStorage.removeItem('clink_sesion_activa');
    sessionStorage.removeItem('clink_api_base_url');
    
    // Redirigir al login
    window.location.href = '/Login.html';
}

// Función para obtener datos de la sesión actual
function obtenerDatosSesion() {
    const sesionActiva = sessionStorage.getItem('clink_sesion_activa');
    return sesionActiva ? JSON.parse(sesionActiva) : null;
}

// Función para obtener la URL base de la API
function obtenerAPIBaseURL() {
    return sessionStorage.getItem('clink_api_base_url') || '/api/negocio/1';
}

// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
    const sesion = obtenerDatosSesion();
    if (!sesion) {
        window.location.href = '/Login.html';
        return false;
    }
    return true;
}

// Funciones de UI
function mostrarCargando(mostrar) {
    const btn = document.querySelector('.login-btn');
    if (btn) {
        if (mostrar) {
            btn.disabled = true;
            btn.textContent = 'Iniciando sesión...';
        } else {
            btn.disabled = false;
            btn.textContent = 'Iniciar sesión';
        }
    }
}

function mostrarError(mensaje) {
    mostrarMensaje(mensaje, 'error');
}

function mostrarExito(mensaje) {
    mostrarMensaje(mensaje, 'success');
}

function mostrarMensaje(mensaje, tipo) {
    // Remover mensaje anterior si existe
    const mensajeAnterior = document.querySelector('.mensaje-login');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    // Crear nuevo mensaje
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-login mensaje-${tipo}`;
    mensajeDiv.textContent = mensaje;
    
    // Insertar antes del formulario
    const loginForm = document.getElementById('loginForm');
    loginForm.parentNode.insertBefore(mensajeDiv, loginForm);
    
    // Auto-remover después de 4 segundos
    setTimeout(() => {
        if (mensajeDiv && mensajeDiv.parentNode) {
            mensajeDiv.remove();
        }
    }, 4000);
}

// Exportar funciones para uso global
window.cerrarSesion = cerrarSesion;
window.obtenerDatosSesion = obtenerDatosSesion;
window.obtenerAPIBaseURL = obtenerAPIBaseURL;
window.verificarAutenticacion = verificarAutenticacion;