package clink.domain.entities;

public class Marca {
    public int idMarca;
    private Negocio negocio;
    public String nombreMarca;

    public Marca() {
    }

    public Marca(int idMarca, Negocio negocio, String nombreMarca) {
        this.idMarca = idMarca;
        this.negocio = negocio;
        this.nombreMarca = nombreMarca;
    }

    public Marca(Negocio negocio, String nombreMarca) {
        this.negocio = negocio;
        this.nombreMarca = nombreMarca;
    }

    public int getIdMarca() {
        return idMarca;
    }

    public void setIdMarca(int idMarca) {
        this.idMarca = idMarca;
    }

    public String getNombreMarca() {
        return nombreMarca;
    }

    public void setNombreMarca(String nombreMarca) {
        this.nombreMarca = nombreMarca;
    }
}
