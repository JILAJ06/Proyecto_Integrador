// Importar las funciones del servicio
import { getEmpleados, postEmpleado, putEmpleado, deleteEmpleado } from '../Servicios/empleadosService.js';

// Interacciones para los botones de empleados.html
// Autor: GitHub Copilot

document.addEventListener('DOMContentLoaded', function () {
    const btnAgregar = document.querySelector('.btn-add');
    const btnEditar = document.querySelector('.btn-edit');
    const btnEliminar = document.querySelector('.btn-category');

    // Selección de fila en la tabla de empleados
    const tabla = document.querySelector('.products-table tbody');
    let filaSeleccionada = null;
    if (tabla) {
        tabla.addEventListener('click', function (e) {
            let tr = e.target.closest('tr');
            if (!tr) return;
            // Quitar selección previa
            if (filaSeleccionada) filaSeleccionada.classList.remove('selected-row');
            filaSeleccionada = tr;
            tr.classList.add('selected-row');
        });
        // Estilo para la fila seleccionada
        if (!document.getElementById('row-selected-style-empleados')) {
            const style = document.createElement('style');
            style.id = 'row-selected-style-empleados';
            style.textContent = `.products-table tbody tr.selected-row {
                background: #e3f2fd !important;
                outline: 2px solid #2196f3 !important;
                outline-offset: -2px;
            }`;
            document.head.appendChild(style);
        }
    }

    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            // Modal para agregar empleado
            if (!document.getElementById('modal-agregar-empleado')) {
                const modal = document.createElement('div');
                modal.id = 'modal-agregar-empleado';
                modal.innerHTML = `
                    <div class="modal-agregar-overlay"></div>
                    <form class="modal-agregar-content" autocomplete="off">
                        <div class="modal-agregar-group">
                            <label class="modal-agregar-label"><b>Nombre de Usuario</b></label>
                            <div class="modal-agregar-placeholder">Ejem. juan_perez</div>
                            <input class="modal-agregar-input" type="text" placeholder="" required>
                        </div>
                        <div class="modal-agregar-group">
                            <label class="modal-agregar-label"><b>Correo</b></label>
                            <div class="modal-agregar-placeholder">Ejem. empleado@gmail.com</div>
                            <input class="modal-agregar-input" type="email" placeholder="" required>
                        </div>
                        <div class="modal-agregar-group">
                            <label class="modal-agregar-label"><b>Contraseña</b></label>
                            <div class="modal-agregar-placeholder">Ejem. miclave123</div>
                            <input class="modal-agregar-input" type="password" placeholder="" required>
                        </div>
                        <div class="modal-agregar-group">
                            <label class="modal-agregar-label"><b>Rol</b></label>
                            <select class="modal-agregar-input" required>
                                <option value="">▼ Seleccionar Rol</option>
                                <option value="Admin">Admin</option>
                                <option value="Empleado">Empleado</option>
                            </select>
                        </div>
                        <div class="modal-agregar-group">
                            <label class="modal-agregar-label"><b>Calle</b></label>
                            <div class="modal-agregar-placeholder">Ejem. Av. Juárez #123</div>
                            <input class="modal-agregar-input" type="text" placeholder="" required>
                        </div>
                        <div class="modal-agregar-group">
                            <label class="modal-agregar-label"><b>Colonia</b></label>
                            <div class="modal-agregar-placeholder">Ejem. Centro</div>
                            <input class="modal-agregar-input" type="text" placeholder="" required>
                        </div>
                        <div class="modal-agregar-group">
                            <label class="modal-agregar-label"><b>Código Postal</b></label>
                            <div class="modal-agregar-placeholder">Ejem. 12345</div>
                            <input class="modal-agregar-input" type="text" pattern="[0-9]{5}" placeholder="" required>
                        </div>
                        <div class="modal-agregar-actions">
                            <button type="submit" class="modal-agregar-btn-aceptar">Aceptar</button>
                            <button type="button" class="modal-agregar-btn-cancelar">Cancelar</button>
                        </div>
                    </form>
                `;
                document.body.appendChild(modal);
                // Estilos solo una vez
                if (!document.getElementById('modal-agregar-style-empleados')) {
                    const style = document.createElement('style');
                    style.id = 'modal-agregar-style-empleados';
                    style.textContent = `
                        #modal-agregar-empleado {
                            display: none;
                            position: fixed;
                            z-index: 3000;
                            left: 0; top: 0; width: 100vw; height: 100vh;
                            align-items: center; justify-content: center;
                        }
                        #modal-agregar-empleado .modal-agregar-overlay {
                            position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                            background: rgba(0,0,0,0.4);
                        }
                        #modal-agregar-empleado .modal-agregar-content {
                            position: relative;
                            background: #e6e7c7;
                            border-radius: 32px;
                            padding: 24px 0 18px 0;
                            min-width: 420px;
                            max-width: 480px;
                            box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                            display: flex;
                            flex-direction: column;
                            align-items: stretch;
                            z-index: 2;
                            gap: 10px;
                        }
                        #modal-agregar-empleado .modal-agregar-group {
                            display: flex;
                            flex-direction: column;
                            align-items: stretch;
                            margin: 0 32px 0 32px;
                            margin-bottom: 8px;
                        }
                        #modal-agregar-empleado .modal-agregar-label {
                            font-size: 1.3rem;
                            font-weight: bold;
                            margin-bottom: 2px;
                            text-align: center;
                        }
                        #modal-agregar-empleado .modal-agregar-placeholder {
                            font-size: 1rem;
                            color: #444;
                            margin-bottom: 2px;
                            text-align: center;
                        }
                        #modal-agregar-empleado .modal-agregar-input {
                            font-size: 1.1rem;
                            border: none;
                            border-radius: 12px;
                            padding: 10px 12px;
                            margin-bottom: 2px;
                            background: #fff;
                            box-shadow: 0 2px 0 #222;
                            outline: none;
                        }
                        #modal-agregar-empleado .modal-agregar-actions {
                            display: flex;
                            justify-content: space-between;
                            gap: 32px;
                            margin: 18px 32px 0 32px;
                        }
                        #modal-agregar-empleado .modal-agregar-btn-aceptar, #modal-agregar-empleado .modal-agregar-btn-cancelar {
                            flex: 1;
                            padding: 14px 0;
                            border: none;
                            border-radius: 20px;
                            background: #fff;
                            font-weight: bold;
                            font-size: 1.3rem;
                            cursor: pointer;
                            transition: background 0.2s;
                            margin: 0 8px;
                        }
                        #modal-agregar-empleado .modal-agregar-btn-aceptar:hover {
                            background: #b8e6b8;
                        }
                        #modal-agregar-empleado .modal-agregar-btn-cancelar:hover {
                            background: #f2bcbc;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
            const modal = document.getElementById('modal-agregar-empleado');
            modal.style.display = 'flex';
            // Cerrar modal
            modal.querySelector('.modal-agregar-overlay').onclick = closeModal;
            modal.querySelector('.modal-agregar-btn-cancelar').onclick = closeModal;
            function closeModal() {
                modal.style.display = 'none';
            }
            // Evitar submit real y cerrar modal al aceptar
            modal.querySelector('.modal-agregar-content').onsubmit = async function(e) {
                e.preventDefault();
                
                const inputs = modal.querySelectorAll('.modal-agregar-input');
                const empleadoData = {
                    nombreUsuario: inputs[0].value.trim(),
                    correo: inputs[1].value.trim(),
                    contrasena: inputs[2].value.trim(),
                    rol: inputs[3].value,
                    calle: inputs[4].value.trim(),
                    colonia: inputs[5].value.trim(),
                    codigoPostal: inputs[6].value.trim()
                };
                
                if (!empleadoData.nombreUsuario || !empleadoData.correo || !empleadoData.contrasena || 
                    !empleadoData.rol || !empleadoData.calle || !empleadoData.colonia || !empleadoData.codigoPostal) {
                    mostrarSnackbar('Por favor completa todos los campos', true);
                    return;
                }
                
                try {
                    await postEmpleado(empleadoData);
                    closeModal();
                    mostrarSnackbar('Empleado agregado con éxito');
                } catch (error) {
                    console.error('Error al agregar empleado:', error);
                    mostrarSnackbar('Error al agregar el empleado', true);
                }
            };
        });
    }
    if (btnEditar) {
        btnEditar.addEventListener('click', function() {
            // Solo permitir si hay una fila seleccionada
            if (!filaSeleccionada) {
                let snackbar = document.getElementById('snackbar-empleados');
                if (!snackbar) {
                    snackbar = document.createElement('div');
                    snackbar.id = 'snackbar-empleados';
                    snackbar.className = 'snackbar-empleados';
                    document.body.appendChild(snackbar);
                    if (!document.getElementById('snackbar-style-empleados')) {
                        const style = document.createElement('style');
                        style.id = 'snackbar-style-empleados';
                        style.textContent = `
                            .snackbar-empleados {
                                min-width: 320px;
                                max-width: 400px;
                                background: #fff;
                                color: #222;
                                text-align: center;
                                border-radius: 18px;
                                padding: 18px 24px;
                                position: fixed;
                                z-index: 4000;
                                right: 32px;
                                bottom: 32px;
                                font-size: 1.1rem;
                                box-shadow: 0 2px 16px rgba(0,0,0,0.18);
                                opacity: 0;
                                pointer-events: none;
                                transition: opacity 0.4s, bottom 0.4s;
                            }
                            .snackbar-empleados.show {
                                opacity: 1;
                                pointer-events: auto;
                                bottom: 48px;
                            }
                        `;
                        document.head.appendChild(style);
                    }
                }
                snackbar.textContent = 'Selecciona una fila para editar';
                snackbar.classList.add('show');
                setTimeout(() => {
                    snackbar.classList.remove('show');
                }, 2500);
                return;
            }
            
            // Obtener datos actuales de la fila seleccionada (estructura correcta)
            const celdas = filaSeleccionada.querySelectorAll('td');
            
            console.log('Celdas encontradas:', celdas.length);
            console.log('Datos de celdas:', Array.from(celdas).map(celda => celda.textContent));
            
            // Estructura real de la tabla: [nombreUsuario, correo, direccion_completa]
            const nombreUsuario = celdas[0]?.textContent.trim() || '';
            const correo = celdas[1]?.textContent.trim() || '';
            const direccionCompleta = celdas[2]?.textContent.trim() || '';
            
            console.log('Datos extraídos:', { nombreUsuario, correo, direccionCompleta });
            
            // Parsear la dirección completa "calle, colonia, codigo_postal"
            const direccionPartes = direccionCompleta.split(', ');
            const calle = direccionPartes[0]?.trim() || '';
            const colonia = direccionPartes[1]?.trim() || '';
            const codigoPostal = direccionPartes[2]?.trim() || '';
            
            console.log('Dirección parseada:', { calle, colonia, codigoPostal });
            
            // Obtener el rol desde los datos originales del empleado
            // Como no está en la tabla, necesitamos buscarlo en los datos originales
            let rolEmpleado = 'Empleado'; // Por defecto
            
            // Buscar el empleado en los datos originales para obtener el rol
            // Esto requiere que tengamos acceso a los datos originales
            
            // Mostrar el modal de agregar (reutilizado)
            let modal = document.getElementById('modal-agregar-empleado');
            if (!modal) {
                btnAgregar.click();
                modal = document.getElementById('modal-agregar-empleado');
            } else {
                modal.style.display = 'flex';
            }
            
            // Esperar un momento para que el modal se cargue completamente
            setTimeout(() => {
                const inputs = modal.querySelectorAll('.modal-agregar-input');
                
                console.log('Inputs encontrados:', inputs.length);
                
                if (inputs.length >= 7) {
                    // Precargar los valores en el orden correcto
                    inputs[0].value = nombreUsuario;           // Nombre de usuario
                    inputs[1].value = correo;                  // Correo
                    inputs[2].value = '';                      // Contraseña vacía por seguridad
                    inputs[3].value = rolEmpleado;             // Rol (por defecto Empleado)
                    inputs[4].value = calle;                   // Calle
                    inputs[5].value = colonia;                 // Colonia
                    inputs[6].value = codigoPostal;            // Código postal
                    
                    console.log('Valores precargados:', {
                        nombreUsuario: inputs[0].value,
                        correo: inputs[1].value,
                        rol: inputs[3].value,
                        calle: inputs[4].value,
                        colonia: inputs[5].value,
                        codigoPostal: inputs[6].value
                    });
                } else {
                    console.error('No se encontraron suficientes inputs en el modal');
                }
            }, 100);
            
            // Cambiar el submit para editar
            const form = modal.querySelector('.modal-agregar-content');
            form.onsubmit = async function(e) {
                e.preventDefault();
                
                const inputs = modal.querySelectorAll('.modal-agregar-input');
                
                // Obtener nuevos valores
                const nuevoNombreUsuario = inputs[0].value.trim();
                const nuevoCorreo = inputs[1].value.trim();
                const nuevaContrasena = inputs[2].value.trim();
                const nuevoRol = inputs[3].value;
                const nuevaCalle = inputs[4].value.trim();
                const nuevaColonia = inputs[5].value.trim();
                const nuevoCodigoPostal = inputs[6].value.trim();
                
                console.log('Nuevos valores para editar:', {
                    nuevoNombreUsuario, nuevoCorreo, nuevoRol,
                    nuevaCalle, nuevaColonia, nuevoCodigoPostal
                });
                
                // Validar campos obligatorios
                if (!nuevoNombreUsuario || !nuevoCorreo || !nuevoRol || 
                    !nuevaCalle || !nuevaColonia || !nuevoCodigoPostal) {
                    mostrarSnackbar('Por favor completa todos los campos', true);
                    return;
                }
                
                try {
                    const datosActualizados = {
                        nombreUsuario: nuevoNombreUsuario,
                        correo: nuevoCorreo,
                        rol: nuevoRol,
                        calle: nuevaCalle,
                        colonia: nuevaColonia,
                        codigoPostal: nuevoCodigoPostal
                    };
                    
                    // Solo incluir contraseña si se proporcionó una nueva
                    if (nuevaContrasena) {
                        datosActualizados.contrasena = nuevaContrasena;
                    }
                    
                    console.log('Editando empleado:', nombreUsuario, 'con datos:', datosActualizados);
                    
                    await putEmpleado(nombreUsuario, datosActualizados);
                    modal.style.display = 'none';
                    mostrarSnackbar('Empleado editado con éxito');
                    
                    // Limpiar selección
                    filaSeleccionada.classList.remove('selected-row');
                    filaSeleccionada = null;
                    
                } catch (error) {
                    console.error('Error al editar empleado:', error);
                    mostrarSnackbar('Error al editar el empleado', true);
                }
            };
            
            // Agregar botón de cancelar específico para edición
            const btnCancelar = modal.querySelector('.modal-agregar-btn-cancelar');
            btnCancelar.onclick = function() {
                modal.style.display = 'none';
                // Limpiar selección
                if (filaSeleccionada) {
                    filaSeleccionada.classList.remove('selected-row');
                    filaSeleccionada = null;
                }
            };
        });
    }
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function() {
            // Solo permitir si hay una fila seleccionada
            if (!filaSeleccionada) {
                mostrarSnackbar('Selecciona una fila para eliminar', true);
                return;
            }

            // Modal de advertencia personalizado
            if (!document.getElementById('modal-advertencia-empleados')) {
                const modal = document.createElement('div');
                modal.id = 'modal-advertencia-empleados';
                modal.innerHTML = `
                    <div class="modal-advertencia-overlay"></div>
                    <div class="modal-advertencia-content">
                        <div class="modal-advertencia-icon">⚠️</div>
                        <div class="modal-advertencia-title">¿Estás seguro?</div>
                        <div class="modal-advertencia-message">Esta acción no se puede deshacer</div>
                        <div class="modal-advertencia-actions">
                            <button class="modal-advertencia-btn-aceptar">Aceptar</button>
                            <button class="modal-advertencia-btn-cancelar">Cancelar</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                
                // Estilos del modal de advertencia
                if (!document.getElementById('modal-advertencia-style-empleados')) {
                    const style = document.createElement('style');
                    style.id = 'modal-advertencia-style-empleados';
                    style.textContent = `
                        #modal-advertencia-empleados {
                            display: none;
                            position: fixed;
                            z-index: 3000;
                            left: 0; top: 0; width: 100vw; height: 100vh;
                            align-items: center; justify-content: center;
                        }
                        #modal-advertencia-empleados .modal-advertencia-overlay {
                            position: absolute; left: 0; top: 0; width: 100vw; height: 100vh;
                            background: rgba(0,0,0,0.4);
                        }
                        #modal-advertencia-empleados .modal-advertencia-content {
                            position: relative;
                            background: #fff;
                            border-radius: 16px;
                            padding: 24px;
                            min-width: 320px;
                            max-width: 400px;
                            text-align: center;
                            box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                        }
                        #modal-advertencia-empleados .modal-advertencia-icon {
                            font-size: 48px;
                            margin-bottom: 16px;
                        }
                        #modal-advertencia-empleados .modal-advertencia-title {
                            font-size: 20px;
                            font-weight: bold;
                            margin-bottom: 8px;
                        }
                        #modal-advertencia-empleados .modal-advertencia-message {
                            color: #666;
                            margin-bottom: 24px;
                        }
                        #modal-advertencia-empleados .modal-advertencia-actions {
                            display: flex;
                            gap: 12px;
                        }
                        #modal-advertencia-empleados .modal-advertencia-btn-aceptar,
                        #modal-advertencia-empleados .modal-advertencia-btn-cancelar {
                            flex: 1;
                            padding: 12px;
                            border: none;
                            border-radius: 8px;
                            font-weight: bold;
                            cursor: pointer;
                        }
                        #modal-advertencia-empleados .modal-advertencia-btn-aceptar {
                            background: #f44336;
                            color: white;
                        }
                        #modal-advertencia-empleados .modal-advertencia-btn-cancelar {
                            background: #e0e0e0;
                            color: #333;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
            
            const modal = document.getElementById('modal-advertencia-empleados');
            modal.style.display = 'flex';
            
            // Cerrar modal
            modal.querySelector('.modal-advertencia-overlay').onclick = closeModal;
            modal.querySelector('.modal-advertencia-btn-cancelar').onclick = closeModal;
            
            function closeModal() {
                modal.style.display = 'none';
            }
            
            // Eliminar empleado
            modal.querySelector('.modal-advertencia-btn-aceptar').onclick = async function() {
                closeModal();
                
                if (filaSeleccionada) {
                    // CORREGIR: El nombre de usuario está en la primera celda (índice 0)
                    const celdas = filaSeleccionada.querySelectorAll('td');
                    const nombreUsuario = celdas[0]?.textContent.trim(); // Primera celda: nombreUsuario
                    
                    console.log('Intentando eliminar empleado:', nombreUsuario);
                    console.log('Celdas disponibles:', Array.from(celdas).map(celda => celda.textContent));
                    
                    if (nombreUsuario) {
                        try {
                            await deleteEmpleado(nombreUsuario);
                            
                            // Limpiar selección después de eliminar
                            filaSeleccionada.classList.remove('selected-row');
                            filaSeleccionada = null;
                            
                            mostrarSnackbar('El empleado ha sido eliminado con éxito');
                        } catch (error) {
                            console.error('Error al eliminar empleado:', error);
                            mostrarSnackbar('Error al eliminar el empleado', true);
                        }
                    } else {
                        console.error('No se pudo obtener el nombre de usuario de la fila seleccionada');
                        mostrarSnackbar('Error: No se pudo identificar el empleado a eliminar', true);
                    }
                }
            };
        });
    }

    // Función para mostrar snackbar
    function mostrarSnackbar(mensaje, esError = false) {
        let snackbar = document.getElementById('snackbar-empleados');
        if (!snackbar) {
            snackbar = document.createElement('div');
            snackbar.id = 'snackbar-empleados';
            snackbar.className = 'snackbar-empleados';
            document.body.appendChild(snackbar);
            
            if (!document.getElementById('snackbar-style-empleados')) {
                const style = document.createElement('style');
                style.id = 'snackbar-style-empleados';
                style.textContent = `
                    .snackbar-empleados {
                        min-width: 320px;
                        max-width: 400px;
                        background: #4caf50;
                        color: white;
                        text-align: center;
                        border-radius: 18px;
                        padding: 18px 24px;
                        position: fixed;
                        z-index: 4000;
                        right: 32px;
                        bottom: 32px;
                        font-size: 1.1rem;
                        box-shadow: 0 2px 16px rgba(0,0,0,0.18);
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.4s, bottom 0.4s;
                    }
                    .snackbar-empleados.show {
                        opacity: 1;
                        pointer-events: auto;
                        bottom: 48px;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        snackbar.style.background = esError ? '#f44336' : '#4caf50';
        snackbar.textContent = mensaje;
        snackbar.classList.add('show');
        setTimeout(() => {
            snackbar.classList.remove('show');
        }, 3000);
    }
});
