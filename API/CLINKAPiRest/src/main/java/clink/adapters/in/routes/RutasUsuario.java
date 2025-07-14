package clink.adapters.in.routes;

import clink.adapters.in.controllers.UsuarioController;
import io.javalin.Javalin;

public class RutasUsuario {
    private final UsuarioController usuarioController;

    public RutasUsuario(UsuarioController usuarioController) {
        this.usuarioController = usuarioController;
    }

    public void usuarioRoutes(Javalin app) {
        app.post("/negocio/{id}/usuario", usuarioController::setCreateUsuario);
        app.get("/negocio/{id}/usuarios", usuarioController::setGetAllUsuariosByNegocio);
        app.get("negocio/{id}/usuario/{nombre}", usuarioController::setGetUsuarioInNegocio);

    }
}
