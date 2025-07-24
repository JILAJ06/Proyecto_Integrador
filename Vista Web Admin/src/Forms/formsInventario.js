import InventarioServices, { setNegocioId, getSessionInfo, setNombreUsuario } from '../Servicios/inventarioServices.js';

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



  // Crear modal para agregar producto
  function crearModalAgregar() {
    const modal = document.createElement("div");
    modal.id = "modal-add";
    modal.className = "modal-overlay";
    
    // Obtener el nombre de usuario desde sessionStorage
    const nombreUsuarioActual = InventarioServices.getNombreUsuario();
    
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Agregar Nuevo Lote</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="form-add-product" class="modal-form">
          <div class="form-group">
            <label>Nombre de Usuario</label>
            <input type="text" id="nombreUsuario" name="nombreUsuario" 
                   value="${nombreUsuarioActual}" 
                   placeholder="Nombre del usuario"
                   readonly>
            <small style="color: #666; font-size: 0.8em;">
              📝 Obtenido automáticamente del sistema. 
              <button type="button" id="editarUsuario" style="background: none; border: none; color: #007bff; cursor: pointer; text-decoration: underline;">
                Editar
              </button>
            </small>
          </div>

          <div class="form-group">
            <label>Código del Producto *</label>
            <input type="text" id="codigoProducto" name="codigoProducto" required placeholder="Código del producto">
          </div>

          <div class="form-group">
            <label>Nombre del Producto</label>
            <input type="text" id="producto" name="producto" placeholder="Nombre del producto (opcional)">
          </div>

          <div class="form-group">
            <label>Fecha de Entrada *</label>
            <input type="date" id="fechaEntrada" name="fechaEntrada" required>
          </div>

          <div class="form-group">
            <label>Fecha de Caducidad *</label>
            <input type="date" id="fechaCaducidad" name="fechaCaducidad" required>
          </div>

          <div class="form-group">
            <label>Precio de Compra *</label>
            <input type="number" id="precioCompra" name="precioCompra" step="0.01" required placeholder="0.00">
          </div>

          <div class="form-group">
            <label>Margen de Ganancia (%) *</label>
            <input type="number" id="margenGanancia" name="margenGanancia" step="0.01" required placeholder="0.25">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Stock en Almacén *</label>
              <input type="number" id="stockAlmacen" name="stockAlmacen" required placeholder="0">
            </div>
            
            <div class="form-group">
              <label>Stock en Exhibición *</label>
              <input type="number" id="stockExhibicion" name="stockExhibicion" required placeholder="0">
            </div>
          </div>

          <div class="form-group">
            <label>Stock Mínimo *</label>
            <input type="number" id="stockMinimo" name="stockMinimo" required placeholder="0">
          </div>
          
          <div class="modal-buttons">
            <button type="button" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-accept">Aceptar</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);
    
    // Agregar funcionalidad para editar el usuario
    const editarUsuarioBtn = modal.querySelector('#editarUsuario');
    const inputUsuario = modal.querySelector('#nombreUsuario');
    
    editarUsuarioBtn.addEventListener('click', () => {
        if (inputUsuario.readOnly) {
            inputUsuario.readOnly = false;
            inputUsuario.focus();
            editarUsuarioBtn.textContent = 'Guardar';
            inputUsuario.style.backgroundColor = '#fff';
        } else {
            inputUsuario.readOnly = true;
            editarUsuarioBtn.textContent = 'Editar';
            inputUsuario.style.backgroundColor = '#f8f9fa';
            
            // Guardar el nuevo nombre en sessionStorage
            const nuevoNombre = inputUsuario.value.trim();
            if (nuevoNombre) {
                setNombreUsuario(nuevoNombre);
                mostrarAlertaVisual(`Usuario actualizado: ${nuevoNombre}`, "success");
            }
        }
    });
    
    // Estilo inicial para el campo readonly
    inputUsuario.style.backgroundColor = '#f8f9fa';
    
    return modal;
  }

  // Crear modal para editar producto
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
          <div class="form-group">
            <label>Stock en Exhibición *</label>
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
    return modal;
  }

  // Crear modal para eliminar producto
  function crearModalEliminar() {
    const modalExistente = document.getElementById('modal-advertencia');
    if (modalExistente) {
      modalExistente.remove();
    }

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
    aplicarEstilosModalAdvertencia();
    setupModalAdvertenciaEvents(modal);
    
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('mostrar'), 10);
    
    return modal;
  }

  // Función para aplicar estilos específicos del modal de advertencia
  function aplicarEstilosModalAdvertencia() {
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

    function cerrarModal() {
      modal.classList.remove('mostrar');
      setTimeout(() => { 
        if (modal.parentNode) {
          modal.remove(); 
        }
      }, 280);
    }

    function handleEscape(e) {
      if (e.key === 'Escape') {
        cerrarModal();
      }
    }

    document.addEventListener('keydown', handleEscape);

    btnAceptar.onclick = null;
    btnCancelar.onclick = null;
    overlay.onclick = null;

    btnAceptar.onclick = function() {
      confirmarEliminar();
      cerrarModal();
      document.removeEventListener('keydown', handleEscape);
    };

    btnCancelar.onclick = function() {
      cerrarModal();
      document.removeEventListener('keydown', handleEscape);
    };

    overlay.onclick = function() {
      cerrarModal();
      document.removeEventListener('keydown', handleEscape);
    };
  }

  // Eliminar funciones duplicadas de alertas
  // function mostrarAlertaVisual() { ... } // ELIMINAR
  // function aplicarEstilosModalAdvertencia() { ... } // ELIMINAR
  // function crearModalEliminar() { ... } // ELIMINAR

  // Actualizar función de eliminar para usar sistema unificado
  async function abrirModalEliminar() {
    if (!filaSeleccionada) {
        window.Alertas.error("Selecciona una fila para eliminar.");
        return;
    }

    const confirmado = await window.Modales.mostrarConfirmacion({
        titulo: 'Eliminar Lote',
        texto: '¿Estás seguro de que deseas eliminar<br>este lote?<br>Esta acción no se puede deshacer.',
        icono: '&#9888;'
    });

    if (confirmado) {
        await confirmarEliminar();
    }
  }

  async function confirmarEliminar() {
    if (!filaSeleccionada) {
        window.Alertas.error("No hay lote seleccionado para eliminar");
        return;
    }

    try {
        const registroId = filaSeleccionada.dataset.registroId || filaSeleccionada.children[0]?.textContent;
        
        if (!registroId) {
            window.Alertas.error("No se pudo obtener el ID del registro");
            return;
        }

        window.Alertas.info("Eliminando lote...");

        await InventarioServices.eliminarLote(registroId);
        
        await cargarInventario();
        filaSeleccionada = null;
        
        window.Alertas.success("Lote eliminado exitosamente");
        
    } catch (error) {
        console.error('Error al eliminar lote:', error);
        window.Alertas.error(error.message);
    }
  }

  // Cargar inventario desde la API
  async function cargarInventario() {
    try {
      mostrarAlertaVisual("Cargando inventario...", "warning");
      
      const datos = await InventarioServices.obtenerLotes();
      inventario = datos || [];
      
      const tbody = tabla;
      tbody.innerHTML = '';

      // Filtrar inventario por categoría
      const inventarioFiltrado = filtrarPorCategoria(inventario, filtroCategoria);

      // Crear filas para cada item
      inventarioFiltrado.forEach(item => {
        const fila = crearFilaTabla(item);
        tbody.appendChild(fila);
      });

      setupRowSelection();
      console.log(`Inventario cargado: ${inventarioFiltrado.length} items`);
      
      // Ocultar mensaje de carga
      setTimeout(() => {
        const alertas = document.querySelectorAll('div[style*="Cargando inventario"]');
        alertas.forEach(alerta => alerta.remove());
      }, 500);
      
    } catch (error) {
      console.error('Error al cargar inventario:', error);
      mostrarAlertaVisual(error.message, "error");
      
      // Mostrar inventario vacío en caso de error
      const tbody = tabla;
      tbody.innerHTML = '<tr><td colspan="12" style="text-align: center; padding: 20px;">Error al cargar datos</td></tr>';
    }
  }

  // Función para filtrar por categoría
  function filtrarPorCategoria(inventario, categoria) {
    if (categoria === "all") return inventario;
    return inventario.filter(item => {
        // Usar la categoría parseada o la original
        const categoriaItem = item.categoria || 'general';
        return categoriaItem.toLowerCase() === categoria.toLowerCase();
    });
  }

  // Inicializar aplicación
  async function init() {
    try {
      // Verificar conexión primero
      const conexionOk = await InventarioServices.verificarConexion();
      if (!conexionOk) {
        mostrarAlertaVisual("No se pudo conectar con el servidor", "error");
      }

      // Crear elementos dinámicos
    
      const modalAdd = crearModalAgregar();
      const modalEdit = crearModalEditar();
      
      // Cargar datos desde la API
      await cargarInventario();
      setupEventListeners(modalAdd, modalEdit);
      
    } catch (error) {
      console.error('Error al inicializar:', error);
      mostrarAlertaVisual("Error al inicializar la aplicación", "error");
    }
  }

  // Configurar event listeners
  function setupEventListeners(modalAdd, modalEdit) {
    btnAdd.addEventListener("click", () => abrirModalAgregar(modalAdd));
    btnEdit.addEventListener("click", () => abrirModalEditar(modalEdit));
    btnDelete.addEventListener("click", abrirModalEliminar);

    setupModalEvents(modalAdd, modalEdit);

    document.getElementById("form-add-product").addEventListener("submit", agregarProducto);
    document.getElementById("form-edit-product").addEventListener("submit", editarProducto);

    setupRowSelection();
  }

  // Configurar eventos de modales
  function setupModalEvents(modalAdd, modalEdit) {
    const modales = [modalAdd, modalEdit];
    
    modales.forEach(modal => {
      const closeBtn = modal.querySelector(".modal-close");
      closeBtn.addEventListener("click", () => cerrarModales(modales));
    });

    modales.forEach(modal => {
      const cancelBtns = modal.querySelectorAll(".btn-cancel");
      cancelBtns.forEach(btn => {
        btn.addEventListener("click", () => cerrarModales(modales));
      });
    });

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
      if (fila && fila.children.length > 0) {
        const primeraCelda = fila.children[0];
        const contenidoCelda = primeraCelda.textContent.trim();
        
        if (contenidoCelda && contenidoCelda !== '' && contenidoCelda !== '\u00A0') {
          if (!fila.dataset.registroId) {
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

  // Seleccionar fila
  function seleccionarFila(fila) {
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
    
    document.querySelectorAll(".products-table tbody tr").forEach(tr => {
      tr.classList.remove("selected");
    });
    
    fila.classList.add("selected");
    filaSeleccionada = fila;
    
    console.log('Fila seleccionada:', filaSeleccionada);
  }

  function abrirModalEliminar() {
    if (!filaSeleccionada) {
        mostrarAlertaVisual("Selecciona una fila para eliminar.", "error");
        return;
    }
    crearModalEliminar();
  }

  function toggleDropdown() {
    if (dropdownMenu.style.display === "block") {
      cerrarDropdown();
    } else {
      abrirDropdown();
    }
  }

  function abrirDropdown() {
    dropdownMenu.style.display = "block";
    btnCategory.classList.add("active");
  }

  function cerrarDropdown() {
    if (dropdownMenu) {
      dropdownMenu.style.display = "none";
      btnCategory.classList.remove("active");
    }
  }

  function filtrarPorCategoriaHandler(e) {
    const categoria = e.target.dataset.category;
    filtroCategoria = categoria;

    const text = e.target.textContent;
    btnCategory.querySelector("i").nextSibling.textContent = ` ${text}`;

    dropdownItems.forEach(item => item.classList.remove("selected"));
    e.target.classList.add("selected");

    cargarInventario();
    cerrarDropdown();
  }

  function abrirModalAgregar(modal) {
    // Actualizar el nombre de usuario cada vez que se abre el modal
    const nombreUsuarioActual = InventarioServices.getNombreUsuario();
    const inputUsuario = modal.querySelector("#nombreUsuario");
    if (inputUsuario) {
        inputUsuario.value = nombreUsuarioActual;
    }
    
    modal.classList.add("active");
    modal.querySelector("#codigoProducto").focus(); // Cambiar el focus al código del producto
  }

  function abrirModalEditar(modal) {
    if (!filaSeleccionada) {
      mostrarAlertaVisual("Selecciona una fila para editar.", "error");
      return;
    }

    const datos = obtenerDatosFilaSeleccionada();
    if (!datos) {
      mostrarAlertaVisual("Error al obtener datos de la fila seleccionada.", "error");
      return;
    }

    llenarFormularioEdicion(modal, datos);
    modal.classList.add("active");
  }

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

  function llenarFormularioEdicion(modal, datos) {
    // Llenar el campo de stock de exhibición
    modal.querySelector("#edit-stockExhibicion").value = datos.stockExhibicion;
    modal.querySelector("#edit-stockMinimo").value = datos.stockMinimo ?? 10;
    modal.querySelector("#edit-margenGanancia").value = datos.margenGanancia ?? 20;

    const stockExhibicionInput = modal.querySelector("#edit-stockExhibicion");
    stockExhibicionInput.dataset.stockTotal = datos.stockAlmacen + datos.stockExhibicion;

  }

  function cerrarModales(modales) {
    modales.forEach(modal => {
      modal.classList.remove("active");
    });
  }

  async function agregarProducto(e) {
    e.preventDefault();
    
    console.log('🔄 Iniciando proceso de agregar producto...');
    
    const formData = new FormData(e.target);
    
    // Mostrar todos los datos del formulario para debug
    console.log('📋 Datos completos del formulario:');
    for (let [key, value] of formData.entries()) {
        console.log(`  ${key}: ${value}`);
    }
    
    // El nombre de usuario se toma del formulario, pero si está vacío, se usa el del sessionStorage
    const nombreUsuario = formData.get("nombreUsuario") || InventarioServices.getNombreUsuario();
    
    // SOLO incluir los campos que necesita el backend
    const nuevoLote = {
        nombreUsuario: nombreUsuario,
        codigoProducto: formData.get("codigoProducto"),
        stockAlmacen: parseInt(formData.get("stockAlmacen")) || 0,
        stockExhibicion: parseInt(formData.get("stockExhibicion")) || 0,
        stockMinimo: parseInt(formData.get("stockMinimo")) || 0,
        fechaCaducidad: formData.get("fechaCaducidad"),
        precioCompra: parseFloat(formData.get("precioCompra")) || 0.0,
        fechaEntrada: formData.get("fechaEntrada"),
        margenGanancia: parseFloat(formData.get("margenGanancia")) || 0.0
    };

    console.log('📝 Datos preparados para enviar (sin campos extra):', nuevoLote);

    // Validar campos obligatorios antes de enviar
    if (!nuevoLote.codigoProducto) {
        mostrarAlertaVisual("El código del producto es obligatorio", "error");
        return;
    }
    
    if (!nuevoLote.fechaEntrada) {
        mostrarAlertaVisual("La fecha de entrada es obligatoria", "error");
        return;
    }
    
    if (!nuevoLote.fechaCaducidad) {
        mostrarAlertaVisual("La fecha de caducidad es obligatoria", "error");
        return;
    }
    
    if (!nuevoLote.precioCompra || nuevoLote.precioCompra <= 0) {
        mostrarAlertaVisual("El precio de compra debe ser mayor a 0", "error");
        return;
    }

    try {
        mostrarAlertaVisual("Agregando lote...", "warning");
        
        const resultado = await InventarioServices.crearLote(nuevoLote);
        console.log('✅ Resultado del servidor:', resultado);
        
        const modal = document.getElementById("modal-add");
        modal.classList.remove("active");
        e.target.reset();
        
        await cargarInventario();
        mostrarAlertaVisual("Lote agregado exitosamente.", "success");
        
    } catch (error) {
        console.error('❌ Error detallado al agregar lote:', error);
        mostrarAlertaVisual(`Error: ${error.message}`, "error");
    }
  }

  async function editarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    
    const datosActualizacion = {
        stockExhibicion: parseInt(formData.get("stockExhibicion")) || 0,
        stockMinimo: parseInt(formData.get("stockMinimo")) || 0,
        margenGanancia: parseFloat(formData.get("margenGanancia")) || 0.0
    };

    if (!filaSeleccionada) {
        mostrarAlertaVisual("Por favor seleccione un lote para editar", "error");
        return;
    }

    try {
        const registroId = filaSeleccionada.dataset.registroId || filaSeleccionada.children[0]?.textContent;
        
        if (!registroId) {
            mostrarAlertaVisual("No se pudo obtener el ID del registro", "error");
            return;
        }

        mostrarAlertaVisual("Actualizando lote...", "warning");

        await InventarioServices.actualizarLote(registroId, datosActualizacion);
        
        const modal = document.getElementById("modal-edit");
        modal.classList.remove("active");
        
        await cargarInventario();
        filaSeleccionada = null;
        
        mostrarAlertaVisual("Lote modificado exitosamente", "success");
        
    } catch (error) {
        console.error('Error al editar lote:', error);
        mostrarAlertaVisual(error.message, "error");
    }
  }

  function capitalizarTexto(texto) {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  function formatearFecha(fecha) {
    if (!fecha || fecha === '-') return '-';
    
    try {
      if (fecha.includes('-')) {
        const partes = fecha.split('-');
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      
      if (fecha.includes('/')) {
        return fecha;
      }
      
      const fechaObj = new Date(fecha);
      if (!isNaN(fechaObj.getTime())) {
        return fechaObj.toLocaleDateString('es-ES');
      }
      
      return fecha;
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return fecha;
    }
  }

  function formatearPrecio(precio) {
    if (!precio) return '$0.00';
    return `$${parseFloat(precio).toFixed(2)}`;
  }

  function crearFilaTabla(item) {
    const fila = document.createElement("tr");
    
    const registroId = item.idRegistro || item.id || item.registro || item.id_registro || '';
    fila.dataset.registroId = registroId;
    
    const campos = [
        { valor: item.codigoProducto || '', clase: 'column-codigo' },
        { valor: item.nombre || item.producto || 'Producto no encontrado', clase: 'column-producto' }, // Usar nombre parseado si existe
        { valor: capitalizarTexto(item.categoria || 'Sin categoría'), clase: 'column-cat' },
        { valor: item.marca || 'Sin marca', clase: 'column-marca' },
        { valor: formatearFecha(item.fechaCaducidad), clase: 'column-fechacad' },
        { valor: registroId, clase: 'column-id' },
        { valor: formatearFecha(item.fechaEntrada), clase: 'column-fechaent' },
        { valor: item.fechaSalida || '-', clase: 'column-fechasal' },
        { valor: item.stockAlmacen || 0, clase: 'column-stockalm' },
        { valor: item.stockExhibicion || 0, clase: 'column-stockex' },
        { valor: formatearPrecio(item.precioCompra || item.precio), clase: 'column-precio' }
    ];

    campos.forEach(campo => {
        const td = document.createElement("td");
        td.className = campo.clase;
        td.textContent = campo.valor;
        fila.appendChild(td);
    });

    return fila;
  }

  init();
});

// Exportar función principal para uso externo si es necesario
window.cargarInventario = async () => {
  await cargarInventario();
};

// Agregar función de debug al final del archivo
window.debugInventario = async () => {
  console.log('🐛 INICIANDO DEBUG DEL INVENTARIO...');
  
  // Mostrar información de sessionStorage
  console.log('🔍 Información de sessionStorage:');
  getSessionInfo();
  
  // Debugear respuesta del servidor
  console.log('🔍 Analizando respuesta del servidor:');
  await InventarioServices.debugRespuestaServidor();
};

// También exportar las funciones helper
window.setNegocioId = setNegocioId;
window.getSessionInfo = getSessionInfo;
window.setNombreUsuario = setNombreUsuario;
