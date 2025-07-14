package clink.domain.usecases.negocio;

import clink.adapters.out.repositories.RepoNegocio;
import clink.domain.entities.Negocio;
import clink.domain.ports.negocio.CrearNegocioUC;
import java.sql.*;

public class CrearNegocio implements CrearNegocioUC {

    private final RepoNegocio repoNegocio;

    public CrearNegocio(RepoNegocio repoNegocio) {
        this.repoNegocio = repoNegocio;
    }

    @Override
    public void crearNegocio(Negocio negocio) throws SQLException  {
        repoNegocio.create(negocio);
    }
}
