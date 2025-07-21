// ===== FUNCIONES DE SESIÓN GLOBAL =====

// Función para obtener datos de la sesión actual
function obtenerDatosSesion() {
    const sesionActiva = sessionStorage.getItem('clink_sesion_activa');
    return sesionActiva ? JSON.parse(sesionActiva) : null;
}

// Función para obtener el ID del negocio
function obtenerIdNegocio() {
    // Buscar en sessionStorage con diferentes claves posibles
    let negocioId = sessionStorage.getItem('negocioId') || 
                   sessionStorage.getItem('idNegocio') ||
                   sessionStorage.getItem('id_negocio') ||
                   sessionStorage.getItem('businessId');
    
    // Si no encuentra nada, buscar en los datos de sesión
    if (!negocioId) {
        const sesion = obtenerDatosSesion();
        if (sesion && sesion.idNegocio) {
            negocioId = sesion.idNegocio;
        }
    }
    
    // Si aún no encuentra nada, usar valor por defecto
    if (!negocioId) {
        console.warn('No se encontró ID de negocio, usando valor por defecto: 1');
        negocioId = 1;
    }
    
    const resultado = parseInt(negocioId);
    console.log('ID de negocio obtenido:', resultado);
    return resultado;
}

// Función para guardar datos de sesión (usar después del login)
function guardarDatosSesion(usuario, negocioId, rol = 'Administrador') {
    const datosSession = {
        nombreUsuario: usuario,
        idNegocio: parseInt(negocioId),
        rol: rol,
        fechaLogin: new Date().toISOString()
    };
    
    sessionStorage.setItem('clink_sesion_activa', JSON.stringify(datosSession));
    sessionStorage.setItem('negocioId', negocioId.toString());
    sessionStorage.setItem('idNegocio', negocioId.toString());
    sessionStorage.setItem('nombreUsuario', usuario);
    
    console.log('Datos de sesión guardados:', datosSession);
}

// Función para obtener el nombre de usuario
function obtenerNombreUsuario() {
    const sesion = obtenerDatosSesion();
    if (sesion && sesion.nombreUsuario) {
        return sesion.nombreUsuario;
    }
    
    return sessionStorage.getItem('nombreUsuario') || 
           sessionStorage.getItem('usuario') || 
           sessionStorage.getItem('username') || 
           'Usuario';
}

// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
    const sesion = obtenerDatosSesion();
    const negocioId = obtenerIdNegocio();
    
    if (!sesion && !negocioId) {
        console.warn('No hay sesión activa');
        return false;
    }
    return true;
}

// Función para cerrar sesión
function cerrarSesion() {
    try {
        sessionStorage.clear();
        console.log('Sesión cerrada correctamente');
        window.location.href = '../Login.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        window.location.href = '../Login.html';
    }
}

// Función para mostrar información del usuario en la interfaz
function mostrarInfoUsuario() {
    const nombreUsuario = obtenerNombreUsuario();
    const negocioId = obtenerIdNegocio();
    
    // Actualizar información de sesión en el header
    const sessionInfo = document.querySelector('.session-info');
    if (sessionInfo) {
        sessionInfo.innerHTML = `${nombreUsuario}<br>Administrador (Negocio #${negocioId})`;
    }
}

// Función para inicializar la sesión en cada página
function inicializarSesion() {
    console.log('Inicializando sesión...');
    
    // Para desarrollo, si no hay datos de sesión, crearlos
    if (!verificarAutenticacion()) {
        console.warn('Creando datos de sesión de prueba para desarrollo...');
        guardarDatosSesion('Admin', 1, 'Administrador');
    }
    
    // Mostrar información del usuario
    mostrarInfoUsuario();
    
    // Configurar botón de cerrar sesión si existe
    const btnCerrarSesion = document.querySelector('.logout-btn');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
                cerrarSesion();
            }
        });
    }
}

// Ejecutar inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarSesion);

// Exportar funciones para uso global
window.obtenerDatosSesion = obtenerDatosSesion;
window.obtenerIdNegocio = obtenerIdNegocio;
window.obtenerNombreUsuario = obtenerNombreUsuario;
window.verificarAutenticacion = verificarAutenticacion;
window.cerrarSesion = cerrarSesion;
window.mostrarInfoUsuario = mostrarInfoUsuario;
window.inicializarSesion = inicializarSesion;
window.guardarDatosSesion = guardarDatosSesion;