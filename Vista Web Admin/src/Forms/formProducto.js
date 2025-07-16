document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let productos = [];
  let filaSeleccionada = null;

  // Datos de ejemplo
  const datosEjemplo = [
    {
      codigo: "P001",
      categoria: "limpieza",
      marca: "Cloralex",
      nombre: "Cloro",
      envase: "botella",
      variedad: "Gel",
      contenido: "500",
      medida: "ml",
      precio: 25.50
    },
    {
      codigo: "P002",
      categoria: "bebidas",
      marca: "Coca Cola",
      nombre: "Refresco",
      envase: "botella",
      variedad: "Original",
      contenido: "600",
      medida: "ml",
      precio: 20.00
    }
  ];

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
              <input type="text" id="edit-codigo-producto" name="codigo" required readonly>
            </div>
            
            <div class="form-group">
              <label>Contenido</label>
              <input type="text" id="edit-contenido" name="contenido" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Nombre</label>
              <input type="text" id="edit-nombre-producto" name="nombre" required>
            </div>
            
            <div class="form-group">
              <label>Categoría</label>
              <select id="edit-categoria-producto" name="categoria" required>
                <option value="bebidas">Bebidas</option>
                <option value="snacks">Snacks</option>
                <option value="dulces">Dulces</option>
                <option value="lacteos">Lácteos</option>
                <option value="panaderia">Panadería</option>
                <option value="limpieza">Limpieza</option>
                <option value="higiene">Higiene Personal</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Marca</label>
              <input type="text" id="edit-marca-producto" name="marca" required>
            </div>
            
            <div class="form-group">
              <label>Envase</label>
              <select id="edit-envase" name="envase" required>
                <option value="botella">Botella</option>
                <option value="lata">Lata</option>
                <option value="bolsa">Bolsa</option>
                <option value="caja">Caja</option>
                <option value="frasco">Frasco</option>
                <option value="tetrapack">Tetrapack</option>
                <option value="sobre">Sobre</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Variedad</label>
              <input type="text" id="edit-variedad" name="variedad" required>
            </div>
            
            <div class="form-group">
              <label>Medida</label>
              <select id="edit-medida" name="medida" required>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="pz">pz</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Precio</label>
              <input type="number" id="edit-precio" name="precio" step="0.01" required>
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
    
    // Aplicar estilos inline consistentes
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
    
    return modal;
  }

  // Crear modal para eliminar producto
  function crearModalEliminar() {
    const modal = document.createElement("div");
    modal.id = "modal-eliminar-producto";
    modal.className = "modal-overlay";
    
    modal.innerHTML = `
      <div class="modal-container modal-small advertencia-modal">
        <div class="modal-content">
          <div class="delete-warning">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Advertencia</h3>
            <p>Esta a punto de eliminar un producto de esta sección, ¿esta seguro de querer realizar esta acción?</p>
          </div>
          <div class="modal-buttons">
            <button type="button" class="btn-accept-advertencia">Aceptar</button>
            <button type="button" class="btn-cancel-advertencia">Cancelar</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    
    // Aplicar estilos inline consistentes
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
        background: #D4C5A1;
        border-radius: 20px;
        width: 600px;
        height: 451px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
        padding: 0;
        text-align: center;
        border: 4px solid #8B7355;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
      `;
    }
    
    return modal;
  }

  // Cargar productos en la tabla
  function cargarProductos() {
    const tbody = document.querySelector(".productos-table tbody");
    tbody.innerHTML = "";
    
    productos.forEach(producto => {
      const fila = crearFilaProducto(producto);
      tbody.appendChild(fila);
    });

    // Completar con filas vacías si es necesario
    const filasVacias = Math.max(0, 8 - productos.length);
    for (let i = 0; i < filasVacias; i++) {
      const filaVacia = document.createElement("tr");
      for (let j = 0; j < 9; j++) {
        filaVacia.appendChild(document.createElement("td"));
      }
      tbody.appendChild(filaVacia);
    }
  }

  // Crear fila de producto
  function crearFilaProducto(producto) {
    const fila = document.createElement("tr");
    
    const campos = [
      producto.codigo,
      capitalizarTexto(producto.categoria),
      producto.marca,
      producto.nombre,
      capitalizarTexto(producto.envase),
      producto.variedad,
      producto.contenido,
      producto.medida,
      `$${producto.precio.toFixed(2)}`
    ];

    campos.forEach(campo => {
      const celda = document.createElement("td");
      celda.textContent = campo;
      fila.appendChild(celda);
    });

    return fila;
  }

  // Función para abrir el modal de agregar
  function abrirModalProducto() {
    console.log("Abriendo modal de producto..."); // Debug
    let modal = document.getElementById("modal-producto");
    
    if (!modal) {
      modal = crearModalProducto();
      setupModalEvents(modal);
    }
    
    // Asegurar que el modal está en el DOM
    if (!document.body.contains(modal)) {
      document.body.appendChild(modal);
    }
    
    document.getElementById("form-producto").reset();
    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.classList.add("active");
  }

  // Función para abrir el modal de editar
  function abrirModalEditar() {
    if (!filaSeleccionada) {
      alert("Por favor seleccione un producto para editar.");
      return;
    }

    let modal = document.getElementById("modal-editar-producto");
    if (!modal) {
      modal = crearModalEditar();
    }
    setupModalEvents(modal);

    const celdas = filaSeleccionada.querySelectorAll("td");
    const codigo = celdas[0].textContent.trim();
    const producto = productos.find(p => p.codigo === codigo);

    if (producto) {
      document.getElementById("edit-codigo-producto").value = producto.codigo;
      document.getElementById("edit-contenido").value = producto.contenido;
      document.getElementById("edit-nombre-producto").value = producto.nombre;
      document.getElementById("edit-categoria-producto").value = producto.categoria;
      document.getElementById("edit-marca-producto").value = producto.marca;
      document.getElementById("edit-envase").value = producto.envase;
      document.getElementById("edit-variedad").value = producto.variedad;
      document.getElementById("edit-medida").value = producto.medida;
      document.getElementById("edit-precio").value = producto.precio;
    }

    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.classList.add("active");
  }

  // Función para eliminar producto
  function eliminarProducto() {
    if (!filaSeleccionada) {
      alert("Por favor seleccione un producto para eliminar.");
      return;
    }

    let modal = document.getElementById("modal-eliminar-producto");
    if (!modal) {
      modal = crearModalEliminar();
      setupModalEliminarEvents(modal);
    }

    modal.style.display = "flex";
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
    modal.classList.add("active");
  }

  // Configurar eventos específicos del modal de eliminar
  function setupModalEliminarEvents(modal) {
    // Cerrar haciendo click fuera del modal
    modal.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        cerrarModal();
      }
    });

    // Botón de confirmar eliminación (ahora es "Aceptar")
    const acceptBtn = modal.querySelector(".btn-accept-advertencia");
    if (acceptBtn) {
      acceptBtn.addEventListener("click", confirmarEliminar);
    }

    // Cerrar con botón cancelar
    const cancelBtn = modal.querySelector(".btn-cancel-advertencia");
    if (cancelBtn) {
      cancelBtn.addEventListener("click", cerrarModal);
    }
  }

  // Confirmar eliminación
  function confirmarEliminar() {
    if (!filaSeleccionada) return;

    const celdas = filaSeleccionada.querySelectorAll("td");
    const codigo = celdas[0].textContent.trim();
    const index = productos.findIndex(p => p.codigo === codigo);

    if (index !== -1) {
      productos.splice(index, 1);
      cargarProductos();
      cerrarModal();
      filaSeleccionada = null;
      alert("Producto eliminado exitosamente.");
    }
  }

  // Función para cerrar modales
  function cerrarModal() {
    const modales = document.querySelectorAll(".modal-overlay");
    modales.forEach(modal => {
      modal.classList.remove("active");
      setTimeout(() => {
        modal.style.display = "none";
        modal.style.visibility = "hidden";
        modal.style.opacity = "0";
      }, 300);
    });
  }

  // Configurar eventos del modal
  function setupModalEvents(modal) {
    // Cerrar con botón X
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.removeEventListener("click", cerrarModal);
      closeBtn.addEventListener("click", cerrarModal);
    }

    // Cerrar con botón cancelar
    const cancelBtn = modal.querySelector(".btn-cancel");
    if (cancelBtn) {
      cancelBtn.removeEventListener("click", cerrarModal);
      cancelBtn.addEventListener("click", cerrarModal);
    }

    // Cerrar haciendo click fuera del modal
    modal.removeEventListener("click", handleModalClick);
    modal.addEventListener("click", handleModalClick);

    // Envío del formulario
    const form = modal.querySelector("form");
    if (form) {
      form.removeEventListener("submit", handleFormSubmit);
      form.addEventListener("submit", handleFormSubmit);
    }
  }

  function handleModalClick(e) {
    if (e.target === e.currentTarget) {
      cerrarModal();
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    if (e.target.id === "form-producto") {
      guardarProducto(e);
    } else if (e.target.id === "form-editar-producto") {
      editarProducto(e);
    }
  }

  // Función para guardar el producto
  function guardarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const nuevoProducto = {
      codigo: formData.get("codigo"),
      nombre: formData.get("nombre"),
      marca: formData.get("marca"),
      variedad: formData.get("variedad"),
      contenido: formData.get("contenido"),
      categoria: formData.get("categoria"),
      envase: formData.get("envase"),
      medida: formData.get("medida"),
      precio: parseFloat(formData.get("precio")),
      fechaCreacion: new Date().toISOString().split("T")[0]
    };

    // Validar campos requeridos
    const camposRequeridos = ['codigo', 'nombre', 'marca', 'variedad', 'contenido', 'categoria', 'envase', 'medida', 'precio'];
    const camposFaltantes = camposRequeridos.filter(campo => !nuevoProducto[campo]);
    
    if (camposFaltantes.length > 0) {
      alert(`Por favor complete los siguientes campos: ${camposFaltantes.join(', ')}`);
      return;
    }

    // Verificar si el código ya existe
    if (productos.some(p => p.codigo === nuevoProducto.codigo)) {
      alert("Ya existe un producto con este código.");
      return;
    }

    productos.push(nuevoProducto);
    cargarProductos();
    cerrarModal();
    alert("Producto guardado exitosamente");
    e.target.reset();
  }

  // Función para editar producto
  function editarProducto(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const codigo = formData.get("codigo");
    const index = productos.findIndex(p => p.codigo === codigo);

    if (index !== -1) {
      productos[index] = {
        codigo: codigo,
        nombre: formData.get("nombre"),
        marca: formData.get("marca"),
        variedad: formData.get("variedad"),
        contenido: formData.get("contenido"),
        categoria: formData.get("categoria"),
        envase: formData.get("envase"),
        medida: formData.get("medida"),
        precio: parseFloat(formData.get("precio")),
        fechaCreacion: productos[index].fechaCreacion
      };

      cargarProductos();
      cerrarModal();
      filaSeleccionada = null;
      alert("Producto actualizado exitosamente");
    }
  }

  // Configurar selección de filas
  function setupRowSelection() {
    const tabla = document.querySelector(".productos-table tbody");
    tabla.addEventListener("click", (e) => {
      const fila = e.target.closest("tr");
      if (fila && fila.querySelector("td").textContent.trim()) {
        seleccionarFila(fila);
      }
    });
  }

  // Seleccionar fila
  function seleccionarFila(fila) {
    document.querySelectorAll(".productos-table tbody tr").forEach(tr => {
      tr.classList.remove("selected");
    });
    
    fila.classList.add("selected");
    filaSeleccionada = fila;
  }

  // Utilidades
  function capitalizarTexto(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Función para inicializar el formulario
  function init() {
    console.log("Inicializando formProducto.js..."); // Debug
    
    // Cargar datos de ejemplo
    productos = [...datosEjemplo];
    cargarProductos();

    // Configurar event listeners de los botones del HTML
    const btnAgregar = document.querySelector(".btn-add");
    const btnEditar = document.querySelector(".btn-edit");
    const btnEliminar = document.querySelector(".btn-category"); // Este es el botón eliminar según el HTML

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
        padding: 40px !important;
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