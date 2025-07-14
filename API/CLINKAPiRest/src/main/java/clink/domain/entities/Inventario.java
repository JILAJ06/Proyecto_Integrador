package clink.domain.entities;

//APPROVED

public class Inventario {
    private int idRegistro;
    private Negocio negocio;
    private Usuario usuario;
    private Producto producto;
    private int stockAlmacen;
    private int stockExhibicion;
    private int StockMin;
    private String fechaCAD;
    private float precioCompra;
    private String fechaEntrada;
    private String fechaSalida;
    private float margenGanancia;

    public Inventario(int idRegistro, Negocio negocio, Usuario usuario, Producto producto, int stockAlmacen,
                      int stockExhibicion, int stockMin, String fechaCAD, float precioCompra, String fechaEntrada,
                      String fechaSalida, float margenGanancia) {
        this.idRegistro = idRegistro;
        this.negocio = negocio;
        this.usuario = usuario;
        this.producto = producto;
        this.stockAlmacen = stockAlmacen;
        this.stockExhibicion = stockExhibicion;
        this.StockMin = stockMin;
        this.fechaCAD = fechaCAD;
        this.precioCompra = precioCompra;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.margenGanancia = margenGanancia;
    }

    public Inventario(Negocio negocio, Usuario usuario, Producto producto, int stockAlmacen, int stockExhibicion,
                      int stockMin, String fechaCAD, float precioCompra, String fechaEntrada, String fechaSalida, float margenGanancia) {
        this.negocio = negocio;
        this.usuario = usuario;
        this.producto = producto;
        this.stockAlmacen = stockAlmacen;
        this.stockExhibicion = stockExhibicion;
        StockMin = stockMin;
        this.fechaCAD = fechaCAD;
        this.precioCompra = precioCompra;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.margenGanancia = margenGanancia;
    }

    public int getIdRegistro() {
        return idRegistro;
    }

    public void setIdRegistro(int idRegistro) {
        this.idRegistro = idRegistro;
    }

    public Negocio getNegocio() {
        return negocio;
    }

    public void setNegocio(Negocio negocio) {
        this.negocio = negocio;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public int getStockAlmacen() {
        return stockAlmacen;
    }

    public void setStockAlmacen(int stockAlmacen) {
        this.stockAlmacen = stockAlmacen;
    }

    public int getStockExhibicion() {
        return stockExhibicion;
    }

    public void setStockExhibicion(int stockExhibicion) {
        this.stockExhibicion = stockExhibicion;
    }

    public int getStockMin() {
        return StockMin;
    }

    public void setStockMin(int stockMin) {
        StockMin = stockMin;
    }

    public String getFechaCAD() {
        return fechaCAD;
    }

    public void setFechaCAD(String fechaCAD) {
        this.fechaCAD = fechaCAD;
    }

    public float getPrecioCompra() {
        return precioCompra;
    }

    public void setPrecioCompra(float precioCompra) {
        this.precioCompra = precioCompra;
    }

    public String getFechaEntrada() {
        return fechaEntrada;
    }

    public void setFechaEntrada(String fechaEntrada) {
        this.fechaEntrada = fechaEntrada;
    }

    public String getFechaSalida() {
        return fechaSalida;
    }

    public void setFechaSalida(String fechaSalida) {
        this.fechaSalida = fechaSalida;
    }

    public float getMargenGanancia() {
        return margenGanancia;
    }

    public void setMargenGanancia(float margenGanancia) {
        this.margenGanancia = margenGanancia;
    }

    public void addUsuario(Usuario usuario) {

    }
}
