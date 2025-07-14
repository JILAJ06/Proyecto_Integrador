package clink.domain.usecases.auth;

import clink.adapters.out.repositories.RepoNegocio;
import clink.adapters.out.repositories.RepoUsuario;
import clink.domain.entities.Usuario;
import clink.domain.ports.auth.ValidateDataUC;

import java.sql.SQLException;

public class Login implements ValidateDataUC {
    private final RepoUsuario repoUsuario;
    private final RepoNegocio repoNegocio;

    public Login(RepoUsuario repoUsuario, RepoNegocio repoNegocio) {
        this.repoUsuario = repoUsuario;
        this.repoNegocio = repoNegocio;
    }

    public boolean validateData(int idNegocio, String nombreUsuario, String contrasena, String rol) throws SQLException {
        Usuario usuario = repoUsuario.getUsuarioInNegocio(idNegocio, nombreUsuario);
        if (usuario.getNegocio().getIdNegocio() == idNegocio && usuario.getContrasena().equals(contrasena)
        && usuario.getNombreUsuario().equals(nombreUsuario) && usuario.getRol().equals(rol)) {
            return true;
        } else  {
            return false;
        }
    }
}
