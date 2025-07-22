// Alerta visual global reutilizable (estilo historial)
function mostrarAlertaVisual(mensaje) {
    if (document.getElementById('alerta-descarga')) return;
    const alerta = document.createElement('div');
    alerta.id = 'alerta-descarga';
    alerta.textContent = mensaje;
    document.body.appendChild(alerta);
    if (!document.getElementById('alerta-descarga-style')) {
        const style = document.createElement('style');
        style.id = 'alerta-descarga-style';
        style.textContent = `
            #alerta-descarga {
                position: fixed;
                right: 32px;
                bottom: 32px;
                background: #f6f7f2;
                color: #444;
                border-radius: 20px;
                box-shadow: 0 2px 16px rgba(0,0,0,0.10);
                padding: 18px 32px;
                font-size: 1.2rem;
                z-index: 4000;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.4s;
            }
            #alerta-descarga.mostrar {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    setTimeout(() => {
        alerta.classList.add('mostrar');
    }, 50);
    setTimeout(() => {
        alerta.classList.remove('mostrar');
        setTimeout(() => alerta.remove(), 400);
    }, 2600);
}

document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación al cargar la página
  verificarAutenticacionYRol();
  
  // Extrae sólo el nombre del archivo actual, ej: "inventario.html"
  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  document.querySelectorAll(".nav-item").forEach(link => {
    const href = link.getAttribute("href").toLowerCase();
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  // Configurar botón de cerrar sesión
  configurarBotonCerrarSesion();
});

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  // 1) Al cargar, lee el estado guardado
  if (localStorage.getItem('sidebarExpanded') === 'true') {
    sidebar.classList.add('expanded');
  }
  // 2) Cuando el usuario expande (mouseenter), guarda "true"
  sidebar.addEventListener('mouseenter', () => {
    sidebar.classList.add('expanded');
    localStorage.setItem('sidebarExpanded', 'true');
  });
  // 3) Cuando se colapsa (mouseleave), guarda "false"
  sidebar.addEventListener('mouseleave', () => {
    sidebar.classList.remove('expanded');
    localStorage.setItem('sidebarExpanded', 'false');
  });
});

// Funcionalidad específica para la caja (mantener)
document.addEventListener('DOMContentLoaded', () => {
    const cargarCajaBtn = document.getElementById('cargarCajaBtn');
    if (cargarCajaBtn) {
        cargarCajaBtn.addEventListener('click', function() {
            // Simulación de datos
            const fecha = new Date();
            const fechaStr = fecha.toLocaleDateString('es-MX');
            document.getElementById('fecha').textContent = fechaStr;
            document.getElementById('empleado').textContent = 'Juan Chin Chin';
            document.getElementById('cantidadInicial').textContent = '$1,000.00';
            document.getElementById('ingresos').textContent = '$2,500.00';
            document.getElementById('ganancias').textContent = '$1,500.00';
            document.getElementById('totalEntregar').textContent = '$2,500.00';
        });
    }
});

// ===== FUNCIONES DE SESIÓN AÑADIDAS =====

function obtenerDatosSesion() {
  // Buscar en ambas variantes por compatibilidad
  let sesionActiva = sessionStorage.getItem('clink_session_activa') || 
                     sessionStorage.getItem('clink_sesion_activa');
  return sesionActiva ? JSON.parse(sesionActiva) : null;
}

// Función para configurar el botón de cerrar sesión
function configurarBotonCerrarSesion() {
  const botonCerrarSesion = document.querySelector('.logout-btn');
  
  if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Mostrar confirmación antes de cerrar sesión
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        cerrarSesion();
      }
    });
    
    console.log('✅ Botón de cerrar sesión configurado');
  } else {
    console.warn('⚠️ No se encontró botón de cerrar sesión');
  }
}

// Función para verificar autenticación en páginas protegidas
function verificarAutenticacionYRol() {
  const sesion = obtenerDatosSesion();
  
  if (!sesion) {
    // No hay sesión, redirigir al login
    window.location.href = '/Login.html';
    return;
  }
  
  // Mostrar información del usuario en la interfaz
  mostrarInfoUsuario(sesion);
  
  // Guardar datos en el formato que espera inventarioServices
  guardarDatosParaInventario(sesion);
  
  // Configurar botón de cerrar sesión
  configurarBotonCerrarSesion();
}

// Nueva función para guardar los datos en el formato correcto para el inventario
function guardarDatosParaInventario(sesion) {
  try {
    // Extraer datos de la sesión
    const nombreUsuario = sesion.nombreusuario || sesion.nombreUsuario || sesion.usuario || 'admin';
    const negocioId = sesion.negocioid || sesion.idNegocio || sesion.id_negocio || '1';
    
    // Guardar en las claves que espera inventarioServices
    sessionStorage.setItem('nombreUsuario', nombreUsuario);
    sessionStorage.setItem('negocioId', negocioId);
    
    console.log('💾 Datos guardados para inventario:');
    console.log('- nombreUsuario:', nombreUsuario);
    console.log('- negocioId:', negocioId);
    
  } catch (error) {
    console.error('❌ Error al guardar datos para inventario:', error);
  }
}

function mostrarInfoUsuario(sesion) {
  // Actualizar información de sesión en el header
  const sessionInfo = document.querySelector('.session-info');
  if (sessionInfo) {
    const nombreUsuario = sesion.nombreusuario || sesion.nombreUsuario || sesion.usuario || 'Usuario';
    const rol = sesion.rol || 'Admin';
    sessionInfo.innerHTML = `${nombreUsuario}<br>${rol}`;
  }
  
  // Buscar elementos donde mostrar info del usuario
  const elementos = document.querySelectorAll('[data-usuario-info]');
  
  elementos.forEach(elemento => {
    const info = elemento.getAttribute('data-usuario-info');
    switch(info) {
      case 'nombre':
        elemento.textContent = sesion.nombreusuario || sesion.nombreUsuario || sesion.usuario || 'Usuario';
        break;
      case 'rol':
        elemento.textContent = sesion.rol || 'Admin';
        break;
      case 'negocio':
        const negocioId = sesion.negocioid || sesion.idNegocio || sesion.id_negocio || '1';
        elemento.textContent = `Negocio #${negocioId}`;
        break;
    }
  });
}

// Función para cerrar sesión completamente
function cerrarSesion() {
  try {
    // Limpiar todos los datos de sessionStorage relacionados con la sesión
    sessionStorage.removeItem('clink_session_activa');
    sessionStorage.removeItem('clink_sesion_activa');
    sessionStorage.removeItem('clink_api_base_url');
    
    // También limpiar los datos específicos del inventario
    sessionStorage.removeItem('nombreUsuario');
    sessionStorage.removeItem('negocioId');
    sessionStorage.removeItem('idNegocio');
    sessionStorage.removeItem('id_negocio');
    
    // Mantener preferencias del sidebar si se desea
    // sessionStorage.removeItem('sidebarExpanded');
    
    console.log('Sesión cerrada correctamente');
    
    // Mostrar mensaje de despedida (reutilizando tu función de alerta existente)
    mostrarAlertaVisual('¡Hasta luego! Cerrando sesión...');
    
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      window.location.href = '/Login.html';
    }, 1500); // Un poco más de tiempo para mostrar tu alerta
    
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    // Forzar redirección incluso si hay error
    window.location.href = '/Login.html';
  }
}

// Función helper para debuggear sessionStorage (útil para desarrollo)
function debugSessionStorage() {
  console.log('🔍 DEBUG: Contenido de sessionStorage:');
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);
    
    try {
      const parsed = JSON.parse(value);
      console.log(`📝 ${key}:`, parsed);
    } catch {
      console.log(`📝 ${key}:`, value);
    }
  }
}

// Exportar funciones para uso global
window.cerrarSesion = cerrarSesion;
window.obtenerDatosSesion = obtenerDatosSesion;
window.verificarAutenticacionYRol = verificarAutenticacionYRol;
window.debugSessionStorage = debugSessionStorage;
window.guardarDatosParaInventario = guardarDatosParaInventario;
window.configurarBotonCerrarSesion = configurarBotonCerrarSesion;

