package clink.domain.entities.utilities;

public class LoginRequest {
    public String username;
    public String password;
    public String rol;
    public int idNegocio;

    public LoginRequest(String username, String password, String rol, int idNegocio) {
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.idNegocio = idNegocio;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getIdNegocio() {
        return idNegocio;
    }

    public void setIdNegocio(int idNegocio) {
        this.idNegocio = idNegocio;
    }
}
