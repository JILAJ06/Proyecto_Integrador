package clink.domain.entities.utilities;

public enum Medidas {
    UNIDAD("U"),
    KILOGRAMO("Kg"),
    LITRO("L"),
    MILILITRO("Ml"),
    GRAMO("G");

    private final String descripcion;

    Medidas(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
