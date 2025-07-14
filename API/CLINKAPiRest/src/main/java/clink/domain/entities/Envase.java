package clink.domain.entities;

public class Envase {
    private int idEnvase;
    private Negocio negocio;
    private String nombreEnvase;

    public Envase() {
    }

    public Envase(int idEnvase, Negocio negocio, String nombreEnvase) {
        this.idEnvase = idEnvase;
        this.negocio = negocio;
        this.nombreEnvase = nombreEnvase;
    }

    public Envase(Negocio negocio, String nombreEnvase) {
        this.negocio = negocio;
        this.nombreEnvase = nombreEnvase;
    }

    public int getIdEnvase() {
        return idEnvase;
    }

    public void setIdEnvase(int idEnvase) {
        this.idEnvase = idEnvase;
    }

    public String getNombreEnvase() {
        return nombreEnvase;
    }

    public void setNombreEnvase(String nombreEnvase) {
        this.nombreEnvase = nombreEnvase;
    }
}
