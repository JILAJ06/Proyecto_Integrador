package clink.domain.usecases.usuario;

import clink.adapters.out.repositories.RepoUsuario;
import clink.domain.entities.Usuario;
import clink.domain.ports.usuario.CreateUsuarioUC;

import java.sql.SQLException;

public class CreateUsuario implements CreateUsuarioUC {
    private final RepoUsuario repoUsuario;

    public CreateUsuario(RepoUsuario repoUsuario) {
        this.repoUsuario = repoUsuario;
    }


    @Override
    public void createUsuario(Usuario usuario) throws SQLException {
        repoUsuario.create(usuario);
    }
}
