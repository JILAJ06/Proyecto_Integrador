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
  function init() {
    inventario = [...datosEjemplo];
    
    // Crear elementos dinámicos
    crearDropdown();
    const modalAdd = crearModalAgregar();
    const modalEdit = crearModalEditar();
    
    cargarInventario();
    setupEventListeners(modalAdd, modalEdit);
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

  // Agregar producto - VERIFICAR Y CORREGIR SESSIONSTORAGE
  async function agregarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    // DEBUGGING COMPLETO DEL SESSIONSTORAGE
    console.log('=== DEBUGGING SESSIONSTORAGE COMPLETO ===');
    console.log('Longitud del sessionStorage:', sessionStorage.length);
    
    // Mostrar TODOS los elementos
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        console.log(`Clave: "${key}" | Valor: "${value}" | Tipo: ${typeof value}`);
    }
    
    // Intentar múltiples variaciones de las claves
    const posiblesUsuarios = [
        sessionStorage.getItem('nombreUsuario'),
        sessionStorage.getItem('usuario'),
        sessionStorage.getItem('username'),
        sessionStorage.getItem('user'),
        sessionStorage.getItem('nombre_usuario'),
        sessionStorage.getItem('Nombre_Usuario')
    ];
    
    const posiblesNegocios = [
        sessionStorage.getItem('idNegocio'),
        sessionStorage.getItem('negocioId'),
        sessionStorage.getItem('id_negocio'),
        sessionStorage.getItem('ID_Negocio'),
        sessionStorage.getItem('businessId')
    ];
    
    console.log('Posibles usuarios encontrados:', posiblesUsuarios);
    console.log('Posibles negocios encontrados:', posiblesNegocios);
    
    // Tomar el primer valor no nulo
    const nombreUsuario = posiblesUsuarios.find(u => u !== null && u !== undefined && u !== '') || 'sayd';
    const idNegocio = posiblesNegocios.find(n => n !== null && n !== undefined && n !== '') || '1';
    
    console.log('Usuario final seleccionado:', nombreUsuario);
    console.log('Negocio final seleccionado:', idNegocio);
    console.log('==========================================');
    
    // VALIDACIÓN EXTRA
    if (!nombreUsuario || nombreUsuario === 'null' || nombreUsuario === 'undefined') {
        console.error('PROBLEMA: nombreUsuario es inválido:', nombreUsuario);
        mostrarAlertaVisual("Error: No se puede obtener el usuario de la sesión. Usando 'sayd' por defecto.", "warning");
    }
    
    // Crear el objeto asegurándose de que nombreUsuario no sea null
    const nuevoLote = {
        nombreUsuario: String(nombreUsuario).trim(), // Convertir a string y quitar espacios
        codigoProducto: formData.get("codigo"),
        stockAlmacen: parseInt(formData.get("stockAlmacen")) || 0,
        stockExhibicion: parseInt(formData.get("stockExhibicion")) || 0,
        stockMinimo: parseInt(formData.get("stockMinimo")) || 0,
        fechaCaducidad: formData.get("fechaCaducidad"),
        precioCompra: parseFloat(formData.get("precioCompra")) || 0.0,
        fechaEntrada: formData.get("fechaEntrada"),
        margenGanancia: parseFloat(formData.get("margenGanancia")) || 0.0
    };

    console.log('=== OBJETO FINAL A ENVIAR ===');
    console.log('Objeto completo:', nuevoLote);
    console.log('nombreUsuario específico:', `"${nuevoLote.nombreUsuario}"`);
    console.log('Tipo de nombreUsuario:', typeof nuevoLote.nombreUsuario);
    console.log('Longitud de nombreUsuario:', nuevoLote.nombreUsuario.length);
    console.log('JSON final:', JSON.stringify(nuevoLote, null, 2));
    console.log('=============================');

    // Validación final antes de enviar
    if (!nuevoLote.nombreUsuario || nuevoLote.nombreUsuario === 'null') {
        mostrarAlertaVisual("Error crítico: No se puede proceder sin un nombre de usuario válido.", "error");
        return;
    }

    try {
        const { crearLote } = await import('../Servicios/inventarioServices.js');
        await crearLote(nuevoLote);
        
        const modal = document.getElementById("modal-add");
        modal.classList.remove("active");
        e.target.reset();
        
        mostrarAlertaVisual("Lote agregado exitosamente.", "success");
        
    } catch (error) {
        console.error('Error completo:', error);
        mostrarAlertaVisual("Error al agregar el lote: " + error.message, "error");
    }
}

// Editar producto - USAR LAS CLAVES CORRECTAS DEL SESSIONSTORAGE
async function editarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const stockExhibicionInput = document.getElementById('edit-stockExhibicion');
    const stockTotal = parseInt(stockExhibicionInput.dataset.stockTotal) || 0;
    const nuevoStockExhibicion = parseInt(formData.get("stockExhibicion")) || 0;
    
    if (nuevoStockExhibicion > stockTotal) {
        mostrarAlertaVisual("No hay suficiente stock disponible", "error");
        return;
    }

    const loteActualizado = {
        stockAlmacen: stockTotal - nuevoStockExhibicion,
        stockExhibicion: nuevoStockExhibicion,
        stockMinimo: parseInt(formData.get("stockMinimo")) || 0,
        margenGanancia: parseFloat(formData.get("margenGanancia")) || 0.0
    };

    try {
        const registroId = filaSeleccionada.dataset.registroId;
        const { actualizarLote } = await import('../Servicios/inventarioServices.js');
        await actualizarLote(registroId, loteActualizado);
        
        const modal = document.getElementById("modal-edit");
        modal.classList.remove("active");
        
        mostrarAlertaVisual("Lote modificado exitosamente", "success");
        
    } catch (error) {
        console.error('Error al editar lote:', error);
        mostrarAlertaVisual(error.message, "error");
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

// Función para crear filas de tabla - INCLUIR ID REGISTRO
function crearFilaTabla(item) {
    const fila = document.createElement("tr");
    
    // Asegurarse de que el ID se asigne correctamente
    const registroId = item.id || item.idRegistro || item.registro || item.id_registro;
    fila.dataset.registroId = registroId;
    
    const campos = [
        item.codigo,
        item.producto,
        capitalizarTexto(item.categoria),
        item.marca,
        formatearFecha(item.fechaCaducidad),
        registroId, // Asegurarse de que el ID esté en la columna correcta
        formatearFecha(item.fechaEntrada),
        item.fechaSalida,
        item.stockAlmacen,
        item.stockExhibicion,
        `$${item.precio.toFixed(2)}`
    ];

    campos.forEach(campo => {
        const td = document.createElement("td");
        td.textContent = campo || '-';
        fila.appendChild(td);
    });

    return fila;
}

// Inicializar aplicación
  init();
});