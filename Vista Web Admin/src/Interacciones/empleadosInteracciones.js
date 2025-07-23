// Importar las funciones del servicio
import { empleadosService } from '../Servicios/empleadosService.js';

// Sobrescribir funciones de alerta para desactivarlas
window.alert = function() {};
window.confirm = function() { return true; };
window.prompt = function() { return ''; };

// Si existe Swal, desactivarlo también
if (typeof Swal !== 'undefined') {
    window.Swal = {
        fire: function() { return Promise.resolve({ isConfirmed: true }); },
        close: function() {},
        isVisible: function() { return false; }
    };
}

class EmpleadosInteracciones {
    constructor() {
        this.inicializarEventos();
        this.cargarEmpleados();
    }

    inicializarEventos() {
        // Botón agregar
        const btnAgregar = document.querySelector('.btn-add');
        if (btnAgregar) {
            btnAgregar.addEventListener('click', () => this.mostrarFormularioAgregar());
        }

        // Botón editar
        const btnEditar = document.querySelector('.btn-edit');
        if (btnEditar) {
            btnEditar.addEventListener('click', () => this.editarEmpleadoSeleccionado());
        }

        // Botón eliminar
        const btnEliminar = document.querySelector('.btn-category');
        if (btnEliminar) {
            btnEliminar.addEventListener('click', () => this.eliminarEmpleadoSeleccionado());
        }
    }

    async cargarEmpleados() {
        try {
            const empleados = await empleadosService.obtenerEmpleados();
            this.mostrarEmpleados(empleados);
        } catch (error) {
            console.log('Error al cargar empleados:', error);
        }
    }

    mostrarEmpleados(empleados) {
        const tbody = document.querySelector('.products-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        empleados.forEach(empleado => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${empleado.nombre || ''}</td>
                <td>${empleado.correo || ''}</td>
                <td>${empleado.direccion || ''}</td>
            `;
            row.addEventListener('click', () => this.seleccionarEmpleado(row, empleado));
            tbody.appendChild(row);
        });
    }

    seleccionarEmpleado(row, empleado) {
        // Remover selección anterior
        document.querySelectorAll('.products-table tbody tr').forEach(tr => {
            tr.classList.remove('selected');
        });
        
        // Seleccionar fila actual
        row.classList.add('selected');
        this.empleadoSeleccionado = empleado;
    }

    mostrarFormularioAgregar() {
        // Crear formulario simple sin alertas
        const nombre = prompt('Nombre del empleado:') || '';
        const correo = prompt('Correo del empleado:') || '';
        const direccion = prompt('Dirección del empleado:') || '';

        if (nombre && correo) {
            this.agregarEmpleado({ nombre, correo, direccion });
        }
    }

    async agregarEmpleado(datosEmpleado) {
        try {
            const resultado = await empleadosService.agregarEmpleado(datosEmpleado);
            if (resultado) {
                this.cargarEmpleados();
            }
        } catch (error) {
            console.log('Error al agregar empleado:', error);
        }
    }

    editarEmpleadoSeleccionado() {
        if (!this.empleadoSeleccionado) {
            console.log('Seleccione un empleado para editar');
            return;
        }

        const nombre = prompt('Nuevo nombre:', this.empleadoSeleccionado.nombre) || this.empleadoSeleccionado.nombre;
        const correo = prompt('Nuevo correo:', this.empleadoSeleccionado.correo) || this.empleadoSeleccionado.correo;
        const direccion = prompt('Nueva dirección:', this.empleadoSeleccionado.direccion) || this.empleadoSeleccionado.direccion;

        this.editarEmpleado(this.empleadoSeleccionado.id, { nombre, correo, direccion });
    }

    async editarEmpleado(id, datosActualizados) {
        try {
            const resultado = await empleadosService.editarEmpleado(id, datosActualizados);
            if (resultado) {
                this.cargarEmpleados();
                this.empleadoSeleccionado = null;
            }
        } catch (error) {
            console.log('Error al editar empleado:', error);
        }
    }

    eliminarEmpleadoSeleccionado() {
        if (!this.empleadoSeleccionado) {
            console.log('Seleccione un empleado para eliminar');
            return;
        }

        this.eliminarEmpleado(this.empleadoSeleccionado.id);
    }

    async eliminarEmpleado(id) {
        try {
            const resultado = await empleadosService.eliminarEmpleado(id);
            if (resultado) {
                this.cargarEmpleados();
                this.empleadoSeleccionado = null;
            }
        } catch (error) {
            console.log('Error al eliminar empleado:', error);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new EmpleadosInteracciones();
});
