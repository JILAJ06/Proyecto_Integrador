package clink.domain.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonInclude;

//APPROVED
@JsonInclude(JsonInclude.Include.NON_ABSENT)
public class Usuario {
    @JsonBackReference
    private Negocio negocio;
    private String nombreUsuario;
    private Usuario creador;
    private String correo;
    private String rol;
    private String contrasena;
    private String calle;
    private String colonia;
    private String codigoPostal;

    public Usuario(Negocio negocio, String nombreUsuario, Usuario creador, String correo, String rol,
                   String contrasena, String calle, String colonia, String codigoPostal) {
        this.negocio = negocio;
        this.nombreUsuario = nombreUsuario;
        this.creador = creador;
        this.correo = correo;
        this.rol = rol;
        this.contrasena = contrasena;
        this.calle = calle;
        this.colonia = colonia;
        this.codigoPostal = codigoPostal;
    }

    public Usuario() {
    }

    public Negocio getNegocio() {
        return negocio;
    }

    public void setNegocio(Negocio negocio) {
        this.negocio = negocio;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public Usuario getCreador() {
        return creador;
    }

    public void setCreador(Usuario creador) {
        this.creador = creador;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getColonia() {
        return colonia;
    }

    public void setColonia(String colonia) {
        this.colonia = colonia;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }
}
