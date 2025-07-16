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
                            <label class="modal-agregar-label"><b>Nombre del empleado</b></label>
                            <input class="modal-agregar-input" type="text" placeholder="" required>
                        </div>
                        <div class="modal-agregar-group">
                            <label class="modal-agregar-label"><b>Dirección</b></label>
                            <div class="modal-agregar-placeholder">Ejem. Calle 4ta</div>
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
                                <option value="">▼ Empleado</option>
                                <option value="empleado">Empleado</option>
                                <option value="admin">Administrador</option>
                            </select>
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
            modal.querySelector('.modal-agregar-content').onsubmit = function(e) {
                e.preventDefault();
                // Obtener valores de los campos
                const inputs = modal.querySelectorAll('.modal-agregar-input');
                const nombre = inputs[0].value.trim();
                const direccion = inputs[1].value.trim();
                const correo = inputs[2].value.trim();
                const contrasena = inputs[3].value.trim();
                const rol = inputs[4].value || 'Empleado';
                // Validar campos (opcional, ya que el form tiene required)
                if (!nombre || !direccion || !correo || !contrasena || !rol) {
                    return;
                }
                // Buscar la tabla y agregar la fila
                const tbody = document.querySelector('.products-table tbody');
                if (tbody) {
                    // Calcular nuevo ID (simple: siguiente al mayor actual)
                    let maxId = 0;
                    tbody.querySelectorAll('tr').forEach(tr => {
                        const idCell = tr.querySelector('td');
                        if (idCell && !isNaN(parseInt(idCell.textContent))) {
                            maxId = Math.max(maxId, parseInt(idCell.textContent));
                        }
                    });
                    const nuevoId = maxId + 1;
                    // Crear la fila (ajusta columnas según tu tabla)
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${nuevoId}</td>
                        <td>${nombre}</td>
                        <td>${direccion}</td>
                        <td>${correo}</td>
                        <td>${rol.charAt(0).toUpperCase() + rol.slice(1)}</td>
                    `;
                    // Si hay una fila seleccionada, insertar después de esa fila
                    if (filaSeleccionada && filaSeleccionada.parentNode === tbody) {
                        if (filaSeleccionada.nextSibling) {
                            tbody.insertBefore(tr, filaSeleccionada.nextSibling);
                        } else {
                            tbody.appendChild(tr);
                        }
                    } else {
                        tbody.appendChild(tr);
                    }
                }
                closeModal();
                // Mostrar alerta tipo snackbar
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
                snackbar.textContent = 'Empleado agregado con éxito';
                snackbar.classList.add('show');
                setTimeout(() => {
                    snackbar.classList.remove('show');
                }, 2500);
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
            // Obtener datos actuales de la fila seleccionada
            const celdas = filaSeleccionada.querySelectorAll('td');
            const id = celdas[0]?.textContent || '';
            const nombre = celdas[1]?.textContent || '';
            const direccion = celdas[2]?.textContent || '';
            const correo = celdas[3]?.textContent || '';
            const rol = celdas[4]?.textContent?.toLowerCase() || 'empleado';
            // Mostrar el modal de agregar (reutilizado)
            let modal = document.getElementById('modal-agregar-empleado');
            if (!modal) {
                btnAgregar.click();
                modal = document.getElementById('modal-agregar-empleado');
            } else {
                modal.style.display = 'flex';
            }
            // Precargar los valores
            const inputs = modal.querySelectorAll('.modal-agregar-input');
            if (inputs.length >= 5) {
                inputs[0].value = nombre;
                inputs[1].value = direccion;
                inputs[2].value = correo;
                inputs[3].value = '';
                // Seleccionar el rol correcto
                for (let i = 0; i < inputs[4].options.length; i++) {
                    if (inputs[4].options[i].textContent.trim().toLowerCase() === rol) {
                        inputs[4].selectedIndex = i;
                        break;
                    }
                }
            }
            // Cambiar el submit para editar
            const form = modal.querySelector('.modal-agregar-content');
            form.onsubmit = function(e) {
                e.preventDefault();
                // Obtener nuevos valores
                const nuevoNombre = inputs[0].value.trim();
                const nuevaDireccion = inputs[1].value.trim();
                const nuevoCorreo = inputs[2].value.trim();
                const nuevoRol = inputs[4].value || 'Empleado';
                // Validar
                if (!nuevoNombre || !nuevaDireccion || !nuevoCorreo || !nuevoRol) return;
                // Actualizar la fila
                celdas[1].textContent = nuevoNombre;
                celdas[2].textContent = nuevaDireccion;
                celdas[3].textContent = nuevoCorreo;
                celdas[4].textContent = nuevoRol.charAt(0).toUpperCase() + nuevoRol.slice(1);
                modal.style.display = 'none';
                // Alerta de éxito
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
                snackbar.textContent = 'Empleado editado con éxito';
                snackbar.classList.add('show');
                setTimeout(() => {
                    snackbar.classList.remove('show');
                }, 2500);
            };
        });
    }
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function() {
            // Modal de advertencia personalizado
            if (!document.getElementById('modal-advertencia-empleados')) {
                const modal = document.createElement('div');
                modal.id = 'modal-advertencia-empleados';
                modal.innerHTML = `
                    <div class="modal-advertencia-overlay"></div>
                    <div class="modal-advertencia-content">
                        <div class="modal-advertencia-icon">&#9888;</div>
                        <div class="modal-advertencia-title">Advertencia</div>
                        <div class="modal-advertencia-text">Esta a punto de eliminar un cliente<br>de esta sección, ¿está seguro de<br>querer realizar esta acción?</div>
                        <div class="modal-advertencia-actions">
                            <button class="modal-advertencia-btn-aceptar">Aceptar</button>
                            <button class="modal-advertencia-btn-cancelar">Cancelar</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);
                // Estilos solo una vez
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
                            background: #e6e7c7;
                            border-radius: 32px;
                            padding: 38px 38px 32px 38px;
                            min-width: 420px;
                            min-height: 220px;
                            box-shadow: 0 4px 32px rgba(0,0,0,0.18);
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            z-index: 2;
                        }
                        #modal-advertencia-empleados .modal-advertencia-icon {
                            font-size: 3.5rem;
                            color: #222;
                            margin-bottom: 8px;
                        }
                        #modal-advertencia-empleados .modal-advertencia-title {
                            font-size: 2rem;
                            font-weight: bold;
                            margin-bottom: 8px;
                            color: #222;
                        }
                        #modal-advertencia-empleados .modal-advertencia-text {
                            font-size: 1.2rem;
                            color: #222;
                            text-align: center;
                            margin-bottom: 24px;
                        }
                        #modal-advertencia-empleados .modal-advertencia-actions {
                            display: flex;
                            justify-content: center;
                            gap: 48px;
                            width: 100%;
                        }
                        #modal-advertencia-empleados .modal-advertencia-btn-aceptar, #modal-advertencia-empleados .modal-advertencia-btn-cancelar {
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
                        #modal-advertencia-empleados .modal-advertencia-btn-aceptar:hover {
                            background: #b8e6b8;
                        }
                        #modal-advertencia-empleados .modal-advertencia-btn-cancelar:hover {
                            background: #f2bcbc;
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
            // Aquí puedes agregar la lógica de eliminación real en el botón aceptar
            modal.querySelector('.modal-advertencia-btn-aceptar').onclick = function() {
                closeModal();
                // Eliminar la fila seleccionada de la tabla
                let eliminado = false;
                if (filaSeleccionada && filaSeleccionada.parentNode) {
                    filaSeleccionada.parentNode.removeChild(filaSeleccionada);
                    filaSeleccionada = null;
                    eliminado = true;
                }
                // Mostrar alerta tipo snackbar
                mostrarSnackbar(eliminado ? 'El registro ha sido eliminado con éxito' : 'No hay fila seleccionada');
                function mostrarSnackbar(mensaje) {
                    let snackbar = document.getElementById('snackbar-empleados');
                    if (!snackbar) {
                        snackbar = document.createElement('div');
                        snackbar.id = 'snackbar-empleados';
                        snackbar.className = 'snackbar-empleados';
                        document.body.appendChild(snackbar);
                        // Estilos solo una vez
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
                    snackbar.textContent = mensaje;
                    snackbar.classList.add('show');
                    setTimeout(() => {
                        snackbar.classList.remove('show');
                    }, 2500);
                }
            };
        });
    }
});
