// Configuración específica para empleados
window.EMPLEADO_CONFIG = {
  // Deshabilitar ciertas funcionalidades para empleados
  canDelete: false,
  canEdit: true,
  canAdd: true,
  
  // Filtrar botones según permisos
  hideButtons: ['btn-delete'], // Ocultar botón eliminar para empleados
  
  // Configurar API con restricciones de empleado
  apiRestrictions: {
    inventario: ['GET', 'POST', 'PUT'], // No DELETE
    clientes: ['GET', 'POST', 'PUT'],
    ventas: ['GET', 'POST']
  }
};

// Función para adaptar la interfaz para empleados
function adaptarInterfazEmpleado() {
  // Ocultar botones según configuración
  window.EMPLEADO_CONFIG.hideButtons.forEach(buttonClass => {
    const buttons = document.querySelectorAll(`.${buttonClass}`);
    buttons.forEach(btn => {
      btn.style.display = 'none';
    });
  });
  
  // Cambiar texto de header para indicar que es vista de empleado
  const sessionInfo = document.querySelector('.session-info');
  if (sessionInfo && sessionInfo.textContent.includes('Administrador')) {
    sessionInfo.innerHTML = sessionInfo.innerHTML.replace('Administrador', 'Empleado');
  }
}

// Ejecutar adaptaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Esperar un poco para que se carguen los elementos dinámicos
  setTimeout(adaptarInterfazEmpleado, 500);
});