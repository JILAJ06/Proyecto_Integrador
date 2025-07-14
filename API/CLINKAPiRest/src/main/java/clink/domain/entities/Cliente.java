package clink.domain.entities;

public class Cliente {
    private int idCliente;
    private Negocio negocio;
    private String nombre;
    private String telefono;

    public Cliente() {
    }

    public Cliente(int idCliente, Negocio negocio, String nombre, String telefono) {
        this.idCliente = idCliente;
        this.negocio = negocio;
        this.nombre = nombre;
        this.telefono = telefono;
    }

    public Cliente(Negocio negocio, String nombre, String telefono) {
        this.negocio = negocio;
        this.nombre = nombre;
        this.telefono = telefono;
    }

    public int getIdCliente() {
        return idCliente;
    }

    public void setIdCliente(int idCliente) {
        this.idCliente = idCliente;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }
}
