package clink.domain.ports.usuario;

import clink.domain.entities.Negocio;

import java.sql.SQLException;

public interface GetAllUsuariosInNegocioUC {
    public Negocio getAllUsuariosByNegocio(int idNegocio) throws SQLException;
}
