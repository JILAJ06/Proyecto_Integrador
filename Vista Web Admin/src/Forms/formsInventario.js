document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const tabla = document.querySelector(".products-table tbody");
  const btnAdd = document.querySelector(".btn-add");
  const btnEdit = document.querySelector(".btn-edit");
  const btnDelete = document.querySelector(".btn-delete");
  const btnCategory = document.querySelector(".btn-category");
  const dropdownContainer = document.querySelector(".dropdown-container");

  // Variables globales
  let filaSeleccionada = null;
  let inventario = [];
  let filtroCategoria = "all";
  let dropdownMenu = null;
  let dropdownItems = [];

  // Configuración de categorías
  const categorias = [
    { value: "all", text: "Todas las categorías" },
    { value: "bebidas", text: "Bebidas" },
    { value: "snacks", text: "Snacks" },
    { value: "dulces", text: "Dulces" },
    { value: "lacteos", text: "Lácteos" },
    { value: "panaderia", text: "Panadería" },
    { value: "limpieza", text: "Limpieza" },
    { value: "higiene", text: "Higiene Personal" }
  ];

  // Datos de ejemplo (simula API)
  const datosEjemplo = [
    {
      codigo: "001",
      producto: "Coca Cola 600ml",
      categoria: "bebidas",
      marca: "Coca Cola",
      fechaCaducidad: "2025-12-31",
      id: "REG001",
      fechaEntrada: "2024-01-15",
      fechaSalida: "-",
      stockAlmacen: 50,
      stockExhibicion: 24,
      precio: 25.50
    },
    {
      codigo: "002", 
      producto: "Sabritas Clásicas",
      categoria: "snacks",
      marca: "Sabritas",
      fechaCaducidad: "2025-06-15",
      id: "REG002",
      fechaEntrada: "2024-01-10",
      fechaSalida: "-",
      stockAlmacen: 30,
      stockExhibicion: 15,
      precio: 18.00
    },
    {
      codigo: "003",
      producto: "Leche Lala 1L",
      categoria: "lacteos", 
      marca: "Lala",
      fechaCaducidad: "2025-02-28",
      id: "REG003",
      fechaEntrada: "2024-01-20",
      fechaSalida: "-",
      stockAlmacen: 25,
      stockExhibicion: 12,
      precio: 22.50
    }
  ];

  // Crear dropdown dinámicamente
  function crearDropdown() {
    dropdownMenu = document.createElement("div");
    dropdownMenu.className = "dropdown-menu";

    categorias.forEach(categoria => {
      const item = document.createElement("div");
      item.className = "dropdown-item";
      item.setAttribute("data-category", categoria.value);
      item.textContent = categoria.text;
      
      if (categoria.value === "all") {
        item.classList.add("selected");
      }
      
      dropdownMenu.appendChild(item);
    });

    dropdownContainer.appendChild(dropdownMenu);
    dropdownItems = dropdownMenu.querySelectorAll(".dropdown-item");
  }

  // Crear modal para agregar producto
  function crearModalAgregar() {
    const modal = document.createElement("div");
    modal.id = "modal-add";
    modal.className = "modal-overlay";
    
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Agregar Nuevo Lote</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="form-add-product" class="modal-form">
          <div class="form-group">
            <label>Escanee o escriba el código del producto</label>
            <input type="text" id="codigo" name="codigo" required placeholder="Código del producto">
          </div>

           <div class="form-group">
            <label>Ingrese la fecha de Entrada</label>
            <input type="date" id="fechaEntrada" name="fechaEntrada" required>
          </div>

          <div class="form-group">
            <label>Ingrese la fecha de caducidad</label>
            <input type="date" id="fechaCaducidad" name="fechaCaducidad" required>
          </div>

          <div class="form-group">
            <label>Cantidad Mínima para Alerta</label>
            <input type="number" id="stockMinimo" name="stockMinimo" required placeholder="0">
          </div>

           <div class="form-group">
            <label>Precio de Compra</label>
            <input type="number" id="precioCompra" name="precioCompra" step="0.01" required placeholder="0.00">
          </div>

          <div class="form-group">
            <label>Ganancia al Producto</label>
            <input type="number" id="margenGanancia" name="margenGanancia" step="0.01" required placeholder="0.00">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Ingrese la cantidad en almacén</label>
              <input type="number" id="stockAlmacen" name="stockAlmacen" required placeholder="0">
            </div>
            
            <div class="form-group">
              <label>Ingrese la cantidad en exhibición</label>
              <input type="number" id="stockExhibicion" name="stockExhibicion" required placeholder="0">
            </div>
          </div>
          
          <div class="modal-buttons">
            <button type="button" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-accept">Aceptar</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  // ACTUALIZAR la función crearModalEditar para incluir información de stock:
  function crearModalEditar() {
    const modal = document.createElement("div");
    modal.id = "modal-edit";
    modal.className = "modal-overlay";
    
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Modificar Lote</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="form-edit-product" class="modal-form">
          <!-- CAMPOS DE SOLO LECTURA (INFORMACIÓN) -->
          <div class="form-group">
            <label>Código del producto (Solo lectura)</label>
            <input type="text" id="edit-codigo" name="codigo" readonly style="background-color: #f8f9fa;">
          </div>

          <div class="form-group">
            <label>Producto (Solo lectura)</label>
            <input type="text" id="edit-producto" name="producto" readonly style="background-color: #f8f9fa;">
          </div>

          <div class="form-group">
            <label>Stock en Almacén (Solo lectura - se actualiza automáticamente)</label>
            <input type="number" id="edit-stockAlmacen" name="stockAlmacen" readonly style="background-color: #f8f9fa;">
            <small style="color: #666; font-size: 12px;">
              ⚠️ Este valor se reduce automáticamente cuando aumentas el stock de exhibición
            </small>
          </div>

          <!-- CAMPOS EDITABLES -->
          <div class="form-group">
            <label>Stock en Exhibición * 
              <small style="color: #007bff;">(Se resta del almacén)</small>
            </label>
            <input type="number" id="edit-stockExhibicion" name="stockExhibicion" min="0" required>
          </div>

          <div class="form-group">
            <label>Stock Mínimo *</label>
            <input type="number" id="edit-stockMinimo" name="stockMinimo" min="0" required>
          </div>

          <div class="form-group">
            <label>Margen de Ganancia (%) *</label>
            <input type="number" id="edit-margenGanancia" name="margenGanancia" step="0.1" min="0" required>
          </div>
          
          <div class="modal-buttons">
            <button type="button" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-accept">Guardar Cambios</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    
    // AGREGAR EVENT LISTENER PARA MOSTRAR CÁLCULO EN TIEMPO REAL
    const stockExhibicionInput = modal.querySelector('#edit-stockExhibicion');
    const stockAlmacenInput = modal.querySelector('#edit-stockAlmacen');
    
    if (stockExhibicionInput && stockAlmacenInput) {
        // Guardar los valores originales cuando se abre el modal
        stockExhibicionInput.addEventListener('focus', () => {
            const stockAlmacenActual = parseInt(stockAlmacenInput.value) || 0;
            const stockExhibicionActual = parseInt(stockExhibicionInput.value) || 0;
            stockExhibicionInput.dataset.stockTotal = stockAlmacenActual + stockExhibicionActual;
            stockExhibicionInput.dataset.stockOriginal = stockExhibicionActual;
        });

        stockExhibicionInput.addEventListener('input', (e) => {
            const stockTotal = parseInt(e.target.dataset.stockTotal) || 0;
            const stockOriginal = parseInt(e.target.dataset.stockOriginal) || 0;
            const nuevoStockExhibicion = parseInt(e.target.value) || 0;
            
            if (nuevoStockExhibicion > stockTotal) {
                e.target.setCustomValidity(`Stock insuficiente. Stock total disponible: ${stockTotal}`);
            } else {
                e.target.setCustomValidity('');
                // Calcular nuevo stock en almacén
                const nuevoStockAlmacen = stockTotal - nuevoStockExhibicion;
                stockAlmacenInput.value = nuevoStockAlmacen;
            }
            e.target.reportValidity();
        });
    }
    
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
        <div class="modal-advertencia-text">¿Estás seguro de que deseas eliminar<br>este lote?<br>Esta acción no se puede deshacer.</div>
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

    // Función para cerrar modal con animación
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

  // Función para confirmar la eliminación del lote
  async function confirmarEliminar() {
    if (!filaSeleccionada) {
      mostrarAlertaVisual("No hay lote seleccionado para eliminar", "error");
      return;
    }

    try {
      // Obtener el ID de registro de la fila seleccionada
      const registroId = filaSeleccionada.dataset.registroId || filaSeleccionada.querySelector('.column-id').textContent;
      
      if (!registroId) {
        mostrarAlertaVisual("No se pudo obtener el ID del registro", "error");
        return;
      }

      console.log('Eliminando lote con registro ID:', registroId);

      // Eliminar el lote usando el servicio
      await InventarioServices.eliminarLote(registroId);
      
      // Recargar inventario para reflejar los cambios
      await cargarInventarioDesdeAPI();
      
      // Limpiar selección
      filaSeleccionada = null;
      
      mostrarAlertaVisual("Lote eliminado exitosamente", "success");
      
    } catch (error) {
      console.error('Error al eliminar lote:', error);
      mostrarAlertaVisual("Error al eliminar el lote: " + error.message, "error");
    }
  }

  // AGREGAR esta función para actualizar las filas con los IDs de registro:
  function actualizarFilasConIDs() {
    // Esta función debe ser llamada después de cargar datos reales de la API
    const filas = document.querySelectorAll('.products-table tbody tr');
    filas.forEach((fila, index) => {
        const primeraCelda = fila.children[0];
        if (primeraCelda && primeraCelda.textContent.trim()) {
            // Por ahora usar el índice, pero esto debería venir de tu API
            fila.dataset.registroId = index + 1;
        }
    });
  }

  // Inicializar aplicación
  async function init() {
    try {
      // Crear elementos dinámicos
      crearDropdown();
      const modalAdd = crearModalAgregar();
      const modalEdit = crearModalEditar();
      
      // Cargar datos reales de la API
      await cargarInventarioDesdeAPI();
      setupEventListeners(modalAdd, modalEdit);
      
    } catch (error) {
      console.error('Error al inicializar:', error);
      // En caso de error, usar datos de ejemplo
      inventario = [...datosEjemplo];
      cargarInventario();
      mostrarAlertaVisual("Error al conectar con el servidor. Mostrando datos de ejemplo.", "warning");
    }
  }

  // Cargar inventario desde la API
  async function cargarInventarioDesdeAPI() {
    try {
      console.log('Cargando inventario desde API...');
      const lotes = await InventarioServices.obtenerTodosLosLotes();
      
      // Mapear datos de la API al formato de la tabla
      inventario = lotes.map(lote => InventarioServices.mapearDatosAPIATabla(lote));
      
      console.log('Inventario cargado:', inventario);
      cargarInventario();
      
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      throw error;
    }
  }

  // Cargar inventario en la tabla (función básica)
  function cargarInventario() {
    const tbody = tabla;
    tbody.innerHTML = '';

    // Filtrar inventario por categoría
    const inventarioFiltrado = InventarioServices.filtrarPorCategoria(inventario, filtroCategoria);

    // Crear filas para cada item
    inventarioFiltrado.forEach(item => {
      const fila = crearFilaTabla(item);
      tbody.appendChild(fila);
    });

    // Configurar selección de filas después de cargar
    setupRowSelection();

    console.log(`Inventario cargado: ${inventarioFiltrado.length} items`);
  }

  // Configurar event listeners
  function setupEventListeners(modalAdd, modalEdit) {
    // Botones principales
    btnAdd.addEventListener("click", () => abrirModalAgregar(modalAdd));
    btnEdit.addEventListener("click", () => abrirModalEditar(modalEdit));
    btnDelete.addEventListener("click", abrirModalEliminar);
    
    // Dropdown de categorías
    btnCategory.addEventListener("click", toggleDropdown);
    dropdownItems.forEach(item => {
      item.addEventListener("click", filtrarPorCategoria);
    });

    // Cerrar dropdown al hacer click fuera
    document.addEventListener("click", (e) => {
      if (!dropdownContainer.contains(e.target)) {
        cerrarDropdown();
      }
    });

    // Modales (solo para agregar y editar)
    setupModalEvents(modalAdd, modalEdit);

    // Formularios
    document.getElementById("form-add-product").addEventListener("submit", agregarProducto);
    document.getElementById("form-edit-product").addEventListener("submit", editarProducto);

    // Selección de filas
    setupRowSelection();
  }

  // Configurar eventos de modales
  function setupModalEvents(modalAdd, modalEdit) {
    const modales = [modalAdd, modalEdit];
    
    // Cerrar modales con X
    modales.forEach(modal => {
      const closeBtn = modal.querySelector(".modal-close");
      closeBtn.addEventListener("click", () => cerrarModales(modales));
    });

    // Cerrar modales con botón cancelar
    modales.forEach(modal => {
      const cancelBtns = modal.querySelectorAll(".btn-cancel");
      cancelBtns.forEach(btn => {
        btn.addEventListener("click", () => cerrarModales(modales));
      });
    });

    // Cerrar modales haciendo click fuera
    modales.forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          cerrarModales(modales);
        }
      });
    });
  }

  // Configurar selección de filas
  function setupRowSelection() {
    tabla.addEventListener("click", (e) => {
      const fila = e.target.closest("tr");
      // Mejorar la condición para detectar filas válidas
      if (fila && fila.children.length > 0) {
        const primeraCelda = fila.children[0];
        const contenidoCelda = primeraCelda.textContent.trim();
        
        // Solo seleccionar si la fila tiene contenido real (no está vacía)
        if (contenidoCelda && contenidoCelda !== '' && contenidoCelda !== '\u00A0') {
          // Asegurar que la fila tenga un ID de registro
          if (!fila.dataset.registroId) {
            // Si no tiene ID, usar el contenido de la columna ID (columna 5)
            const idCelda = fila.children[5];
            if (idCelda) {
              fila.dataset.registroId = idCelda.textContent.trim();
            }
          }
          seleccionarFila(fila);
        }
      }
    });
  }

  // Seleccionar fila - AGREGAR ESTILOS CSS
  function seleccionarFila(fila) {
    // Asegurar que los estilos CSS existan
    if (!document.getElementById('row-selection-styles')) {
      const style = document.createElement('style');
      style.id = 'row-selection-styles';
      style.textContent = `
        .products-table tbody tr.selected {
          background-color: #d4edda !important;
          border: 2px solid #28a745 !important;
        }
        
        .products-table tbody tr {
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .products-table tbody tr:hover {
          background-color: #f8f9fa;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Remover selección anterior
    document.querySelectorAll(".products-table tbody tr").forEach(tr => {
      tr.classList.remove("selected");
    });
    
    // Seleccionar nueva fila
    fila.classList.add("selected");
    filaSeleccionada = fila;
    
    console.log('Fila seleccionada:', filaSeleccionada); // Para debug
  }

  // Función abrirModalEliminar corregida
  function abrirModalEliminar() {
    if (!filaSeleccionada) {
        mostrarAlertaVisual("Selecciona una fila para eliminar.");
        return;
    }

    // Obtener el ID del registro directamente de la columna ID (índice 5)
    const idRegistro = filaSeleccionada.children[5]?.textContent;
    
    if (!idRegistro) {
        mostrarAlertaVisual("No se pudo obtener el ID del registro.");
        return;
    }

    console.log('ID de registro a eliminar:', idRegistro); // Para debug
    
    // Crear el modal
    const modal = crearModalEliminar();
    
    // Configurar eventos
    const btnAceptar = modal.querySelector('.modal-advertencia-btn-aceptar');
    const btnCancelar = modal.querySelector('.modal-advertencia-btn-cancelar');
    
    btnAceptar.onclick = async () => {
        try {
            const { eliminarLote } = await import('../Servicios/inventarioServices.js');
            await eliminarLote(idRegistro);
            modal.remove();
            filaSeleccionada.remove(); // Eliminar la fila de la tabla
            filaSeleccionada = null;
            mostrarAlertaVisual("Lote eliminado exitosamente", "success");
            // Recargar la tabla
            cargarInventario();
        } catch (error) {
            console.error('Error al eliminar:', error);
            mostrarAlertaVisual("Error al eliminar el lote: " + error.message);
        }
    };
    
    btnCancelar.onclick = () => {
        modal.remove();
    };
  }

  // Función para toggle del dropdown
  function toggleDropdown() {
    if (dropdownMenu.style.display === "block") {
      cerrarDropdown();
    } else {
      abrirDropdown();
    }
  }

  // Función para abrir dropdown
  function abrirDropdown() {
    dropdownMenu.style.display = "block";
    btnCategory.classList.add("active");
  }

  // Función para cerrar dropdown
  function cerrarDropdown() {
    if (dropdownMenu) {
      dropdownMenu.style.display = "none";
      btnCategory.classList.remove("active");
    }
  }

  // Función para filtrar por categoría
  function filtrarPorCategoria(e) {
    const categoria = e.target.dataset.category;
    filtroCategoria = categoria;

    // Actualizar texto del botón
    const text = e.target.textContent;
    btnCategory.querySelector("i").nextSibling.textContent = ` ${text}`;

    // Actualizar selección visual
    dropdownItems.forEach(item => item.classList.remove("selected"));
    e.target.classList.add("selected");

    // Aplicar filtro
    cargarInventario();
    cerrarDropdown();
  }

  // Función para abrir modal agregar
  function abrirModalAgregar(modal) {
    modal.classList.add("active");
    modal.querySelector("#codigo").focus();
  }

  // Función para abrir modal editar
  function abrirModalEditar(modal) {
    if (!filaSeleccionada) {
      mostrarAlertaVisual("Selecciona una fila para editar.", "error");
      return;
    }

    // Obtener datos de la fila seleccionada
    const datos = obtenerDatosFilaSeleccionada();
    if (!datos) {
      mostrarAlertaVisual("Error al obtener datos de la fila seleccionada.", "error");
      return;
    }

    // Llenar el formulario con los datos actuales
    llenarFormularioEdicion(modal, datos);
    
    modal.classList.add("active");
  }

  // Función para obtener datos de la fila seleccionada
  function obtenerDatosFilaSeleccionada() {
    if (!filaSeleccionada) return null;

    const celdas = filaSeleccionada.children;
    return {
      codigo: celdas[0]?.textContent || '',
      producto: celdas[1]?.textContent || '',
      categoria: celdas[2]?.textContent || '',
      marca: celdas[3]?.textContent || '',
      fechaCaducidad: celdas[4]?.textContent || '',
      id: celdas[5]?.textContent || '',
      fechaEntrada: celdas[6]?.textContent || '',
      fechaSalida: celdas[7]?.textContent || '',
      stockAlmacen: parseInt(celdas[8]?.textContent) || 0,
      stockExhibicion: parseInt(celdas[9]?.textContent) || 0,
      precio: parseFloat(celdas[10]?.textContent.replace('$', '')) || 0
    };
  }

  // Función para llenar el formulario de edición
  function llenarFormularioEdicion(modal, datos) {
    modal.querySelector("#edit-codigo").value = datos.codigo;
    modal.querySelector("#edit-producto").value = datos.producto;
    modal.querySelector("#edit-stockAlmacen").value = datos.stockAlmacen;
    modal.querySelector("#edit-stockExhibicion").value = datos.stockExhibicion;
    
    // Configurar el stock total para validaciones
    const stockExhibicionInput = modal.querySelector("#edit-stockExhibicion");
    stockExhibicionInput.dataset.stockTotal = datos.stockAlmacen + datos.stockExhibicion;
    
    // Campos editables basándose en los datos existentes del inventario
    const item = InventarioServices.buscarLotePorRegistro(inventario, datos.id);
    if (item) {
      modal.querySelector("#edit-stockMinimo").value = item.stockMinimo || 0;
      modal.querySelector("#edit-margenGanancia").value = item.margenGanancia || 0;
    }
  }

  // Función para cerrar modales
  function cerrarModales(modales) {
    modales.forEach(modal => {
      modal.classList.remove("active");
    });
  }

  // Agregar producto - CONECTADO CON API
  async function agregarProducto(e) {
    e.preventDefault();
    
    // Asegurar que sessionStorage tenga los valores necesarios
    if (!sessionStorage.getItem('nombreUsuario')) {
      sessionStorage.setItem('nombreUsuario', 'admin'); // Valor por defecto
      console.warn('nombreUsuario no encontrado en sessionStorage, usando "admin" por defecto');
    }
    
    if (!sessionStorage.getItem('negocioId')) {
      sessionStorage.setItem('negocioId', '1'); // Valor por defecto
      console.warn('negocioId no encontrado en sessionStorage, usando "1" por defecto');
    }
    
    const formData = new FormData(e.target);
    
    // Mapear datos del formulario al formato esperado por la API
    const datosFormulario = {
      codigo: formData.get("codigo"),
      fechaEntrada: formData.get("fechaEntrada"),
      fechaCaducidad: formData.get("fechaCaducidad"),
      stockMinimo: formData.get("stockMinimo"),
      precioCompra: formData.get("precioCompra"),
      margenGanancia: formData.get("margenGanancia"),
      stockAlmacen: formData.get("stockAlmacen"),
      stockExhibicion: formData.get("stockExhibicion")
    };

    // Usar el servicio para mapear y validar los datos
    const nuevoLote = InventarioServices.mapearDatosFormularioAAPI(datosFormulario);
    
    console.log('Datos del nuevo lote:', nuevoLote);

    // Validar datos antes de enviar
    const errores = InventarioServices.validarDatosLote(nuevoLote);
    if (errores.length > 0) {
      mostrarAlertaVisual("Error en los datos: " + errores.join(", "), "error");
      return;
    }

    try {
      // Crear el lote usando el servicio
      const resultado = await InventarioServices.crearLote(nuevoLote);
      
      // Cerrar modal y limpiar formulario
      const modal = document.getElementById("modal-add");
      modal.classList.remove("active");
      e.target.reset();
      
      // Recargar inventario para mostrar el nuevo lote
      await cargarInventarioDesdeAPI();
      
      mostrarAlertaVisual("Lote agregado exitosamente.", "success");
      
    } catch (error) {
      console.error('Error al agregar lote:', error);
      mostrarAlertaVisual("Error al agregar el lote: " + error.message, "error");
    }
  }

// Editar producto - CONECTADO CON API
async function editarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // Obtener datos del formulario según el formato esperado por la API PUT
    const datosActualizacion = {
        stockExhibicion: parseInt(formData.get("stockExhibicion")) || 0,
        stockMinimo: parseInt(formData.get("stockMinimo")) || 0,
        margenGanancia: parseFloat(formData.get("margenGanancia")) || 0.0
    };

    console.log('Datos de actualización:', datosActualizacion);

    // Validar que hay una fila seleccionada
    if (!filaSeleccionada) {
        mostrarAlertaVisual("Por favor seleccione un lote para editar", "error");
        return;
    }

    try {
        // Obtener el ID de registro de la fila seleccionada
        const registroId = filaSeleccionada.dataset.registroId || filaSeleccionada.querySelector('.column-id').textContent;
        
        if (!registroId) {
            mostrarAlertaVisual("No se pudo obtener el ID del registro", "error");
            return;
        }

        console.log('Actualizando lote con registro ID:', registroId);

        // Actualizar el lote usando el servicio
        const resultado = await InventarioServices.actualizarLote(registroId, datosActualizacion);
        
        // Cerrar modal
        const modal = document.getElementById("modal-edit");
        modal.classList.remove("active");
        
        // Recargar inventario para mostrar los cambios
        await cargarInventarioDesdeAPI();
        
        // Limpiar selección
        filaSeleccionada = null;
        
        mostrarAlertaVisual("Lote modificado exitosamente", "success");
        
    } catch (error) {
        console.error('Error al editar lote:', error);
        mostrarAlertaVisual("Error al modificar el lote: " + error.message, "error");
    }
}

// Mejorar la función mostrarAlertaVisual para manejar diferentes tipos
function mostrarAlertaVisual(mensaje, tipo = "error") {
    // Crear alerta temporal
    const alerta = document.createElement('div');
    
    const colores = {
        success: { bg: '#d4edda', color: '#155724', border: '#c3e6cb' },
        error: { bg: '#f8d7da', color: '#721c24', border: '#f5c6cb' },
        warning: { bg: '#fff3cd', color: '#856404', border: '#ffeaa7' }
    };
    
    const colorConfig = colores[tipo] || colores.error;
    
    alerta.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colorConfig.bg};
        color: ${colorConfig.color};
        padding: 15px 20px;
        border: 1px solid ${colorConfig.border};
        border-radius: 4px;
        z-index: 9999;
        font-size: 14px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    alerta.textContent = mensaje;
    
    document.body.appendChild(alerta);
    
    // Mostrar con animación
    setTimeout(() => {
        alerta.style.opacity = '1';
        alerta.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        alerta.style.opacity = '0';
        alerta.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (alerta.parentNode) {
                alerta.remove();
            }
        }, 300);
    }, 3000);
}

// Función para capitalizar texto
function capitalizarTexto(texto) {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Función para formatear fechas
function formatearFecha(fecha) {
  if (!fecha || fecha === '-') return '-';
  
  try {
    // Si la fecha ya está en formato YYYY-MM-DD, convertir a DD/MM/YYYY
    if (fecha.includes('-')) {
      const partes = fecha.split('-');
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    
    // Si ya está en formato DD/MM/YYYY, devolverla tal como está
    if (fecha.includes('/')) {
      return fecha;
    }
    
    // Intentar parsear la fecha
    const fechaObj = new Date(fecha);
    if (!isNaN(fechaObj.getTime())) {
      return fechaObj.toLocaleDateString('es-ES');
    }
    
    return fecha; // Devolver la fecha original si no se puede formatear
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return fecha;
  }
}

// Función para crear filas de tabla - MEJORADA CON SERVICIOS
function crearFilaTabla(item) {
    const fila = document.createElement("tr");
    
    // Asegurarse de que el ID se asigne correctamente
    const registroId = item.id || item.idRegistro || item.registro || item.id_registro || '';
    fila.dataset.registroId = registroId;
    
    // Agregar clases CSS para poder identificar las columnas
    const campos = [
        { valor: item.codigo || '', clase: 'column-codigo' },
        { valor: item.producto || 'Producto no encontrado', clase: 'column-producto' },
        { valor: capitalizarTexto(item.categoria || 'Sin categoría'), clase: 'column-cat' },
        { valor: item.marca || 'Sin marca', clase: 'column-marca' },
        { valor: InventarioServices.formatearFecha(item.fechaCaducidad), clase: 'column-fechacad' },
        { valor: registroId, clase: 'column-id' },
        { valor: InventarioServices.formatearFecha(item.fechaEntrada), clase: 'column-fechaent' },
        { valor: item.fechaSalida || '-', clase: 'column-fechasal' },
        { valor: item.stockAlmacen || 0, clase: 'column-stockalm' },
        { valor: item.stockExhibicion || 0, clase: 'column-stockex' },
        { valor: InventarioServices.formatearPrecio(item.precio), clase: 'column-precio' }
    ];

    campos.forEach(campo => {
        const td = document.createElement("td");
        td.className = campo.clase;
        td.textContent = campo.valor;
        fila.appendChild(td);
    });

    return fila;
}

// Inicializar aplicación
  init();
});