document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let productos = [];
  let filaSeleccionada = null;
  let productosOriginales = [];

  // Función auxiliar para procesar datos de combobox - SIMPLIFICADA PARA TU ESTRUCTURA
  function procesarDatosCombobox(data) {
    console.log('Procesando datos recibidos:', data);
    
    if (!data || !Array.isArray(data)) {
      console.log('Datos no válidos o no es array:', data);
      return [];
    }
    
    // Los datos ya vienen como array de strings desde las funciones get*
    const resultado = data.filter(item => 
      item && 
      typeof item === 'string' && 
      item.trim() !== ''
    );
    
    console.log('Datos procesados finales:', resultado);
    return resultado;
  }

  // NUEVAS OPCIONES PREDETERMINADAS
  const CATEGORIAS_PREDETERMINADAS = [
    'Frutas y Verduras',
    'Embutidos',
    'Carnes rojas',
    'Carnes blancas',
    'Pescadería',
    'Lácteos',
    'Panadería',
    'Repostería',
    'Alimentos Congelados',
    'Legumbres',
    'Harinas y levaduras',
    'Despensa Básica',
    'Conservas y Enlatados',
    'Frituras',
    'Bebidas',
    'Higiene',
    'Hogar',
    'Bebés',
    'Limpieza',
    'Cuidado Femenino y Adultos Mayores',
    'Electrónica',
    'Farmacia y Salud'
  ];

  const ENVASES_PREDETERMINADOS = [
    'Bolsa (plástico, papel, aluminio)',
    'Caja',
    'Lata',
    'Frasco de vidrio',
    'Botella de plástico',
    'Tetra Pak',
    'Bolsa sellada al vacío',
    'Botella de vidrio',
    'Lata de aluminio'
  ];

  // Función para combinar opciones predeterminadas con datos del servidor
  function combinarOpciones(opcionesPredeterminadas, datosServidor) {
    console.log('Combinando opciones:', { opcionesPredeterminadas, datosServidor });
    
    // Crear un Set para evitar duplicados (ignorando mayúsculas/minúsculas)
    const opcionesUnicas = new Set();
    const resultado = [];
    
    // Agregar opciones predeterminadas primero
    opcionesPredeterminadas.forEach(opcion => {
      const opcionLower = opcion.toLowerCase().trim();
      if (!opcionesUnicas.has(opcionLower)) {
        opcionesUnicas.add(opcionLower);
        resultado.push(opcion);
      }
    });
    
    // Agregar opciones del servidor que no estén duplicadas
    if (Array.isArray(datosServidor)) {
      datosServidor.forEach(opcion => {
        if (opcion && typeof opcion === 'string') {
          const opcionLower = opcion.toLowerCase().trim();
          if (!opcionesUnicas.has(opcionLower) && opcion.trim() !== '') {
            opcionesUnicas.add(opcionLower);
            resultado.push(opcion.trim());
          }
        }
      });
    }
    
    console.log('Opciones combinadas:', resultado);
    return resultado;
  }

  // Agregar estilos CSS mejorados para los comboboxes
  if (!document.getElementById('combobox-styles')) {
    const comboboxStyle = document.createElement('style');
    comboboxStyle.id = 'combobox-styles';
    comboboxStyle.textContent = `
      /* Contenedor principal del combobox */
      .combobox-container {
        position: relative;
        width: 100%;
      }

      /* Input del combobox */
      .combobox-input {
        width: 100%;
        padding: 12px 40px 12px 15px;
        border: 2px solid #333;
        border-radius: 8px;
        font-size: 14px;
        background: white;
        color: #333;
        transition: all 0.3s ease;
        box-sizing: border-box;
        cursor: text;
        position: relative;
        z-index: 1;
      }

      .combobox-input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
        background: #fafafa;
      }

      .combobox-input::placeholder {
        color: #999;
        font-style: italic;
      }

      /* Icono de dropdown */
      .combobox-container::after {
        content: '▼';
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        color: #666;
        font-size: 12px;
        pointer-events: none;
        z-index: 2;
        transition: transform 0.3s ease;
      }

      .combobox-container.active::after {
        transform: translateY(-50%) rotate(180deg);
      }

      /* Dropdown del combobox */
      .combobox-dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 2px solid #007bff;
        border-top: none;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        max-height: 200px;
        overflow: hidden;
        animation: slideDown 0.2s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Contenedor de opciones con scroll */
      .combobox-options {
        max-height: 200px;
        overflow-y: auto;
        overflow-x: hidden;
      }

      /* Estilos del scrollbar */
      .combobox-options::-webkit-scrollbar {
        width: 6px;
      }

      .combobox-options::-webkit-scrollbar-track {
        background: #f1f1f1;
      }

      .combobox-options::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
      }

      .combobox-options::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }

      /* Opciones individuales */
      .combobox-option {
        padding: 12px 15px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-bottom: 1px solid #f0f0f0;
        font-size: 14px;
        color: #333;
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
      }

      .combobox-option:last-child {
        border-bottom: none;
      }

      .combobox-option:hover {
        background: linear-gradient(135deg, #e3f2fd, #f0f8ff);
        color: #1976d2;
        transform: translateX(2px);
      }

      .combobox-option:active {
        background: linear-gradient(135deg, #bbdefb, #e3f2fd);
        transform: translateX(0px);
      }

      /* Opción para crear nueva */
      .combobox-option.nueva-opcion {
        background: linear-gradient(135deg, #e8f5e8, #f1f8e9);
        border-left: 4px solid #4caf50;
        color: #2e7d32;
        font-weight: 500;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .combobox-option.nueva-opcion:hover {
        background: linear-gradient(135deg, #c8e6c9, #dcedc8);
        color: #1b5e20;
        transform: translateX(4px);
      }

      .combobox-option.nueva-opcion i {
        color: #4caf50;
        font-size: 12px;
        font-weight: bold;
      }

      /* Estados especiales */
      .combobox-option.destacado {
        background: linear-gradient(135deg, #fff3e0, #ffecd1);
        border-left: 3px solid #ff9800;
        font-weight: 500;
      }

      .combobox-option.destacado:hover {
        background: linear-gradient(135deg, #ffe0b2, #ffcc80);
      }

      /* Mensaje cuando no hay opciones */
      .combobox-no-options {
        padding: 20px 15px;
        text-align: center;
        color: #999;
        font-style: italic;
        background: #fafafa;
      }

      /* Separadores de categorías */
      .combobox-separator {
        padding: 6px 15px;
        background: #f8f9fa;
        color: #6c757d;
        font-size: 12px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-bottom: 1px solid #dee2e6;
        cursor: default;
      }

      /* Animación de carga */
      .combobox-loading {
        padding: 15px;
        text-align: center;
        color: #007bff;
        font-style: italic;
      }

      .combobox-loading::after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #007bff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
        margin-left: 8px;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Resaltado de texto buscado */
      .combobox-option .highlight {
        background: #ffeb3b;
        font-weight: bold;
        padding: 1px 2px;
        border-radius: 2px;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .combobox-dropdown {
          max-height: 150px;
        }
        
        .combobox-option {
          padding: 14px 15px;
          font-size: 16px; /* Mejor para móviles */
        }
        
        .combobox-input {
          padding: 14px 40px 14px 15px;
          font-size: 16px; /* Evita zoom en iOS */
        }
      }

      /* Modo oscuro (opcional) */
      @media (prefers-color-scheme: dark) {
        .combobox-input {
          background: #2d2d2d;
          color: #ffffff;
          border-color: #555;
        }
        
        .combobox-dropdown {
          background: #2d2d2d;
          border-color: #555;
        }
        
        .combobox-option {
          background: #2d2d2d;
          color: #ffffff;
          border-bottom-color: #555;
        }
        
        .combobox-option:hover {
          background: #3d3d3d;
        }
      }

      /* Estados de validación */
      .combobox-container.error .combobox-input {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.15);
      }

      .combobox-container.success .combobox-input {
        border-color: #28a745;
        box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.15);
      }

      /* Transiciones suaves para todos los elementos */
      .combobox-container * {
        transition: all 0.2s ease;
      }
    `;
    document.head.appendChild(comboboxStyle);
  }

  // Función para crear combobox con autocompletado
  function crearComboboxAutocompletado(inputId, containerId, opciones = [], placeholder = "") {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Contenedor ${containerId} no encontrado`);
      return;
    }

    // Limpiar contenedor
    container.innerHTML = '';

    // Crear estructura del combobox con mejores clases
    const comboboxHTML = `
      <input type="text" 
             id="${inputId}" 
             name="${inputId.replace('-producto', '').replace('edit-', '')}" 
             placeholder="${placeholder}"
             autocomplete="off"
             class="combobox-input"
             required>
      <div class="combobox-dropdown" id="${inputId}-dropdown">
        <div class="combobox-options" id="${inputId}-options"></div>
      </div>
    `;

    container.innerHTML = comboboxHTML;
    container.classList.add('combobox-container'); // Agregar clase

    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(`${inputId}-dropdown`);
    const optionsContainer = document.getElementById(`${inputId}-options`);

    if (!input || !dropdown || !optionsContainer) {
      console.error('Error creando elementos del combobox');
      return;
    }

    console.log(`Combobox ${inputId} creado con ${opciones.length} opciones:`, opciones);

    // Función para filtrar y mostrar opciones
    function mostrarOpciones(filtro = '') {
      optionsContainer.innerHTML = '';
      
      const opcionesFiltradas = opciones.filter(opcion => 
        opcion.toLowerCase().includes(filtro.toLowerCase())
      );

      if (opcionesFiltradas.length === 0 && filtro) {
        optionsContainer.innerHTML = `
          <div class="combobox-option nueva-opcion" data-value="${filtro}">
            <i class="fas fa-plus"></i> Crear "${filtro}"
          </div>
        `;
      } else {
        opcionesFiltradas.forEach(opcion => {
          const optionDiv = document.createElement('div');
          optionDiv.className = 'combobox-option';
          optionDiv.textContent = opcion;
          optionDiv.setAttribute('data-value', opcion);
          optionDiv.addEventListener('click', () => {
            input.value = opcion;
            dropdown.style.display = 'none';
          });
          optionsContainer.appendChild(optionDiv);
        });
      }

      dropdown.style.display = (opcionesFiltradas.length > 0 || filtro) ? 'block' : 'none';
    }

    // Eventos del input
    input.addEventListener('focus', () => {
      mostrarOpciones(input.value);
    });

    input.addEventListener('input', (e) => {
      mostrarOpciones(e.target.value);
    });

    input.addEventListener('blur', (e) => {
      // Delay para permitir click en opciones
      setTimeout(() => {
        dropdown.style.display = 'none';
      }, 200);
    });

    // Click en opciones
    optionsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('combobox-option') || e.target.closest('.combobox-option')) {
        const option = e.target.classList.contains('combobox-option') ? e.target : e.target.closest('.combobox-option');
        const valor = option.getAttribute('data-value');
        if (valor) {
          input.value = valor;
          dropdown.style.display = 'none';
          
          // Agregar a las opciones para futuras búsquedas si es nueva
          if (option.classList.contains('nueva-opcion') && !opciones.includes(valor)) {
            opciones.push(valor);
          }
        }
      }
    });

    return { input, dropdown, opciones };
  }

  // Crear modal para agregar producto con comboboxes
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
              <div class="combobox-container" id="categoria-container"></div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Escriba la marca</label>
              <div class="combobox-container" id="marca-container"></div>
            </div>
            
            <div class="form-group">
              <label>Escriba el envase</label>
              <div class="combobox-container" id="envase-container"></div>
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

    // Agregar estilos base
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

  // Crear modal para editar producto con comboboxes
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
              <div class="combobox-container" id="edit-categoria-container"></div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Marca</label>
              <div class="combobox-container" id="edit-marca-container"></div>
            </div>
            
            <div class="form-group">
              <label>Envase</label>
              <div class="combobox-container" id="edit-envase-container"></div>
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

  // Alertas para el sistema de productos
  class ProductosAlertas {
    
    // Producto agregado exitosamente
    static productoAgregado(nombreProducto) {
        Swal.fire({
            icon: 'success',
            title: '¡Producto agregado!',
            text: `${nombreProducto} ha sido agregado exitosamente`,
            timer: 2500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    // Producto editado exitosamente
    static productoEditado(nombreProducto) {
        Swal.fire({
            icon: 'success',
            title: '¡Producto actualizado!',
            text: `${nombreProducto} ha sido actualizado exitosamente`,
            timer: 2500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    // Confirmación antes de eliminar producto
    static confirmarEliminarProducto(nombreProducto) {
        return Swal.fire({
            title: '¿Eliminar producto?',
            html: `
                <p>¿Estás seguro de que deseas eliminar:</p>
                <strong>${nombreProducto}</strong>
                <p class="text-danger mt-2">Esta acción no se puede deshacer</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
    }

    // Producto eliminado exitosamente
    static productoEliminado(nombreProducto) {
        Swal.fire({
            icon: 'success',
            title: 'Producto eliminado',
            text: `${nombreProducto} ha sido eliminado del inventario`,
            timer: 2500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    // Ningún producto seleccionado para editar/eliminar
    static ningunProductoSeleccionado(accion) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecciona un producto',
            text: `Debes seleccionar un producto de la tabla para ${accion}`,
            confirmButtonText: 'Entendido'
        });
    }

    // Campos requeridos vacíos
    static camposRequeridos(campos) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos requeridos',
            html: `
                <p>Los siguientes campos son obligatorios:</p>
                <ul style="text-align: left; margin: 10px 0;">
                    ${campos.map(campo => `<li>${campo}</li>`).join('')}
                </ul>
            `,
            confirmButtonText: 'Entendido'
        });
    }

    // Código de producto duplicado
    static codigoDuplicado(codigo) {
        Swal.fire({
            icon: 'error',
            title: 'Código duplicado',
            text: `El código "${codigo}" ya existe. Usa un código diferente.`,
            confirmButtonText: 'Entendido'
        });
    }

    // Precio inválido
    static precioInvalido() {
        Swal.fire({
            icon: 'warning',
            title: 'Precio inválido',
            text: 'El precio debe ser un número mayor a 0',
            confirmButtonText: 'Corregir'
        });
    }

    // Error al cargar productos
    static errorCargarProductos() {
        Swal.fire({
            icon: 'error',
            title: 'Error al cargar productos',
            text: 'No se pudieron cargar los productos. Verifica tu conexión.',
            showCancelButton: true,
            confirmButtonText: 'Reintentar',
            cancelButtonText: 'Cancelar'
        });
    }

    // Error al guardar producto
    static errorGuardarProducto(mensaje) {
        Swal.fire({
            icon: 'error',
            title: 'Error al guardar',
            text: mensaje || 'Ocurrió un error al guardar el producto',
            confirmButtonText: 'Intentar nuevamente'
        });
    }

    // Confirmación antes de salir sin guardar
    static confirmarSalirSinGuardar() {
        return Swal.fire({
            title: '¿Salir sin guardar?',
            text: 'Tienes cambios sin guardar que se perderán',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Salir sin guardar',
            cancelButtonText: 'Continuar editando'
        });
    }

    // Contenido neto inválido
    static contenidoNetoInvalido() {
        Swal.fire({
            icon: 'warning',
            title: 'Contenido neto inválido',
            text: 'El contenido neto debe ser un número mayor a 0',
            confirmButtonText: 'Corregir'
        });
    }

    // Categoría no válida
    static categoriaInvalida() {
        Swal.fire({
            icon: 'warning',
            title: 'Categoría requerida',
            text: 'Debes seleccionar una categoría válida',
            confirmButtonText: 'Seleccionar'
        });
    }

    // Producto no encontrado
    static productoNoEncontrado() {
        Swal.fire({
            icon: 'error',
            title: 'Producto no encontrado',
            text: 'El producto seleccionado no existe o fue eliminado',
            confirmButtonText: 'Entendido'
        });
    }

    // Múltiples productos seleccionados para editar
    static multiplesProductosSeleccionados() {
        Swal.fire({
            icon: 'warning',
            title: 'Selección múltiple',
            text: 'Solo puedes editar un producto a la vez. Selecciona solo uno.',
            confirmButtonText: 'Entendido'
        });
    }

    // Filtros aplicados
    static filtrosAplicados(tipoFiltro, valor) {
        Swal.fire({
            icon: 'info',
            title: 'Filtro aplicado',
            text: `Mostrando productos: ${tipoFiltro} - ${valor}`,
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }

    // Sin resultados en búsqueda
    static sinResultadosBusqueda(termino) {
        Swal.fire({
            icon: 'info',
            title: 'Sin resultados',
            text: `No se encontraron productos que coincidan con: "${termino}"`,
            confirmButtonText: 'Entendido'
        });
    }

    // Importación de productos exitosa
    static importacionExitosa(cantidad) {
        Swal.fire({
            icon: 'success',
            title: 'Importación exitosa',
            text: `Se importaron ${cantidad} productos correctamente`,
            confirmButtonText: 'Continuar'
        });
    }

    // Error en importación
    static errorImportacion(errores) {
        Swal.fire({
            icon: 'error',
            title: 'Error en importación',
            html: `
                <p>Se encontraron los siguientes errores:</p>
                <ul style="text-align: left; max-height: 200px; overflow-y: auto;">
                    ${errores.map(error => `<li>${error}</li>`).join('')}
                </ul>
            `,
            confirmButtonText: 'Revisar errores'
        });
    }
}

// Event listeners para los botones de productos
document.addEventListener('DOMContentLoaded', function() {
    
    // Botón agregar producto
    const btnAgregar = document.querySelector('.btn-add');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', function() {
            // Aquí iría la lógica para mostrar modal de agregar producto
            // Ejemplo de validación:
            // ProductosAlertas.productoAgregado('Nuevo Producto');
        });
    }

    // Botón editar producto
    const btnEditar = document.querySelector('.btn-edit');
    if (btnEditar) {
        btnEditar.addEventListener('click', function() {
            // Verificar si hay un producto seleccionado
            const filaSeleccionada = document.querySelector('.productos-table tbody tr.selected');
            
            if (!filaSeleccionada) {
                ProductosAlertas.ningunProductoSeleccionado('editar');
                return;
            }

            // Verificar si hay múltiples selecciones
            const filasSeleccionadas = document.querySelectorAll('.productos-table tbody tr.selected');
            if (filasSeleccionadas.length > 1) {
                ProductosAlertas.multiplesProductosSeleccionados();
                return;
            }

            // Proceder con la edición
            // ProductosAlertas.productoEditado('Producto editado');
        });
    }

    // Botón eliminar producto
    const btnEliminar = document.querySelector('.btn-category'); // Cambiar clase si es necesario
    if (btnEliminar) {
        btnEliminar.addEventListener('click', function() {
            const filaSeleccionada = document.querySelector('.productos-table tbody tr.selected');
            
            if (!filaSeleccionada) {
                ProductosAlertas.ningunProductoSeleccionado('eliminar');
                return;
            }

            const nombreProducto = filaSeleccionada.querySelector('td:nth-child(4)')?.textContent || 'Producto seleccionado';
            
            ProductosAlertas.confirmarEliminarProducto(nombreProducto).then((result) => {
                if (result.isConfirmed) {
                    // Aquí iría la lógica para eliminar el producto
                    ProductosAlertas.productoEliminado(nombreProducto);
                }
            });
        });
    }

    // Función para validar formulario de producto
    function validarFormularioProducto(formulario) {
        const camposRequeridos = [];
        
        // Validar campos obligatorios
        if (!formulario.codigo.value.trim()) camposRequeridos.push('Código');
        if (!formulario.producto.value.trim()) camposRequeridos.push('Nombre del producto');
        if (!formulario.categoria.value.trim()) camposRequeridos.push('Categoría');
        if (!formulario.precio.value.trim()) camposRequeridos.push('Precio');
        
        if (camposRequeridos.length > 0) {
            ProductosAlertas.camposRequeridos(camposRequeridos);
            return false;
        }

        // Validar precio
        const precio = parseFloat(formulario.precio.value);
        if (isNaN(precio) || precio <= 0) {
            ProductosAlertas.precioInvalido();
            return false;
        }

        // Validar contenido neto si está presente
        if (formulario.contenidoNeto.value.trim()) {
            const contenido = parseFloat(formulario.contenidoNeto.value);
            if (isNaN(contenido) || contenido <= 0) {
                ProductosAlertas.contenidoNetoInvalido();
                return false;
            }
        }

        return true;
    }

    // Hacer la función disponible globalmente
    window.validarFormularioProducto = validarFormularioProducto;
    window.ProductosAlertas = ProductosAlertas;
});

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

  // Función para abrir modal de agregar producto con comboboxes (MODIFICADA)
  async function abrirModalProducto() {
    console.log("Abriendo modal de producto...");
    
    // Crear modal
    const modal = crearModalProducto();
    
    // Mostrar modal primero
    mostrarModal(modal);
    
    // Esperar un poco para que el modal se renderice completamente
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Cargar datos y crear comboboxes después de mostrar el modal
    try {
      console.log("Cargando datos para comboboxes...");
      
      // Obtener datos de la base de datos (con manejo de errores)
      let categoriasServidor = [];
      let marcasServidor = [];
      let envasesServidor = [];
      
      try {
        if (window.getCategorias) categoriasServidor = await window.getCategorias();
        if (window.getMarcas) marcasServidor = await window.getMarcas();
        if (window.getEnvases) envasesServidor = await window.getEnvases();
      } catch (error) {
        console.warn('Error obteniendo datos del servidor, usando solo opciones predeterminadas:', error);
      }

      console.log('Datos obtenidos del servidor:', { categoriasServidor, marcasServidor, envasesServidor });

      // Procesar datos del servidor
      const categoriasDelServidor = procesarDatosCombobox(categoriasServidor);
      const marcasDelServidor = procesarDatosCombobox(marcasServidor);
      const envasesDelServidor = procesarDatosCombobox(envasesServidor);

      // Combinar opciones predeterminadas con datos del servidor
      const categoriasFinales = combinarOpciones(CATEGORIAS_PREDETERMINADAS, categoriasDelServidor);
      const marcasFinales = marcasDelServidor; // Solo del servidor para marcas
      const envasesFinales = combinarOpciones(ENVASES_PREDETERMINADOS, envasesDelServidor);

      console.log('Opciones finales:', { categoriasFinales, marcasFinales, envasesFinales });

      // Verificar que los contenedores existan
      const categoriaContainer = document.getElementById('categoria-container');
      const marcaContainer = document.getElementById('marca-container');
      const envaseContainer = document.getElementById('envase-container');

      if (!categoriaContainer || !marcaContainer || !envaseContainer) {
        console.error('Contenedores no encontrados');
        throw new Error('Contenedores de combobox no encontrados');
      }

      // Crear comboboxes con autocompletado y opciones predeterminadas
      crearComboboxAutocompletado('categoria-producto', 'categoria-container', categoriasFinales, 'Buscar o crear categoría...');
      crearComboboxAutocompletado('marca-producto', 'marca-container', marcasFinales, 'Buscar o crear marca...');
      crearComboboxAutocompletado('envase-producto', 'envase-container', envasesFinales, 'Buscar o crear envase...');

      console.log('Comboboxes creados exitosamente con opciones predeterminadas');

    } catch (error) {
      console.error('Error cargando datos para comboboxes:', error);
      
      // Crear comboboxes con solo opciones predeterminadas en caso de error
      setTimeout(() => {
        crearComboboxAutocompletado('categoria-producto', 'categoria-container', CATEGORIAS_PREDETERMINADAS, 'Buscar o crear categoría...');
        crearComboboxAutocompletado('marca-producto', 'marca-container', [], 'Escribir marca...');
        crearComboboxAutocompletado('envase-producto', 'envase-container', ENVASES_PREDETERMINADOS, 'Buscar o crear envase...');
      }, 50);
    }
    
    // Configurar eventos del modal
    configurarEventosModal(modal, async (e) => {
      e.preventDefault();
      
      // Obtener valores de los comboboxes
      const codigo = document.getElementById('codigo-producto')?.value?.trim() || '';
      const contenido = document.getElementById('contenido')?.value?.trim() || '';
      const nombre = document.getElementById('nombre-producto')?.value?.trim() || '';
      const categoria = document.getElementById('categoria-producto')?.value?.trim() || '';
      const marca = document.getElementById('marca-producto')?.value?.trim() || '';
      const envase = document.getElementById('envase-producto')?.value?.trim() || '';
      const variedad = document.getElementById('variedad')?.value?.trim() || '';
      const medida = document.getElementById('medida')?.value?.trim() || 'pz';
      const precio = parseFloat(document.getElementById('precio')?.value) || 0;
      
      const datosProducto = {
        codigo,
        nombre,
        marca,
        variedad,
        contenido,
        categoria,
        envase,
        medida,
        precio
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
  }

  // Función para abrir modal de editar producto con comboboxes (MODIFICADA)
  async function abrirModalEditar() {
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

    // Mostrar modal
    mostrarModal(modal);

    // Esperar un poco para que el modal se renderice
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Obtener datos de la base de datos (con manejo de errores)
      let categoriasServidor = [];
      let marcasServidor = [];
      let envasesServidor = [];
      
      try {
        if (window.getCategorias) categoriasServidor = await window.getCategorias();
        if (window.getMarcas) marcasServidor = await window.getMarcas();
        if (window.getEnvases) envasesServidor = await window.getEnvases();
      } catch (error) {
        console.warn('Error obteniendo datos del servidor para edición, usando solo opciones predeterminadas:', error);
      }

      // Procesar datos del servidor
      const categoriasDelServidor = procesarDatosCombobox(categoriasServidor);
      const marcasDelServidor = procesarDatosCombobox(marcasServidor);
      const envasesDelServidor = procesarDatosCombobox(envasesServidor);

      // Combinar opciones predeterminadas con datos del servidor
      const categoriasFinales = combinarOpciones(CATEGORIAS_PREDETERMINADAS, categoriasDelServidor);
      const marcasFinales = marcasDelServidor; // Solo del servidor para marcas
      const envasesFinales = combinarOpciones(ENVASES_PREDETERMINADOS, envasesDelServidor);

      // Crear comboboxes con autocompletado y opciones predeterminadas
      const categoriaCombo = crearComboboxAutocompletado('edit-categoria-producto', 'edit-categoria-container', categoriasFinales, 'Buscar o crear categoría...');
      const marcaCombo = crearComboboxAutocompletado('edit-marca-producto', 'edit-marca-container', marcasFinales, 'Buscar o crear marca...');
      const envaseCombo = crearComboboxAutocompletado('edit-envase-producto', 'edit-envase-container', envasesFinales, 'Buscar o crear envase...');

      // Prellenar campos después de crear los comboboxes
      setTimeout(() => {
        // Campos normales
        const codigoInput = modal.querySelector('#edit-codigo-producto');
        const nombreInput = modal.querySelector('#edit-nombre-producto');
        const variedadInput = modal.querySelector('#edit-variedad');
        const contenidoInput = modal.querySelector('#edit-contenido');
        const medidaSelect = modal.querySelector('#edit-medida');
        const precioInput = modal.querySelector('#edit-precio');

        if (codigoInput) codigoInput.value = datosActuales.codigo;
        if (nombreInput) nombreInput.value = datosActuales.nombre;
        if (variedadInput) variedadInput.value = datosActuales.variedad;
        if (contenidoInput) contenidoInput.value = datosActuales.contenido;
        if (precioInput) precioInput.value = datosActuales.precio;

        // Prellenar comboboxes
        if (categoriaCombo && categoriaCombo.input) {
          categoriaCombo.input.value = datosActuales.categoria;
        }
        if (marcaCombo && marcaCombo.input) {
          marcaCombo.input.value = datosActuales.marca;
        }
        if (envaseCombo && envaseCombo.input) {
          envaseCombo.input.value = datosActuales.envase;
        }

        // Medida
        if (medidaSelect && datosActuales.medida) {
          const opcionMedida = Array.from(medidaSelect.options).find(option => 
            option.value.toLowerCase() === datosActuales.medida.toLowerCase()
          );
          if (opcionMedida) {
            medidaSelect.value = opcionMedida.value;
          }
        }

        console.log('Campos prellenados correctamente con opciones predeterminadas');
      }, 100);

    } catch (error) {
      console.error('Error cargando datos para comboboxes:', error);
      // Crear comboboxes con solo opciones predeterminadas en caso de error
      crearComboboxAutocompletado('edit-categoria-producto', 'edit-categoria-container', CATEGORIAS_PREDETERMINADAS, 'Buscar o crear categoría...');
      crearComboboxAutocompletado('edit-marca-producto', 'edit-marca-container', [], 'Escribir marca...');
      crearComboboxAutocompletado('edit-envase-producto', 'edit-envase-container', ENVASES_PREDETERMINADOS, 'Buscar o crear envase...');
    }

    // Configurar eventos del modal
    configurarEventosModal(modal, async (e) => {
      e.preventDefault();
      
      // Obtener valores de los comboboxes y campos
      const codigo = document.getElementById('edit-codigo-producto')?.value?.trim() || '';
      const contenido = document.getElementById('edit-contenido')?.value?.trim() || '';
      const nombre = document.getElementById('edit-nombre-producto')?.value?.trim() || '';
      const categoria = document.getElementById('edit-categoria-producto')?.value?.trim() || '';
      const marca = document.getElementById('edit-marca-producto')?.value?.trim() || '';
      const envase = document.getElementById('edit-envase-producto')?.value?.trim() || '';
      const variedad = document.getElementById('edit-variedad')?.value?.trim() || '';
      const medida = document.getElementById('edit-medida')?.value?.trim() || 'pz';
      const precio = parseFloat(document.getElementById('edit-precio')?.value) || 0;
      
      const datosProducto = {
        codigo,
        nombre,
        marca,
        variedad,
        contenido,
        categoria,
        envase,
        medida,
        precio
      };
      
      console.log('Datos del formulario para editar:', datosProducto);
      
      // VALIDACIÓN antes de enviar
      if (!datosProducto.categoria || datosProducto.categoria.trim() === '') {
        mostrarAlertaVisual('Por favor ingresa una categoría');
        return;
      }
      
      if (!datosProducto.marca || datosProducto.marca.trim() === '') {
        mostrarAlertaVisual('Por favor ingresa una marca');
        return;
      }
      
      if (!datosProducto.envase || datosProducto.envase.trim() === '') {
        mostrarAlertaVisual('Por favor ingresa un envase');
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

  // Funcionalidad para seleccionar filas de la tabla
  document.addEventListener('DOMContentLoaded', function() {
    const tabla = document.querySelector('.productos-table tbody');
    
    if (tabla) {
        tabla.addEventListener('click', function(e) {
            const fila = e.target.closest('tr');
            if (fila) {
                // Si la fila ya está seleccionada, deseleccionarla
                if (fila.classList.contains('selected')) {
                    fila.classList.remove('selected');
                } else {
                    // Deseleccionar todas las otras filas (para selección única)
                    tabla.querySelectorAll('tr.selected').forEach(tr => {
                        tr.classList.remove('selected');
                    });
                    // Seleccionar la fila actual
                    fila.classList.add('selected');
                }
            }
        });
    }
});

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
    
    // Cargar datos desde el backend
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
        abrirModalEditar(); // ← Esta función ahora estará definida
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

    // Funciones globales
    window.abrirFormularioProducto = abrirModalProducto;
    window.abrirModalEditar = abrirModalEditar; // ← Exponer globalmente
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