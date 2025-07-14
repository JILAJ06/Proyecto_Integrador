package clink.adapters.in.controllers;

import clink.domain.entities.Negocio;
import clink.domain.usecases.negocio.BuscarNegocioID;
import clink.domain.usecases.negocio.CrearNegocio;
import io.javalin.*;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;

public class NegocioController {
    private final CrearNegocio crearNegocio;
    private final BuscarNegocioID buscarNegocioID;

    public NegocioController(CrearNegocio crearNegocio, BuscarNegocioID buscarNegocioID) {
        this.crearNegocio = crearNegocio;
        this.buscarNegocioID = buscarNegocioID;
    }

    public void buscarNegocioID(Context ctx) {
        try {
            int id = Integer.parseInt(ctx.pathParam("id"));
            Negocio negocio = buscarNegocioID.getByID(id);
            if(negocio != null){
                ctx.json(negocio);
            } else {
                ctx.status(HttpStatus.NOT_FOUND).result("Negocio no encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(404).result("Error al buscar negocio");
        }
    }

    public void crearNegocio(Context context){
        try{
            Negocio negocio = context.bodyAsClass(Negocio.class);
            crearNegocio.crearNegocio(negocio);
            context.status(200).result("Usuario creado exitosamente");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
