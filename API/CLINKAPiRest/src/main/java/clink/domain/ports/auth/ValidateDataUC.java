package clink.domain.ports.auth;

import java.sql.SQLException;

public interface ValidateDataUC {
    public boolean validateData(int idNegocio, String nombreUsuario, String contrasena, String rol) throws SQLException;
}
