package clink.domain.ports.usuario;

import clink.domain.entities.Usuario;
import java.sql.*;

public interface GetUsuarioInNegocioUC {
    public Usuario getUsuarioInNegocioUC(int idNegocio, String nombreUsuario) throws SQLException;
}
