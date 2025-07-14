package clink.domain.entities;

public class Categoria {
    private int idCategoria;
    private Negocio negocio;
    private String nombreCategoria;

    public Categoria() {
    }

    public Categoria(int idCategoria, Negocio negocio, String nombreCategoria) {
        this.idCategoria = idCategoria;
        this.negocio = negocio;
        this.nombreCategoria = nombreCategoria;
    }

    public Categoria(Negocio negocio, String nombreCategoria) {
        this.negocio = negocio;
        this.nombreCategoria = nombreCategoria;
    }

    public Categoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
    }

    public int getIdCategoria() {
        return idCategoria;
    }

    public void setIdCategoria(int idCategoria) {
        this.idCategoria = idCategoria;
    }

    public String getNombreCategoria() {
        return nombreCategoria;
    }

    public void setNombreCategoria(String nombreCategoria) {
        this.nombreCategoria = nombreCategoria;
    }
}
