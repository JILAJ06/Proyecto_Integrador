package clink.domain.ports.usuario;

import clink.domain.entities.Usuario;

import java.sql.SQLException;

public interface CreateUsuarioUC {
    public void createUsuario(Usuario usuario) throws SQLException;
}
