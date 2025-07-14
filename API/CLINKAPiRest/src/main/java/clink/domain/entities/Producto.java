package clink.domain.entities;

import clink.domain.entities.utilities.Medidas;

//APPROVED

public class Producto {
    private String codigoProducto;
    private String nombreComercial;
    private final Marca marca;
    private final Envase envase;
    private final Categoria categoria;
    private String Variedad;
    private double contNeto;
    private Medidas Medida;
    private float precioVenta;

    public Producto(String codigoProducto, String nombreComercial, Marca marca, Envase envase, Categoria categoria,
                    String variedad, double contNeto, Medidas medida, float precioVenta) {
        this.codigoProducto = codigoProducto;
        this.nombreComercial = nombreComercial;
        this.marca = marca;
        this.envase = envase;
        this.categoria = categoria;
        this.Variedad = variedad;
        this.contNeto = contNeto;
        this.Medida = medida;
        this.precioVenta = precioVenta;
    }

    public String getCodigoProducto() {
        return codigoProducto;
    }

    public void setCodigoProducto(String codigoProducto) {
        this.codigoProducto = codigoProducto;
    }

    public String getNombreComercial() {
        return nombreComercial;
    }

    public void setNombreComercial(String nombreComercial) {
        this.nombreComercial = nombreComercial;
    }

    public Marca getMarca() {
        return marca;
    }

    public Envase getEnvase() {
        return envase;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public String getVariedad() {
        return Variedad;
    }

    public void setVariedad(String variedad) {
        Variedad = variedad;
    }

    public double getContNeto() {
        return contNeto;
    }

    public void setContNeto(double contNeto) {
        this.contNeto = contNeto;
    }

    public Medidas getMedida() {
        return Medida;
    }

    public void setMedida(Medidas medida) {
        Medida = medida;
    }

    public float getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(float precioVenta) {
        this.precioVenta = precioVenta;
    }
}
