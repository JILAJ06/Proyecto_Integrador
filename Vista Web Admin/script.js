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
});


document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  // 1) Al cargar, lee el estado guardado
  if (localStorage.getItem('sidebarExpanded') === 'true') {
    sidebar.classList.add('expanded');
  }
  // 2) Cuando el usuario expande (mouseenter), guarda “true”
  sidebar.addEventListener('mouseenter', () => {
    sidebar.classList.add('expanded');
    localStorage.setItem('sidebarExpanded', 'true');
  });
  // 3) Cuando se colapsa (mouseleave), guarda “false”
  sidebar.addEventListener('mouseleave', () => {
    sidebar.classList.remove('expanded');
    localStorage.setItem('sidebarExpanded', 'false');
  });
});

        document.getElementById('cargarCajaBtn').addEventListener('click', function() {
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

