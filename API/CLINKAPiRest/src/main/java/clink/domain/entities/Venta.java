package clink.domain.entities;

//APPROVED

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.time.*;

public class Venta {
    private int idVenta;
    private final List<DetalleVenta> detallesVentas = new ArrayList<>();
    private float total;
    private Cliente cliente;
    private Usuario usuario;
    private Negocio negocio;
    private CorteCaja corteCaja;
    private String fechaHoraVenta;

    public Venta(List<DetalleVenta> detallesVentas, float total, Cliente cliente, Usuario usuario, Negocio negocio,
                 CorteCaja corteCaja, String fechaHoraVenta) {
        this.detallesVentas.addAll(detallesVentas);
        this.total = total;
        this.cliente = cliente;
        this.usuario = usuario;
        this.negocio = negocio;
        this.corteCaja = corteCaja;
        this.fechaHoraVenta = fechaHoraVenta;
    }

    public Venta(int idVenta, List<DetalleVenta> detallesVentas, float total, Cliente cliente, Usuario usuario,
                 Negocio negocio, CorteCaja corteCaja, String fechaHoraVenta) {
        this.idVenta = idVenta;
        this.detallesVentas.addAll(detallesVentas);
        this.total = total;
        this.cliente = cliente;
        this.usuario = usuario;
        this.negocio = negocio;
        this.corteCaja = corteCaja;
        this.fechaHoraVenta = fechaHoraVenta;
    }

    public int getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(int idVenta) {
        this.idVenta = idVenta;
    }

    public List<DetalleVenta> getDetallesVentas() {
        return detallesVentas;
    }

    public float getTotal() {
        return total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Negocio getNegocio() {
        return negocio;
    }

    public void setNegocio(Negocio negocio) {
        this.negocio = negocio;
    }

    public CorteCaja getCorteCaja() {
        return corteCaja;
    }

    public void setCorteCaja(CorteCaja corteCaja) {
        this.corteCaja = corteCaja;
    }

    public String getFechaHoraVenta() {
        return fechaHoraVenta;
    }

    public void setFechaHoraVenta(String fechaHoraVenta) {
        this.fechaHoraVenta = fechaHoraVenta;
    }

    public void addDetalleVenta(Inventario inventario, float cantidadProducto, float precioUnitario) {
        DetalleVenta detalle =new DetalleVenta(this, inventario, cantidadProducto, precioUnitario);
        this.detallesVentas.add(detalle);
        this.total+=detalle.getSubtotal();
    }

    public void removeDetalleVenta(DetalleVenta detalle) {
        if (this.detallesVentas.remove(detalle)) {
            this.total -= detalle.getSubtotal();
        }
    }

    public List<DetalleVenta> getDetallesVenta() {
        return Collections.unmodifiableList(detallesVentas);
    }
}
