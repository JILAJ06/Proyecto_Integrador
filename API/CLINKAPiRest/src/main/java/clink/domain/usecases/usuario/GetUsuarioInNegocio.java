package clink.domain.usecases.usuario;

import clink.adapters.out.repositories.RepoUsuario;
import clink.domain.entities.Usuario;
import clink.domain.ports.usuario.GetUsuarioInNegocioUC;

import java.sql.SQLException;

public class GetUsuarioInNegocio implements GetUsuarioInNegocioUC {
    private final RepoUsuario repoUsuario;

    public GetUsuarioInNegocio(RepoUsuario repoUsuario) {
        this.repoUsuario = repoUsuario;
    }

    @Override
    public Usuario getUsuarioInNegocioUC(int idNegocio, String nombreUsuario) throws SQLException {
        return repoUsuario.getUsuarioInNegocio(idNegocio, nombreUsuario);
    }
}
