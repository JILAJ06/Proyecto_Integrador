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

