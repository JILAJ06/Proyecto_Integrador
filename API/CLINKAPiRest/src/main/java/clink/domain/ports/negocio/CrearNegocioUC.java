package clink.domain.ports.negocio;

import clink.domain.entities.Negocio;
import java.sql.*;

public interface CrearNegocioUC {
    public void crearNegocio(Negocio negocio) throws SQLException;
}
