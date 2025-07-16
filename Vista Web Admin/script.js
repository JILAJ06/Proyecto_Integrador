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

// Función para verificar autenticación en páginas protegidas
function verificarAutenticacionYRol() {
  const sesion = obtenerDatosSesion();
  
  if (!sesion) {
    // No hay sesión, redirigir al login
    window.location.href = '/Login.html';
    return;
  }
  
  // Verificar si el usuario tiene permisos de admin
  if (sesion.rol.toLowerCase() !== 'admin' && sesion.rol.toLowerCase() !== 'administrador') {
    alert('No tienes permisos para acceder a esta sección');
    window.location.href = '/Vista Web_Empleados/HTML/Index_Empleados.html';
    return;
  }
  
  // Mostrar información del usuario en la interfaz
  mostrarInfoUsuario(sesion);
}

function mostrarInfoUsuario(sesion) {
  // Actualizar información de sesión en el header
  const sessionInfo = document.querySelector('.session-info');
  if (sessionInfo) {
    // CAMBIO: Mostrar nombre de usuario en lugar de "Sesión X"
    sessionInfo.innerHTML = `${sesion.nombreUsuario}<br>${sesion.rol}`;
  }
  
  // Buscar elementos donde mostrar info del usuario
  const elementos = document.querySelectorAll('[data-usuario-info]');
  
  elementos.forEach(elemento => {
    const info = elemento.getAttribute('data-usuario-info');
    switch(info) {
      case 'nombre':
        elemento.textContent = sesion.nombreUsuario;
        break;
      case 'rol':
        elemento.textContent = sesion.rol;
        break;
      case 'negocio':
        elemento.textContent = `Negocio #${sesion.idNegocio}`;
        break;
    }
  });
}

function obtenerDatosSesion() {
  const sesionActiva = sessionStorage.getItem('clink_sesion_activa');
  return sesionActiva ? JSON.parse(sesionActiva) : null;
}

// Función para configurar el botón de cerrar sesión
function configurarBotonCerrarSesion() {
  // Buscar el botón de cerrar sesión
  const btnCerrarSesion = document.querySelector('.logout-btn');
  
  console.log('Botón de cerrar sesión encontrado:', btnCerrarSesion);

  if (btnCerrarSesion) {
    // Remover cualquier href existente para evitar navegación
    if (btnCerrarSesion.tagName === 'A') {
      btnCerrarSesion.removeAttribute('href');
      btnCerrarSesion.style.cursor = 'pointer';
    }

    btnCerrarSesion.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Botón de cerrar sesión clickeado');
      
      // Mostrar modal de confirmación
      mostrarModalConfirmacion();
    });
  } else {
    console.warn('No se encontró el botón de cerrar sesión en el sidebar');
    
    // Búsqueda alternativa
    const sidebarLinks = document.querySelectorAll('.sidebar a, .sidebar button');
    sidebarLinks.forEach((link) => {
      const texto = link.textContent.toLowerCase();
      if (texto.includes('cerrar') || texto.includes('salir') || texto.includes('logout')) {
        console.log('Botón de logout encontrado manualmente:', link);
        link.addEventListener('click', function(e) {
          e.preventDefault();
          mostrarModalConfirmacion();
        });
      }
    });
  }
}

// Modal de confirmación para cerrar sesión
function mostrarModalConfirmacion() {
  // Crear modal si no existe
  let modal = document.getElementById('modal-logout-confirmacion');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-logout-confirmacion';
    modal.innerHTML = `
      <div class="modal-logout-overlay"></div>
      <div class="modal-logout-content">
        <div class="modal-logout-icon">🚪</div>
        <div class="modal-logout-title">¿Cerrar sesión?</div>
        <div class="modal-logout-message">¿Estás seguro que deseas cerrar sesión?</div>
        <div class="modal-logout-actions">
          <button class="modal-logout-btn-confirmar">Sí, cerrar sesión</button>
          <button class="modal-logout-btn-cancelar">Cancelar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    // Estilos del modal
    if (!document.getElementById('modal-logout-styles')) {
      const style = document.createElement('style');
      style.id = 'modal-logout-styles';
      style.textContent = `
        #modal-logout-confirmacion {
          display: none;
          position: fixed;
          z-index: 5000;
          left: 0; top: 0; width: 100vw; height: 100vh;
          align-items: center; justify-content: center;
          backdrop-filter: blur(2px);
        }
        #modal-logout-confirmacion .modal-logout-overlay {
          position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
        }
        #modal-logout-confirmacion .modal-logout-content {
          position: relative;
          background: #fff;
          border-radius: 16px;
          padding: 32px 24px;
          min-width: 320px;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          animation: modalSlideIn 0.3s ease-out;
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        #modal-logout-confirmacion .modal-logout-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        #modal-logout-confirmacion .modal-logout-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #333;
        }
        #modal-logout-confirmacion .modal-logout-message {
          color: #666;
          margin-bottom: 24px;
          line-height: 1.4;
        }
        #modal-logout-confirmacion .modal-logout-actions {
          display: flex;
          gap: 12px;
          flex-direction: column;
        }
        #modal-logout-confirmacion .modal-logout-btn-confirmar,
        #modal-logout-confirmacion .modal-logout-btn-cancelar {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        #modal-logout-confirmacion .modal-logout-btn-confirmar {
          background: #f44336;
          color: white;
        }
        #modal-logout-confirmacion .modal-logout-btn-confirmar:hover {
          background: #d32f2f;
          transform: translateY(-1px);
        }
        #modal-logout-confirmacion .modal-logout-btn-cancelar {
          background: #e0e0e0;
          color: #333;
        }
        #modal-logout-confirmacion .modal-logout-btn-cancelar:hover {
          background: #d0d0d0;
        }
      `;
      document.head.appendChild(style);
    }
  }
  
  modal.style.display = 'flex';
  
  // Cerrar modal
  const overlay = modal.querySelector('.modal-logout-overlay');
  const btnCancelar = modal.querySelector('.modal-logout-btn-cancelar');
  const btnConfirmar = modal.querySelector('.modal-logout-btn-confirmar');
  
  function cerrarModal() {
    modal.style.display = 'none';
  }
  
  overlay.onclick = cerrarModal;
  btnCancelar.onclick = cerrarModal;
  
  // Confirmar logout
  btnConfirmar.onclick = function() {
    cerrarModal();
    cerrarSesion();
  };
}

// Función para cerrar sesión completamente
function cerrarSesion() {
  try {
    // Limpiar todos los datos de sessionStorage relacionados con la sesión
    sessionStorage.removeItem('clink_sesion_activa');
    sessionStorage.removeItem('clink_api_base_url');
    
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

// Exportar funciones para uso global
window.cerrarSesion = cerrarSesion;
window.obtenerDatosSesion = obtenerDatosSesion;
window.verificarAutenticacionYRol = verificarAutenticacionYRol;

