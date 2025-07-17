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
            <input type="number" id="stockMinimo" name="stockMinimo " step="0.01" required placeholder="0.00">
          </div>

           <div class="form-group">
            <label>Precio de Compra</label>
            <input type="number" id="precioCompra" name="precioCompra" step="0.01" required placeholder="0.00">
          </div>

          <div class="form-group">
            <label>Precio por Unidad</label>
            <input type="number" id="precio" name="precio" step="0.01" required placeholder="0.00">
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
            <label>Código del producto</label>
            <input type="text" id="edit-codigo" name="codigo" required readonly>
          </div>
          
          <div class="form-group">
            <label>Nombre del producto</label>
            <input type="text" id="edit-producto" name="producto" required>
          </div>
          
          <div class="form-group">
            <label>Categoría</label>
            <select id="edit-categoria" name="categoria" required>
              ${categorias.filter(cat => cat.value !== "all").map(cat => 
                `<option value="${cat.value}">${cat.text}</option>`
              ).join("")}
            </select>
          </div>
          
          <div class="form-group">
            <label>Marca</label>
            <input type="text" id="edit-marca" name="marca" required>
          </div>
          
          <div class="form-group">
            <label>Fecha de caducidad</label>
            <input type="date" id="edit-fechaCaducidad" name="fechaCaducidad" required>
          </div>
          
          <div class="form-group">
            <label>Precio unitario</label>
            <input type="number" id="edit-precio" name="precio" step="0.01" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Cantidad en almacén</label>
              <input type="number" id="edit-stockAlmacen" name="stockAlmacen" required>
            </div>
            
            <div class="form-group">
              <label>Cantidad en exhibición</label>
              <input type="number" id="edit-stockExhibicion" name="stockExhibicion" required>
            </div>
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
    btnDelete.addEventListener("click", () => abrirModalEliminar());
    
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
    
    // Crear el modal solo cuando se necesite
    crearModalEliminar();
  }

  // Agregar función mostrarAlertaVisual si no existe
  function mostrarAlertaVisual(mensaje) {
    // Crear alerta temporal
    const alerta = document.createElement('div');
    alerta.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #f8d7da;
      color: #721c24;
      padding: 15px 20px;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    alerta.textContent = mensaje;
    
    document.body.appendChild(alerta);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      if (alerta.parentNode) {
        alerta.remove();
      }
    }, 3000);
  }

  // Cargar inventario en la tabla
  function cargarInventario() {
    tabla.innerHTML = "";
    
    const inventarioFiltrado = filtroCategoria === "all" 
      ? inventario 
      : inventario.filter(item => item.categoria === filtroCategoria);

    inventarioFiltrado.forEach(item => {
      const fila = crearFilaTabla(item);
      tabla.appendChild(fila);
    });

    // Agregar filas vacías si es necesario
    const filasVacias = Math.max(0, 9 - inventarioFiltrado.length);
    for (let i = 0; i < filasVacias; i++) {
      const filaVacia = document.createElement("tr");
      for (let j = 0; j < 11; j++) {
        const td = document.createElement("td");
        filaVacia.appendChild(td);
      }
      tabla.appendChild(filaVacia);
    }
  }

  // Crear fila de tabla
  function crearFilaTabla(item) {
    const fila = document.createElement("tr");
    
    const campos = [
      item.codigo,
      item.producto,
      capitalizarTexto(item.categoria),
      item.marca,
      formatearFecha(item.fechaCaducidad),
      item.id,
      formatearFecha(item.fechaEntrada),
      item.fechaSalida,
      item.stockAlmacen,
      item.stockExhibicion,
      `$${item.precio.toFixed(2)}`
    ];

    campos.forEach(campo => {
      const td = document.createElement("td");
      td.textContent = campo;
      fila.appendChild(td);
    });

    return fila;
  }

  // Dropdown de categorías
  function toggleDropdown() {
    dropdownContainer.classList.toggle("active");
  }

  function cerrarDropdown() {
    dropdownContainer.classList.remove("active");
  }

  function filtrarPorCategoria(e) {
    const categoria = e.target.getAttribute("data-category");
    filtroCategoria = categoria;
    
    // Actualizar selección visual
    dropdownItems.forEach(item => item.classList.remove("selected"));
    e.target.classList.add("selected");
    
    // Actualizar texto del botón
    const textoCategoria = categoria === "all" ? "Categoria" : capitalizarTexto(categoria);
    btnCategory.innerHTML = `
      <i class="fas fa-filter"></i>
      ${textoCategoria}
      <i class="fas fa-chevron-down dropdown-arrow"></i>
    `;
    
    cargarInventario();
    cerrarDropdown();
    filaSeleccionada = null;
  }

  // Modales
  function abrirModalAgregar(modal) {
    document.getElementById("form-add-product").reset();
    modal.classList.add("active");
  }

  function abrirModalEditar(modal) {
    if (!filaSeleccionada) {
      mostrarAlertaVisual("Selecciona una fila para editar.");
      return;
    }

    const celdas = filaSeleccionada.querySelectorAll("td");
    const codigo = celdas[0].textContent.trim();
    const producto = inventario.find(item => item.codigo === codigo);

    if (producto) {
      document.getElementById("edit-codigo").value = producto.codigo;
      document.getElementById("edit-producto").value = producto.producto;
      document.getElementById("edit-categoria").value = producto.categoria;
      document.getElementById("edit-marca").value = producto.marca;
      document.getElementById("edit-fechaCaducidad").value = producto.fechaCaducidad;
      document.getElementById("edit-precio").value = producto.precio;
      document.getElementById("edit-stockAlmacen").value = producto.stockAlmacen;
      document.getElementById("edit-stockExhibicion").value = producto.stockExhibicion;
      
      modal.classList.add("active");
    }
  }

  function abrirModalEliminar() {
    if (!filaSeleccionada) {
      mostrarAlertaVisual("Selecciona una fila para eliminar.");
      return;
    }
    
    // Crear el modal solo cuando se necesite
    crearModalEliminar();
  }

  function cerrarModales(modales) {
    modales.forEach(modal => {
      modal.classList.remove("active");
    });
  }

  // Agregar producto
  function agregarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nuevoProducto = {
      codigo: formData.get("codigo"),
      producto: formData.get("producto"),
      categoria: formData.get("categoria"),
      marca: formData.get("marca"),
      fechaCaducidad: formData.get("fechaCaducidad"),
      id: `REG${String(inventario.length + 1).padStart(3, "0")}`,
      fechaEntrada: new Date().toISOString().split("T")[0],
      fechaSalida: "-",
      stockAlmacen: parseInt(formData.get("stockAlmacen")),
      stockExhibicion: parseInt(formData.get("stockExhibicion")),
      precio: parseFloat(formData.get("precio"))
    };

    // Verificar si el código ya existe
    if (inventario.some(item => item.codigo === nuevoProducto.codigo)) {
      mostrarAlertaVisual("Ya existe un producto con ese código.");
      return;
    }

    inventario.push(nuevoProducto);
    cargarInventario();
    cerrarModales([document.getElementById("modal-add")]);
    
    mostrarAlertaVisual("Producto agregado exitosamente.");
  }

  // Editar producto
  function editarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const codigo = formData.get("codigo");
    const index = inventario.findIndex(item => item.codigo === codigo);

    if (index !== -1) {
      inventario[index] = {
        ...inventario[index],
        producto: formData.get("producto"),
        categoria: formData.get("categoria"),
        marca: formData.get("marca"),
        fechaCaducidad: formData.get("fechaCaducidad"),
        precio: parseFloat(formData.get("precio")),
        stockAlmacen: parseInt(formData.get("stockAlmacen")),
        stockExhibicion: parseInt(formData.get("stockExhibicion"))
      };

      cargarInventario();
      cerrarModales([document.getElementById("modal-edit")]);
      filaSeleccionada = null;
      
      mostrarAlertaVisual("Producto modificado exitosamente.");
    }
  }

  // Confirmar eliminación
  function confirmarEliminar() {
    if (!filaSeleccionada) return;

    const celdas = filaSeleccionada.querySelectorAll("td");
    const codigo = celdas[0].textContent.trim();
    const index = inventario.findIndex(item => item.codigo === codigo);

    if (index !== -1) {
      inventario.splice(index, 1);
      cargarInventario();
      cerrarModales([document.getElementById("modal-delete")]);
      filaSeleccionada = null;
      
      mostrarAlertaVisual("Producto eliminado exitosamente.");
    }
  }

  // Utilidades
  function formatearFecha(fecha) {
    if (!fecha || fecha === "-") return "-";
    const date = new Date(fecha);
    return date.toLocaleDateString("es-ES");
  }

  function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Inicializar aplicación
  init();
});