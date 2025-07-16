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
            <label>Nombre del producto</label>
            <input type="text" id="producto" name="producto" required placeholder="Nombre del producto">
          </div>
          
          <div class="form-group">
            <label>Categoría</label>
            <select id="categoria" name="categoria" required>
              <option value="">Selecciona una categoría</option>
              ${categorias.filter(cat => cat.value !== "all").map(cat => 
                `<option value="${cat.value}">${cat.text}</option>`
              ).join("")}
            </select>
          </div>
          
          <div class="form-group">
            <label>Marca</label>
            <input type="text" id="marca" name="marca" required placeholder="Marca del producto">
          </div>
          
          <div class="form-group">
            <label>Ingrese la fecha de caducidad</label>
            <input type="date" id="fechaCaducidad" name="fechaCaducidad" required>
          </div>
          
          <div class="form-group">
            <label>Precio unitario</label>
            <input type="number" id="precio" name="precio" step="0.01" required placeholder="0.00">
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
    const modal = document.createElement("div");
    modal.id = "modal-delete";
    modal.className = "modal-overlay";
    
    modal.innerHTML = `
      <div class="modal-container modal-small">
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-content">
          <div class="delete-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <p>¿Estás seguro de que deseas eliminar este lote?</p>
            <p class="delete-product-info">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-buttons">
            <button type="button" class="btn-cancel">Cancelar</button>
            <button type="button" class="btn-delete-confirm">Eliminar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    return modal;
  }

  // Inicializar aplicación
  function init() {
    inventario = [...datosEjemplo];
    
    // Crear elementos dinámicos
    crearDropdown();
    const modalAdd = crearModalAgregar();
    const modalEdit = crearModalEditar();
    const modalDelete = crearModalEliminar();
    
    cargarInventario();
    setupEventListeners(modalAdd, modalEdit, modalDelete);
  }

  // Configurar event listeners
  function setupEventListeners(modalAdd, modalEdit, modalDelete) {
    // Botones principales
    btnAdd.addEventListener("click", () => abrirModalAgregar(modalAdd));
    btnEdit.addEventListener("click", () => abrirModalEditar(modalEdit));
    btnDelete.addEventListener("click", () => abrirModalEliminar(modalDelete));
    
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

    // Modales
    setupModalEvents(modalAdd, modalEdit, modalDelete);

    // Formularios
    document.getElementById("form-add-product").addEventListener("submit", agregarProducto);
    document.getElementById("form-edit-product").addEventListener("submit", editarProducto);

    // Selección de filas
    setupRowSelection();
  }

  // Configurar eventos de modales
  function setupModalEvents(modalAdd, modalEdit, modalDelete) {
    const modales = [modalAdd, modalEdit, modalDelete];
    
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

    // Botón de confirmar eliminación
    modalDelete.querySelector(".btn-delete-confirm").addEventListener("click", confirmarEliminar);
  }

  // Configurar selección de filas
  function setupRowSelection() {
    tabla.addEventListener("click", (e) => {
      const fila = e.target.closest("tr");
      if (fila && fila.children.length > 0 && fila.children[0].textContent.trim()) {
        seleccionarFila(fila);
      }
    });
  }

  // Seleccionar fila
  function seleccionarFila(fila) {
    // Remover selección anterior
    document.querySelectorAll(".products-table tbody tr").forEach(tr => {
      tr.classList.remove("selected");
    });
    
    // Seleccionar nueva fila
    fila.classList.add("selected");
    filaSeleccionada = fila;
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

  function abrirModalEliminar(modal) {
    if (!filaSeleccionada) {
      mostrarAlertaVisual("Selecciona una fila para eliminar.");
      return;
    }
    modal.classList.add("active");
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