document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let productos = [];
  let filaSeleccionada = null;
  let productosOriginales = []; // Copia de todos los productos

  // ELIMINAR DATOS DE EJEMPLO COMPLETAMENTE
  // const datosEjemplo = [...]; // ELIMINAR ESTA SECCIÓN

  // Crear modal para agregar producto
  function crearModalProducto() {
    const modal = document.createElement("div");
    modal.id = "modal-producto";
    modal.className = "modal-overlay";
    
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Agregar Producto</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="form-producto" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Escanee o escriba el código del producto</label>
              <input type="text" id="codigo-producto" name="codigo" required placeholder="">
            </div>
            
            <div class="form-group">
              <label>Escriba el contenido</label>
              <input type="text" id="contenido" name="contenido" required placeholder="Ejem. 500">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Escriba el nombre</label>
              <input type="text" id="nombre-producto" name="nombre" required placeholder="Ejem. Cloro">
            </div>
            
            <div class="form-group">
              <label>Categoría</label>
              <div class="dropdown-field">
                <select id="categoria-producto" name="categoria" required>
                  <option value="">Categoría</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="snacks">Snacks</option>
                  <option value="dulces">Dulces</option>
                  <option value="lacteos">Lácteos</option>
                  <option value="panaderia">Panadería</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="higiene">Higiene Personal</option>
                </select>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Escriba la marca</label>
              <input type="text" id="marca-producto" name="marca" required placeholder="Ejem. Cloralex">
            </div>
            
            <div class="form-group">
              <label>Escriba el envase</label>
              <div class="dropdown-field">
                <select id="envase" name="envase" required>
                  <option value="">Escriba el envase</option>
                  <option value="botella">Botella</option>
                  <option value="lata">Lata</option>
                  <option value="bolsa">Bolsa</option>
                  <option value="caja">Caja</option>
                  <option value="frasco">Frasco</option>
                  <option value="tetrapack">Tetrapack</option>
                  <option value="sobre">Sobre</option>
                </select>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Escriba la variedad</label>
              <input type="text" id="variedad" name="variedad" required placeholder="Ejem. Gel">
            </div>
            
            <div class="form-group">
              <label>Medida</label>
              <div class="medida-container">
                <input type="text" value="Medida" readonly class="medida-label">
                <div class="dropdown-field">
                  <select id="medida" name="medida" required>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="pz">pz</option>
                  </select>
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio</label>
              <input type="number" id="precio" name="precio" step="0.01" required placeholder="0.00">
            </div>
          </div>
          
          <div class="modal-buttons">
            <button type="button" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-accept">Aceptar</button>
          </div>
        </form>
      </div>
    `;

    // Agregar estilos CSS inline para asegurar que funcione
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    `;

    // Estilos para el contenedor del modal
    const modalContainer = modal.querySelector('.modal-container');
    if (modalContainer) {
      modalContainer.style.cssText = `
        background: #f5f5f0;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
      `;
    }

    document.body.appendChild(modal);
    return modal;
  }

  // Crear modal para editar producto
  function crearModalEditar() {
    const modal = document.createElement("div");
    modal.id = "modal-editar-producto";
    modal.className = "modal-overlay";
    
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Editar Producto</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="form-editar-producto" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Código del producto</label>
              <input type="text" id="edit-codigo-producto" name="codigo" readonly style="background-color: #f5f5f5;">
            </div>
            
            <div class="form-group">
              <label>Contenido</label>
              <input type="text" id="edit-contenido" name="contenido" required placeholder="Ejem. 500">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" id="edit-nombre-producto" name="nombre" required placeholder="Ejem. Cloro">
            </div>
            
            <div class="form-group">
              <label>Categoría</label>
              <div class="dropdown-field">
                <select id="edit-categoria-producto" name="categoria" required>
                  <option value="">Seleccionar categoría</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="snacks">Snacks</option>
                  <option value="dulces">Dulces</option>
                  <option value="lacteos">Lácteos</option>
                  <option value="panaderia">Panadería</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="higiene">Higiene Personal</option>
                  <option value="cocina">Cocina</option>
                  <option value="frituras">Frituras</option>
                </select>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Marca</label>
              <input type="text" id="edit-marca-producto" name="marca" required placeholder="Ejem. Cloralex">
            </div>
            
            <div class="form-group">
              <label>Envase</label>
              <div class="dropdown-field">
                <select id="edit-envase" name="envase" required>
                  <option value="">Seleccionar envase</option>
                  <option value="botella">Botella</option>
                  <option value="lata">Lata</option>
                  <option value="bolsa">Bolsa</option>
                  <option value="caja">Caja</option>
                  <option value="frasco">Frasco</option>
                  <option value="tetrapack">Tetrapack</option>
                  <option value="sobre">Sobre</option>
                </select>
                <i class="fas fa-chevron-down dropdown-icon"></i>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Variedad</label>
              <input type="text" id="edit-variedad" name="variedad" required placeholder="Ejem. Gel">
            </div>
            
            <div class="form-group">
              <label>Medida</label>
              <div class="medida-container">
                <input type="text" value="Medida" readonly class="medida-label">
                <div class="dropdown-field">
                  <select id="edit-medida" name="medida" required>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="pz">pz</option>
                    <option value="Ml">Ml</option>
                    <option value="m">m</option>
                  </select>
                  <i class="fas fa-chevron-down dropdown-icon"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio</label>
              <input type="number" id="edit-precio" name="precio" step="0.01" required placeholder="0.00">
            </div>
          </div>
          
          <div class="modal-buttons">
            <button type="button" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-accept">Guardar Cambios</button>
          </div>
        </form>
      </div>
    `;

    return modal;
  }

  // Crear modal para eliminar producto
  function crearModalEliminar() {
    // Verificar si ya existe un modal
    const modalExistente = document.getElementById('modal-advertencia');
    if (modalExistente) {
      modalExistente.remove();
    }

    // Crear el modal usando el mismo diseño que modalAdvertencia.js
    const modal = document.createElement('div');
    modal.id = 'modal-advertencia';
    modal.innerHTML = `
      <div class="modal-advertencia-overlay"></div>
      <div class="modal-advertencia-content">
        <div class="modal-advertencia-icon">&#9888;</div>
        <div class="modal-advertencia-title">Advertencia</div>
        <div class="modal-advertencia-text">Esta a punto de eliminar un producto<br>de esta sección,<br>¿está seguro de querer realizar esta acción?</div>
        <div class="modal-advertencia-actions">
          <button class="modal-advertencia-btn-aceptar">Aceptar</button>
          <button class="modal-advertencia-btn-cancelar">Cancelar</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Aplicar estilos del modal de advertencia
    aplicarEstilosModalAdvertencia();
    
    // Configurar eventos del modal de eliminar
    setupModalAdvertenciaEvents(modal);
    
    // Mostrar modal con animación
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('mostrar'), 10);
    
    return modal;
  }

  // Función para aplicar estilos específicos del modal de advertencia
  function aplicarEstilosModalAdvertencia() {
    // Verificar si ya existen los estilos
    if (document.getElementById('modal-advertencia-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'modal-advertencia-styles';
    style.textContent = `
      #modal-advertencia {
        display: none;
        position: fixed;
        z-index: 3000;
        left: 0; 
        top: 0; 
        width: 100vw; 
        height: 100vh;
        align-items: center; 
        justify-content: center;
      }

      #modal-advertencia .modal-advertencia-overlay {
        position: absolute; 
        left: 0; 
        top: 0; 
        width: 100vw; 
        height: 100vh;
        background: rgba(0,0,0,0.4);
      }

      #modal-advertencia .modal-advertencia-content {
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
        opacity: 0;
        transform: scale(0.85);
        transition: opacity 0.28s cubic-bezier(.4,1.3,.6,1), transform 0.28s cubic-bezier(.4,1.3,.6,1);
      }

      #modal-advertencia.mostrar .modal-advertencia-content {
        opacity: 1;
        transform: scale(1);
      }

      #modal-advertencia .modal-advertencia-icon {
        font-size: 3.5rem;
        color: #222;
        margin-bottom: 8px;
      }

      #modal-advertencia .modal-advertencia-title {
        font-size: 2rem;
        font-weight: bold;
        margin-bottom: 8px;
        color: #222;
      }

      #modal-advertencia .modal-advertencia-text {
        font-size: 1.2rem;
        color: #222;
        text-align: center;
        margin-bottom: 24px;
        line-height: 1.4;
      }

      #modal-advertencia .modal-advertencia-actions {
        display: flex;
        justify-content: center;
        gap: 48px;
        width: 100%;
      }

      #modal-advertencia .modal-advertencia-btn-aceptar, 
      #modal-advertencia .modal-advertencia-btn-cancelar {
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

      #modal-advertencia .modal-advertencia-btn-aceptar:hover {
        background: #b8e6b8;
      }

      #modal-advertencia .modal-advertencia-btn-cancelar:hover {
        background: #f2bcbc;
      }

      /* Responsive para pantallas pequeñas */
      @media (max-width: 480px) {
        #modal-advertencia .modal-advertencia-content {
          min-width: 320px;
          padding: 30px 25px 25px 25px;
          margin: 20px;
        }
        
        #modal-advertencia .modal-advertencia-icon {
          font-size: 2.8rem;
        }
        
        #modal-advertencia .modal-advertencia-title {
          font-size: 1.6rem;
        }
        
        #modal-advertencia .modal-advertencia-text {
          font-size: 1rem;
        }
        
        #modal-advertencia .modal-advertencia-actions {
          gap: 20px;
        }
        
        #modal-advertencia .modal-advertencia-btn-aceptar, 
        #modal-advertencia .modal-advertencia-btn-cancelar {
          font-size: 1.1rem;
          padding: 12px 0;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // Función para configurar eventos del modal de advertencia
  function setupModalAdvertenciaEvents(modal) {
    const btnAceptar = modal.querySelector('.modal-advertencia-btn-aceptar');
    const btnCancelar = modal.querySelector('.modal-advertencia-btn-cancelar');
    const overlay = modal.querySelector('.modal-advertencia-overlay');

    // Función para cerrar modal with animación
    function cerrarModal() {
      modal.classList.remove('mostrar');
      setTimeout(() => { 
        if (modal.parentNode) {
          modal.remove(); 
        }
      }, 280);
    }

    // Evento para cerrar modal con Escape
    function handleEscape(e) {
      if (e.key === 'Escape') {
        cerrarModal();
      }
    }

    document.addEventListener('keydown', handleEscape);

    // Limpiar listeners previos
    btnAceptar.onclick = null;
    btnCancelar.onclick = null;
    overlay.onclick = null;

    // Evento del botón aceptar (confirmar eliminación)
    btnAceptar.onclick = function() {
      confirmarEliminar();
      cerrarModal();
      document.removeEventListener('keydown', handleEscape);
    };

    // Evento del botón cancelar
    btnCancelar.onclick = function() {
      cerrarModal();
      document.removeEventListener('keydown', handleEscape);
    };

    // Evento para cerrar modal al hacer clic en overlay
    overlay.onclick = function() {
      cerrarModal();
      document.removeEventListener('keydown', handleEscape);
    };
  }

  // Confirmar eliminación
  async function confirmarEliminar() {
    if (!filaSeleccionada) return;

    const celdas = filaSeleccionada.querySelectorAll("td");
    const codigo = celdas[0].textContent.trim();

    try {
      // Usar el servicio real del backend
      if (typeof window.deleteProducto === 'function') {
        await window.deleteProducto(codigo);
        filaSeleccionada = null;
        mostrarAlertaVisual("Producto eliminado exitosamente.");
      } else {
        throw new Error('Servicio no disponible');
      }
      
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      mostrarAlertaVisual('Error al eliminar el producto: ' + error.message);
    }
  }

  // Función para mostrar alerta visual
  function mostrarAlertaVisual(mensaje) {
    // Crear elemento de alerta si no existe
    let alerta = document.getElementById('alerta-visual');
    if (!alerta) {
      alerta = document.createElement('div');
      alerta.id = 'alerta-visual';
      alerta.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10001;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      document.body.appendChild(alerta);
    }
    
    alerta.textContent = mensaje;
    alerta.style.opacity = '1';
    
    setTimeout(() => {
      alerta.style.opacity = '0';
    }, 3000);
  }

  // Función para capitalizar texto - CORREGIDA
  function capitalizarTexto(texto) {
    // Validar que el texto sea válido y convertirlo a string
    if (!texto || texto === null || texto === undefined) return '';
    
    // Convertir a string si no lo es
    const textoStr = String(texto);
    
    // Verificar que no esté vacío después de la conversión
    if (textoStr.length === 0) return '';
    
    return textoStr.charAt(0).toUpperCase() + textoStr.slice(1).toLowerCase();
  }

  // Función para abrir modal de agregar producto
  function abrirModalProducto() {
    console.log("Abriendo modal de producto...");
    
    // Crear modal
    const modal = crearModalProducto();
    
    // Configurar eventos del modal
    configurarEventosModal(modal, async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      const datosProducto = {
        codigo: (formData.get("codigo") || '').trim(),
        nombre: (formData.get("nombre") || '').trim(),
        marca: (formData.get("marca") || '').trim(),
        variedad: (formData.get("variedad") || '').trim(),
        contenido: (formData.get("contenido") || '0').trim(),
        categoria: (formData.get("categoria") || '').trim(),
        envase: (formData.get("envase") || '').trim(),
        medida: (formData.get("medida") || 'pz').trim(),
        precio: parseFloat(formData.get("precio")) || 0
      };

      console.log("Datos a enviar:", datosProducto);

      // Validar datos antes de enviar
      if (!datosProducto.codigo) {
        mostrarAlertaVisual('Error: El código es requerido');
        return;
      }
      if (!datosProducto.nombre) {
        mostrarAlertaVisual('Error: El nombre es requerido');
        return;
      }
      if (!datosProducto.marca) {
        mostrarAlertaVisual('Error: La marca es requerida');
        return;
      }
      if (!datosProducto.categoria) {
        mostrarAlertaVisual('Error: La categoría es requerida');
        return;
      }
      if (!datosProducto.envase) {
        mostrarAlertaVisual('Error: El envase es requerido');
        return;
      }

      try {
        // Usar el servicio real del backend
        if (typeof window.postProducto === 'function') {
          await window.postProducto(datosProducto);
          cerrarModal(modal);
          mostrarAlertaVisual("Producto agregado exitosamente");
        } else {
          throw new Error('Servicio no disponible');
        }
        
      } catch (error) {
        console.error('Error al agregar producto:', error);
        mostrarAlertaVisual('Error al agregar el producto: ' + error.message);
      }
    });

    // Mostrar modal
    mostrarModal(modal);
  }

  // Función para abrir modal de editar producto
  function abrirModalEditar() {
    if (!filaSeleccionada) {
      mostrarAlertaVisual('Por favor selecciona un producto para editar');
      return;
    }

    console.log("Abriendo modal de editar...");
    
    // Obtener datos de la fila seleccionada
    const celdas = filaSeleccionada.querySelectorAll('td');
    const datosActuales = {
      codigo: celdas[0]?.textContent?.trim() || '',
      categoria: celdas[1]?.textContent?.trim() || '',
      marca: celdas[2]?.textContent?.trim() || '',
      nombre: celdas[3]?.textContent?.trim() || '',
      envase: celdas[4]?.textContent?.trim() || '',
      variedad: celdas[5]?.textContent?.trim() || '',
      contenido: celdas[6]?.textContent?.trim() || '',
      medida: celdas[7]?.textContent?.trim() || '',
      precio: celdas[8]?.textContent?.replace('$', '').trim() || ''
    };

    console.log('Datos actuales extraídos:', datosActuales);

    const modal = crearModalEditar();
    document.body.appendChild(modal);

    // IMPORTANTE: Prellenar campos después de que el modal esté en el DOM
    setTimeout(() => {
      // Prellenar campos
      const codigoInput = modal.querySelector('#edit-codigo-producto');
      const nombreInput = modal.querySelector('#edit-nombre-producto');
      const marcaInput = modal.querySelector('#edit-marca-producto');
      const envaseSelect = modal.querySelector('#edit-envase');
      const categoriaSelect = modal.querySelector('#edit-categoria-producto');
      const variedadInput = modal.querySelector('#edit-variedad');
      const contenidoInput = modal.querySelector('#edit-contenido');
      const medidaSelect = modal.querySelector('#edit-medida');
      const precioInput = modal.querySelector('#edit-precio');

      if (codigoInput) codigoInput.value = datosActuales.codigo;
      if (nombreInput) nombreInput.value = datosActuales.nombre;
      if (marcaInput) marcaInput.value = datosActuales.marca;
      if (variedadInput) variedadInput.value = datosActuales.variedad;
      if (contenidoInput) contenidoInput.value = datosActuales.contenido;
      if (precioInput) precioInput.value = datosActuales.precio;

      // CRÍTICO: Asignar valores a los selects
      if (envaseSelect && datosActuales.envase) {
        // Buscar la opción que coincida con el valor actual
        const opcionEnvase = Array.from(envaseSelect.options).find(option => 
          option.textContent.toLowerCase().trim() === datosActuales.envase.toLowerCase().trim()
        );
        if (opcionEnvase) {
          envaseSelect.value = opcionEnvase.value;
        } else {
          // Si no existe, crear una nueva opción
          const newOption = document.createElement('option');
          newOption.value = datosActuales.envase;
          newOption.textContent = datosActuales.envase;
          newOption.selected = true;
          envaseSelect.appendChild(newOption);
        }
      }

      // CRÍTICO: Asignar categoría
      if (categoriaSelect && datosActuales.categoria) {
        // Buscar la opción que coincida con el valor actual
        const opcionCategoria = Array.from(categoriaSelect.options).find(option => 
          option.textContent.toLowerCase().trim() === datosActuales.categoria.toLowerCase().trim()
        );
        if (opcionCategoria) {
          categoriaSelect.value = opcionCategoria.value;
        } else {
          // Si no existe, crear una nueva opción
          const newOption = document.createElement('option');
          newOption.value = datosActuales.categoria;
          newOption.textContent = datosActuales.categoria;
          newOption.selected = true;
          categoriaSelect.appendChild(newOption);
        }
      }

      // CRÍTICO: Asignar medida
      if (medidaSelect && datosActuales.medida) {
        const opcionMedida = Array.from(medidaSelect.options).find(option => 
          option.value.toLowerCase() === datosActuales.medida.toLowerCase()
        );
        if (opcionMedida) {
          medidaSelect.value = opcionMedida.value;
        } else {
          // Si no existe, crear una nueva opción
          const newOption = document.createElement('option');
          newOption.value = datosActuales.medida;
          newOption.textContent = datosActuales.medida;
          newOption.selected = true;
          medidaSelect.appendChild(newOption);
        }
      }

      console.log('Campos prellenados correctamente');
    }, 100);

    // Configurar eventos del modal
    configurarEventosModal(modal, async (e) => {
      e.preventDefault();
      
      // Recoger datos del formulario
      const formData = new FormData(e.target);
      const datosProducto = {};
      
      for (let [key, value] of formData.entries()) {
        datosProducto[key] = value;
      }
      
      console.log('Datos del formulario para editar:', datosProducto);
      
      // VALIDACIÓN ADICIONAL antes de enviar
      if (!datosProducto.categoria || datosProducto.categoria.trim() === '') {
        mostrarAlertaVisual('Por favor selecciona una categoría');
        return;
      }
      
      if (!datosProducto.envase || datosProducto.envase.trim() === '') {
        mostrarAlertaVisual('Por favor selecciona un envase');
        return;
      }
      
      try {
        // Usar putProducto del servicio
        if (typeof window.putProducto === 'function') {
          await window.putProducto(datosActuales.codigo, datosProducto);
          cerrarModal(modal);
          mostrarAlertaVisual('Producto editado exitosamente');
        } else {
          throw new Error('Función putProducto no disponible');
        }
      } catch (error) {
        console.error('Error al editar producto:', error);
        mostrarAlertaVisual('Error al editar el producto: ' + error.message);
      }
    });

    // Mostrar modal
    mostrarModal(modal);
  }

  // Función para eliminar producto
  function eliminarProducto() {
    if (!filaSeleccionada) {
      mostrarAlertaVisual("Por favor, selecciona un producto para eliminar");
      return;
    }

    console.log("Abriendo modal de eliminar...");
    crearModalEliminar();
  }

  // Función para configurar eventos de modal
  function configurarEventosModal(modal, onSubmit) {
    const form = modal.querySelector('form');
    const btnClose = modal.querySelector('.modal-close');
    const btnCancel = modal.querySelector('.btn-cancel');

    // Evento de submit del formulario
    if (form && onSubmit) {
      form.addEventListener('submit', onSubmit);
    }

    // Eventos para cerrar modal
    if (btnClose) {
      btnClose.addEventListener('click', () => cerrarModal(modal));
    }

    if (btnCancel) {
      btnCancel.addEventListener('click', () => cerrarModal(modal));
    }

    // Cerrar con Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        cerrarModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Cerrar al hacer clic en el overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        cerrarModal(modal);
      }
    });
  }

  // Función para mostrar modal
  function mostrarModal(modal) {
    modal.style.display = 'flex';
    modal.style.visibility = 'visible';
    modal.style.opacity = '1';
    
    const container = modal.querySelector('.modal-container');
    if (container) {
      container.style.transform = 'scale(1)';
    }
  }

  // Función para cerrar modal
  function cerrarModal(modal) {
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
    
    const container = modal.querySelector('.modal-container');
    if (container) {
      container.style.transform = 'scale(0.9)';
    }
    
    setTimeout(() => {
      if (modal.parentNode) {
        modal.remove();
      }
    }, 300);
  }

  // Función para seleccionar fila (mejorada)
  function seleccionarFila(fila) {
    // Quitar selección anterior
    if (filaSeleccionada) {
      filaSeleccionada.classList.remove('selected');
    }

    // Seleccionar nueva fila
    filaSeleccionada = fila;
    fila.classList.add('selected');
    
    console.log("Fila seleccionada:", fila);
    
    // Exponer la fila seleccionada globalmente
    window.formProducto = window.formProducto || {};
    window.formProducto.filaSeleccionada = fila;
  }

  // Función para configurar selección de filas (mejorada)
  function setupRowSelection() {
    // Esta función se llama desde el servicio después de actualizar la tabla
    console.log('Configurando selección de filas...');
  }

  // Exponer función para que el servicio pueda actualizar la fila seleccionada
  window.formProducto = window.formProducto || {};
  window.formProducto.setFilaSeleccionada = function(fila) {
    filaSeleccionada = fila;
    console.log('Fila seleccionada actualizada desde servicio:', fila);
  };

  // NUEVO: Exponer función de selección globalmente
  window.seleccionarFilaProducto = seleccionarFila;

  // Función para cargar productos en la tabla - MODIFICADA para NO duplicar eventos
  function cargarProductos() {
    console.log('Cargando productos en tabla...');
    const tbody = document.querySelector('.productos-table tbody');
    if (!tbody) {
      console.warn('No se encontró la tabla de productos');
      return;
    }
    
    // NO agregar eventos aquí porque ya se agregan en productosServices.js
    // Solo actualizar la variable productos local
    productos = window.productosGlobales || [];
    
    console.log(`Variable productos actualizada con ${productos.length} productos`);
  }

  // Función para cargar productos desde el backend al inicializar
  async function cargarProductosDesdeBackend() {
    try {
      console.log('Cargando productos desde backend...');
      if (typeof window.getProductos === 'function') {
        const productosBackend = await window.getProductos();
        productos = productosBackend || [];
        window.productosGlobales = productos; // Exponer globalmente
        console.log('Productos cargados:', productos);
        // La tabla se actualiza automáticamente desde productosServices.js
      } else {
        console.warn('Función getProductos no disponible');
      }
    } catch (error) {
      console.error('Error cargando productos desde backend:', error);
      mostrarAlertaVisual('Error al conectar con el servidor');
    }
  }

  // Función para inicializar el formulario
  function init() {
    console.log("Inicializando formProducto.js..."); // Debug
    
    // Cargar datos desde el backend - SIN DATOS DE EJEMPLO
    cargarProductosDesdeBackend();

    // Configurar event listeners de los botones del HTML
    const btnAgregar = document.querySelector(".btn-add");
    const btnEditar = document.querySelector(".btn-edit");
    const btnEliminar = document.querySelector(".btn-category");

    console.log("Botones encontrados:", { btnAgregar, btnEditar, btnEliminar }); // Debug

    if (btnAgregar) {
      btnAgregar.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Click en botón agregar"); // Debug
        abrirModalProducto();
      });
    }

    if (btnEditar) {
      btnEditar.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Click en botón editar"); // Debug
        abrirModalEditar();
      });
    }

    if (btnEliminar) {
      btnEliminar.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Click en botón eliminar"); // Debug
        eliminarProducto();
      });
    }

    // Configurar selección de filas
    setupRowSelection();

    // Función global para abrir el modal desde cualquier parte
    window.abrirFormularioProducto = abrirModalProducto;
  }

  // Inicializar
  init();

  // Agregar estilos CSS para el modal si no existen
  if (!document.getElementById('modal-styles')) {
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .modal-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .modal-container {
        background: #f5f5f0;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
      }

      .modal-overlay.active .modal-container {
        transform: scale(1);
      }

      .modal-small {
        max-width: 400px;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 25px;
        border-bottom: 2px solid #333;
        background: #e8e8d0;
        border-radius: 15px 15px 0 0;
      }

      .modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        transition: all 0.2s ease;
      }

      .modal-close:hover {
        background: #d0d0c0;
        color: #333;
      }

      .modal-form {
        padding: 25px;
      }

      .modal-content {
        padding: 25px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
        font-size: 14px;
      }

      .form-group input,
      .form-group select {
        width: 100%;
        padding: 12px 15px;
        border: 2px solid #333;
        border-radius: 8px;
        font-size: 14px;
        background: white;
        color: #333;
        transition: all 0.2s ease;
        box-sizing: border-box;
      }

      .form-group input:focus,
      .form-group select:focus {
        outline: none;
        border-color: #666;
        box-shadow: 0 0 0 3px rgba(102, 102, 102, 0.1);
      }

      .form-group input::placeholder {
        color: #999;
        font-style: italic;
      }

      .dropdown-field {
        position: relative;
      }

      .dropdown-field select {
        appearance: none;
        background-color: white;
        padding-right: 30px;
      }

      .dropdown-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: #666;
      }

      .medida-container {
        display: flex;
        gap: 10px;
      }

      .medida-label {
        flex: 1;
        background-color: #f5f5f0 !important;
        color: #666;
        border: 2px solid #333;
      }

      .modal-buttons {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 25px;
      }

      .btn-cancel,
      .btn-accept {
        padding: 12px 30px;
        border: 2px solid #333;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 120px;
      }

      .btn-cancel {
        background: white;
        color: #333;
      }

      .btn-cancel:hover {
        background: #f0f0f0;
        transform: translateY(-2px);
      }

      .btn-accept {
        background: #d4f4d4;
        color: #333;
      }

      .btn-accept:hover {
        background: #c0e8c0;
        transform: translateY(-2px);
      }

      .btn-delete-confirm {
        padding: 12px 30px;
        border: 2px solid #d32f2f;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 120px;
        background: #ffebee;
        color: #d32f2f;
      }

      .btn-delete-confirm:hover {
        background: #ffcdd2;
        transform: translateY(-2px);
      }

      /* Estilos especiales para el modal de advertencia */
      .advertencia-modal {
        background: #D4C5A1 !important;
        border: 4px solid #8B7355 !important;
        border-radius: 20px !important;
        width: 600px !important;
        height: 451px !important;
        text-align: center !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        padding: 0;
        box-sizing: border-box !important;
      }

      .advertencia-modal .modal-content {
        padding: 0 !important;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .advertencia-modal .delete-warning {
        text-align: center;
        padding: 0;
        margin-bottom: 40px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .advertencia-modal .delete-warning i {
        font-size: 80px;
        color: #333;
        margin-bottom: 20px;
        display: block;
      }

      .advertencia-modal .delete-warning h3 {
        font-size: 32px;
        font-weight: bold;
        color: #333;
        margin: 0 0 30px 0;
        font-family: Arial, sans-serif;
      }

      .advertencia-modal .delete-warning p {
        font-size: 18px;
        color: #333;
        line-height: 1.5;
        margin: 0;
        max-width: 500px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
        font-weight: 400;
      }

      .advertencia-modal .modal-buttons {
        display: flex;
        gap: 20px;
        justify-content: center;
        margin-top: 0;
        margin-bottom: 20px;
      }

      .btn-accept-advertencia,
      .btn-cancel-advertencia {
        background: white;
        color: #333;
        border: none;
        border-radius: 25px;
        padding: 15px 35px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        font-family: Arial, sans-serif;
      }

      .btn-accept-advertencia:hover,
      .btn-cancel-advertencia:hover {
        background: #f0f0f0;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
      }

      /* Responsive para pantallas pequeñas */
      @media (max-width: 650px) {
        .advertencia-modal {
          width: 90vw !important;
          height: auto !important;
          min-height: 400px !important;
          max-height: 90vh !important;
        }
        
        .advertencia-modal .delete-warning i {
          font-size: 60px;
        }
        
        .advertencia-modal .delete-warning h3 {
          font-size: 24px;
        }
        
        .advertencia-modal .delete-warning p {
          font-size: 16px;
        }
        
        .btn-accept-advertencia,
        .btn-cancel-advertencia {
          padding: 12px 25px;
          font-size: 14px;
        }
      }

      /* Estilos para el modal de eliminación */
      .delete-warning {
        text-align: center;
        padding: 20px 0;
      }

      .delete-warning i {
        font-size: 48px;
        color: #ff9800;
        margin-bottom: 15px;
      }

      .delete-warning p {
        margin: 10px 0;
        color: #333;
        line-height: 1.5;
      }

      .delete-product-info {
        font-size: 13px;
        color: #666;
        font-style: italic;
      }

      .productos-table tbody tr.selected {
        background-color: #e3f2fd !important;
      }

      .productos-table tbody tr:hover {
        background-color: #f5f5f5;
        cursor: pointer;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .modal-container {
          width: 95%;
          margin: 10px;
        }
        
        .form-row {
          grid-template-columns: 1fr;
        }
        
        .modal-buttons {
          flex-direction: column;
        }
      }
    `;
    document.head.appendChild(style);
  }
});