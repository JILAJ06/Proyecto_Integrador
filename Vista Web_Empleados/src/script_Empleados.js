document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación al cargar la página (usando función del Admin)
  if (typeof verificarAutenticacionYRol === 'function') {
    verificarAutenticacionYRol();
  }
  
  // Extrae sólo el nombre del archivo actual
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

  // Configurar funcionalidad del sidebar
  const sidebar = document.querySelector('.sidebar');
  if (localStorage.getItem('sidebarExpanded') === 'true') {
    sidebar.classList.add('expanded');
  }
  
  sidebar.addEventListener('mouseenter', () => {
    sidebar.classList.add('expanded');
    localStorage.setItem('sidebarExpanded', 'true');
  });
  
  sidebar.addEventListener('mouseleave', () => {
    sidebar.classList.remove('expanded');
    localStorage.setItem('sidebarExpanded', 'false');
  });

  // Configurar botón de cerrar sesión (usando función del Admin)
  if (typeof configurarBotonCerrarSesion === 'function') {
    configurarBotonCerrarSesion();
  }
});

// ===== FUNCIONES DE SESIÓN =====

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
    
    // Mostrar mensaje de despedida
    mostrarMensajeDespedida();
    
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      window.location.href = '/Login.html';
    }, 1000);
    
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    // Forzar redirección incluso si hay error
    window.location.href = '/Login.html';
  }
}

// Función para mostrar mensaje de despedida
function mostrarMensajeDespedida() {
  // Crear snackbar de despedida
  let snackbar = document.getElementById('snackbar-logout');
  if (!snackbar) {
    snackbar = document.createElement('div');
    snackbar.id = 'snackbar-logout';
    snackbar.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2196F3;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    `;
    document.body.appendChild(snackbar);
  }
  
  snackbar.textContent = '¡Hasta luego! Cerrando sesión...';
  snackbar.style.opacity = '1';
  snackbar.style.transform = 'translateY(0)';
}

// Exportar funciones para uso global
window.cerrarSesion = cerrarSesion;
window.obtenerDatosSesion = obtenerDatosSesion;
window.verificarAutenticacionYRol = verificarAutenticacionYRol;

