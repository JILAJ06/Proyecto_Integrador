package clink.domain.ports.negocio;

import clink.domain.entities.Negocio;

import java.sql.SQLException;

public interface BuscarNegocioIDUC {
    public Negocio getByID(int idNegocio) throws SQLException;
}
