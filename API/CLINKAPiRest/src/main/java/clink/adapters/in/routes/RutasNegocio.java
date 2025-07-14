package clink.adapters.in.routes;

import clink.adapters.in.controllers.NegocioController;
import io.javalin.Javalin;

public class RutasNegocio {
    private final NegocioController negocioController;

    public RutasNegocio(NegocioController negocioController) {
        this.negocioController = negocioController;
    }

    public void negocioRoutes(Javalin app){
        app.post("/negocio", negocioController::crearNegocio);
        app.get("/negocio/{id}", negocioController::buscarNegocioID);
    }

}
