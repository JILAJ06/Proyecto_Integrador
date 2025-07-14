package clink.domain.entities;

//APPROVED

public class DetalleVenta {
    private Venta venta;
    private Inventario Lote;
    private float Subtotal;
    private float cantidadProducto;
    private float precioUnitario;

    public DetalleVenta(Venta venta, Inventario lote, float cantidadProducto, float precioUnitario) {
        this.venta = venta;
        this.Lote = lote;
        this.cantidadProducto = cantidadProducto;
        this.precioUnitario = precioUnitario;
        this.Subtotal = cantidadProducto * precioUnitario;
    }

    public Venta getVenta() {
        return venta;
    }

    public void setVenta(Venta venta) {
        this.venta = venta;
    }

    public Inventario getLote() {
        return Lote;
    }

    public void setLote(Inventario lote) {
        Lote = lote;
    }

    public float getSubtotal() {
        return Subtotal;
    }

    public void setSubtotal(float subtotal) {
        Subtotal = subtotal;
    }

    public float getCantidadProducto() {
        return cantidadProducto;
    }

    public void setCantidadProducto(float cantidadProducto) {
        this.cantidadProducto = cantidadProducto;
    }

    public float getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(float precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

}
