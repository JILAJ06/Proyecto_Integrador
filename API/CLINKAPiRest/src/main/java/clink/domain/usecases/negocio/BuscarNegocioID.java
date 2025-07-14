package clink.domain.usecases.negocio;

import clink.adapters.out.repositories.RepoNegocio;
import clink.domain.entities.Negocio;
import clink.domain.ports.negocio.BuscarNegocioIDUC;

import java.sql.SQLException;

public class BuscarNegocioID implements BuscarNegocioIDUC {

    private final RepoNegocio repoNegocio;

    public BuscarNegocioID(RepoNegocio repoNegocio) {
        this.repoNegocio = repoNegocio;
    }

    @Override
    public Negocio getByID(int idNegocio) throws SQLException {
        return repoNegocio.getByID(idNegocio);
    }
}
