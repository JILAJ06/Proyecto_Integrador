package clink.domain.entities;

//APPROVED

import java.util.ArrayList;
import java.util.List;

public class CorteCaja {
    private int idCorteCaja;
    private Usuario usuario;
    private Negocio negocio;
    private String fechaInicio;
    private String fechaFin;
    private final List<Venta> ventas = new ArrayList<>();
    private double totalVentas;

    public CorteCaja(int idCorteCaja, Usuario usuario, Negocio negocio, String fechaInicio, String fechaFin,
                     List<Venta> ventas, double totalVentas) {
        this.idCorteCaja = idCorteCaja;
        this.usuario = usuario;
        this.negocio = negocio;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ventas.addAll(ventas);
        this.totalVentas = totalVentas;
    }

    public CorteCaja(Usuario usuario, Negocio negocio, String fechaInicio, String fechaFin, List<Venta> ventas,
                     double totalVentas) {
        this.usuario = usuario;
        this.negocio = negocio;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.ventas.addAll(ventas);
        this.totalVentas = totalVentas;
    }


    public int getIdCorteCaja() {
        return idCorteCaja;
    }

    public void setIdCorteCaja(int idCorteCaja) {
        this.idCorteCaja = idCorteCaja;
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

    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public String getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(String fechaFin) {
        this.fechaFin = fechaFin;
    }

    public List<Venta> getVentas() {
        return ventas;
    }

    public double getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(double totalVentas) {
        this.totalVentas = totalVentas;
    }

    public void addVenta(List<DetalleVenta> detalleVentaList, float total, Cliente cliente, Usuario usuario,
                         Negocio negocio, String fechaHoraVenta) {
        Venta venta = new Venta(detalleVentaList, total, cliente, usuario, negocio, this, fechaHoraVenta);
        this.ventas.add(venta);
        this.totalVentas += total;
    }

    public void removeVenta(Venta venta) {
        if (this.ventas.remove(venta)) {
            this.totalVentas -= venta.getTotal();
        }
    }
}
