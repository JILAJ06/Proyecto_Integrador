package clink.adapters.in.appmodules;

import clink.adapters.in.controllers.NegocioController;
import clink.adapters.in.controllers.UsuarioController;
import clink.adapters.in.routes.RutasNegocio;
import clink.adapters.in.routes.RutasUsuario;
import clink.adapters.out.repositories.RepoNegocio;
import clink.adapters.out.repositories.RepoUsuario;
import clink.domain.usecases.negocio.BuscarNegocioID;
import clink.domain.usecases.negocio.CrearNegocio;
import clink.domain.usecases.usuario.CreateUsuario;
import clink.domain.usecases.usuario.GetAllUsuariosByNegocio;
import clink.domain.usecases.usuario.GetUsuarioInNegocio;
import io.javalin.Javalin;

public class LayerOne {
    public static RutasNegocio initNegocio(){
        RepoNegocio repoNegocio = new RepoNegocio();
        CrearNegocio crearNegocio = new CrearNegocio(repoNegocio);
        BuscarNegocioID buscarNegocioID = new BuscarNegocioID(repoNegocio);
        NegocioController negocioController = new NegocioController(crearNegocio,  buscarNegocioID);
        RutasNegocio rutasNegocio = new RutasNegocio(negocioController);
        return rutasNegocio;
    }

    public static RutasUsuario initUsuario() {
        RepoUsuario repoUsuario = new RepoUsuario();
        GetAllUsuariosByNegocio getAllUsuariosByNegocio = new GetAllUsuariosByNegocio(repoUsuario);
        GetUsuarioInNegocio getUsuarioInNegocio = new GetUsuarioInNegocio(repoUsuario);
        CreateUsuario createUsuario = new CreateUsuario(repoUsuario);
        UsuarioController usuarioController = new UsuarioController(createUsuario, getAllUsuariosByNegocio, getUsuarioInNegocio);
        RutasUsuario rutasUsuario = new RutasUsuario(usuarioController);
        return rutasUsuario;
    }


}
