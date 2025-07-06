document.addEventListener('DOMContentLoaded', function() {
    // Navigation handling
    const navItems = document.querySelectorAll('.nav-item');
    const cards = document.querySelectorAll('.card');
    const path = window.location.pathname;


    // Handle sidebar navigation
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Optional: Add page content switching logic here
            console.log('Navigated to:', this.querySelector('span').textContent);
        });
    });

    // Handle card clicks
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const module = this.dataset.module;
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Handle module navigation
            handleModuleClick(module);
        });
    });

    // Module click handler
    function handleModuleClick(module) {
        switch(module) {
            case 'venta':
                console.log('Abriendo módulo de Venta');
                // Redirect or load venta module
                break;
            case 'inventario':
                console.log('Abriendo módulo de Inventario');
                // Redirect or load inventario module
                break;
            case 'productos':
                console.log('Abriendo módulo de Productos');
                // Redirect or load productos module
                break;
            case 'clientes':
                console.log('Abriendo módulo de Clientes');
                // Redirect or load clientes module
                break;
            case 'empleados':
                console.log('Abriendo módulo de Empleados');
                // Redirect or load empleados module
                break;
            case 'graficas':
                console.log('Abriendo módulo de Gráficas');
                // Redirect or load graficas module
                break;
            case 'historial':
                console.log('Abriendo módulo de Historial');
                // Redirect or load historial module
                break;
            case 'corte':
                console.log('Abriendo módulo de Corte de Caja');
                // Redirect or load corte module
                break;
            default:
                console.log('Módulo no reconocido:', module);
        }
    }

    // Add hover effects for better UX
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Session info update (optional)
    function updateSessionInfo() {
        const sessionElement = document.querySelector('.session-info');
        const currentTime = new Date().toLocaleTimeString();
        // You can update session info dynamically here
    }

    // Optional: Update session info every minute
    // setInterval(updateSessionInfo, 60000);
});