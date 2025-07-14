package clink.domain.entities;

import clink.domain.entities.utilities.Medidas;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Negocio {
    private int idNegocio;
    private String nombreNegocio;
    private final List<Inventario> inventarios = new ArrayList<>();
    private final List<Venta> ventas = new ArrayList<>();
    private final List<Cliente> clientes = new ArrayList<>();
    @JsonManagedReference
    private final List<Usuario> empleados = new ArrayList<>();
    private final List<Producto> productos = new ArrayList<>();
    private final List<Marca> marcas = new ArrayList<>();
    private final List<Envase> envases = new ArrayList<>();
    private final List<Categoria> categorias = new ArrayList<>();

    public Negocio() {
    }

    public Negocio(String nombreNegocio) {
        this.idNegocio = Integer.parseInt(null);
        this.nombreNegocio = nombreNegocio;
    }

    public Negocio(int idNegocio, String nombreNegocio) {
        this.idNegocio = idNegocio;
        this.nombreNegocio = nombreNegocio;
    }

    public Negocio(int idNegocio, String nombreNegocio, List<Inventario> inventarios, List<Venta> ventas,
                   List<Cliente> clientes, List<Usuario> empleados, List<Producto> productos, List<Categoria> categorias,
                    List<Envase> envases, List<Marca> marcas) {
        this.idNegocio = idNegocio;
        this.nombreNegocio = nombreNegocio;
        this.inventarios.addAll(inventarios);
        this.ventas.addAll(ventas);
        this.clientes.addAll(clientes);
        this.empleados.addAll(empleados);
        this.productos.addAll(productos);
        this.categorias.addAll(categorias);
        this.envases.addAll(envases);
        this.marcas.addAll(marcas);
    }

    public Negocio(String nombreNegocio, List<Inventario> inventarios, List<Venta> ventas, List<Cliente> clientes,
                   List<Usuario> empleados, List<Producto> productos, List<Categoria> categorias,
                   List<Envase> envases, List<Marca> marcas) {
        this.nombreNegocio = nombreNegocio;
        this.inventarios.addAll(inventarios);
        this.ventas.addAll(ventas);
        this.clientes.addAll(clientes);
        this.empleados.addAll(empleados);
        this.productos.addAll(productos);
        this.categorias.addAll(categorias);
        this.envases.addAll(envases);
        this.marcas.addAll(marcas);
    }

    public int getIdNegocio() {
        return idNegocio;
    }

    public void setIdNegocio(int idNegocio) {
        this.idNegocio = idNegocio;
    }

    public String getNombreNegocio() {
        return nombreNegocio;
    }

    public void setNombreNegocio(String nombreNegocio) {
        this.nombreNegocio = nombreNegocio;
    }

    public List<Inventario> getInventarios() {
        return inventarios;
    }

    public List<Venta> getVentas() {
        return ventas;
    }

    public List<Cliente> getClientes() {
        return clientes;
    }

    public List<Usuario> getEmpleados() {
        return empleados;
    }

    public List<Producto> getProductos() {
        return productos;
    }

    public List<Marca> getMarcas() {
        return marcas;
    }

    public List<Envase> getEnvases() {
        return envases;
    }

    public List<Categoria> getCategorias() {
        return categorias;
    }

    public Usuario addUsuarios(String nombreUsuario, Usuario creador, String correo, String rol, String contrasena,
                              String calle, String colonia, String codigoPostal) {
        Usuario usuario = new Usuario(this, nombreUsuario, creador, correo, rol, contrasena,
                calle, colonia, codigoPostal);
        this.empleados.add(usuario);
        return usuario;
    }

    public Usuario addUsuarios(Usuario usuario){
        if (usuario.getNegocio() == null) {
            usuario.setNegocio(this);
        }
        this.empleados.add(usuario);
        return usuario;
    }


    public void removeUsuario(Usuario usuario){
        if(this.empleados.contains(usuario)){
            this.empleados.remove(usuario);
        }
    }

    public void addCliente(String nombreCliente, String telefono) {
        Cliente cliente = new Cliente(this, nombreCliente, telefono);
        this.clientes.add(cliente);
    }

    public void removeCliente(Cliente cliente){
        if(this.clientes.contains(cliente)){
            this.clientes.remove(cliente);
        }
    }

    public void addProducto(String codigoProd, String nombreComercial, Marca marca, Envase envase, Categoria categoria,
                            String variedad, double contNeto, Medidas medida, float precioVenta) {
        Producto producto = new Producto(codigoProd, nombreComercial, marca, envase, categoria, variedad, contNeto,
                medida, precioVenta);
        this.productos.add(producto);
    }

    public void removeProducto(Producto producto){
        if(this.productos.contains(producto)){
            this.productos.remove(producto);
        }
    }

    public void addVenta(List<DetalleVenta> detalleVentas, float total, Cliente cliente, Usuario usuario,
                         CorteCaja corteCaja, String fechaHoraVenta) {
        Venta venta = new Venta(detalleVentas, total, cliente, usuario, this, corteCaja, fechaHoraVenta);
        this.ventas.add(venta);
    }

    public void removeVenta(Venta venta){
        if(this.ventas.contains(venta)){
            this.ventas.remove(venta);
        }
    }

    public void addInventario(Usuario usuario, Producto producto, int stockAlmacen,
                              int stockExhibicion, int stockMMin, String fechaCad, float precioCompra,
                              String fechaEntrada, String fechaSalida, float margenGanancia) {
        Inventario lote = new Inventario(this, usuario, producto, stockAlmacen, stockExhibicion, stockMMin, fechaCad,
                precioCompra, fechaEntrada, fechaSalida, margenGanancia);
        this.inventarios.add(lote);
    }

    public void removeInventario(Inventario inventario){
        if(this.inventarios.contains(inventario)){
            this.inventarios.remove(inventario);
        }
    }

    public Categoria addCategoria(String nombreCategoria) {
        Categoria categoria = new Categoria(this, nombreCategoria);
        this.categorias.add(categoria);
        return categoria;
    }

    public void removeCategoria(Categoria categoria){
        if(this.categorias.contains(categoria)){
            this.categorias.remove(categoria);
        }
    }

    // Para Envase
    public Envase addEnvase(String nombreEnvase) {
        Envase envase = new Envase(this, nombreEnvase);
        this.envases.add(envase);
        return envase;
    }

    public void removeEnvase(Envase envase) {
        if (this.envases.contains(envase)) {
            this.envases.remove(envase);
        }
    }

    // Para Marca
    public Marca addMarca(String nombreMarca) {
        Marca marca = new Marca(this, nombreMarca);
        this.marcas.add(marca);
        return marca;
    }

    public void removeMarca(Marca marca) {
        if (this.marcas.contains(marca)) {
            this.marcas.remove(marca);
        }
    }
}
