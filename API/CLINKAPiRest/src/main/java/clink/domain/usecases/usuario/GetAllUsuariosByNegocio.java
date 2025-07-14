package clink.domain.usecases.usuario;

import clink.adapters.out.repositories.RepoUsuario;
import clink.domain.entities.Negocio;
import clink.domain.ports.usuario.GetAllUsuariosInNegocioUC;

import java.sql.SQLException;

public class GetAllUsuariosByNegocio implements GetAllUsuariosInNegocioUC {
    private final RepoUsuario repoUsuario;

    public GetAllUsuariosByNegocio(RepoUsuario repoUsuario) {
        this.repoUsuario = repoUsuario;
    }


    @Override
    public Negocio getAllUsuariosByNegocio(int idNegocio) throws SQLException {
        return repoUsuario.getAllUsuariosInNegocio(idNegocio);
    }
}
