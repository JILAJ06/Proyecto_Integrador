package clink.adapters.in.controllers;

import clink.domain.entities.Negocio;
import clink.domain.entities.Usuario;
import clink.domain.ports.usuario.GetUsuarioInNegocioUC;
import clink.domain.usecases.usuario.CreateUsuario;
import clink.domain.usecases.usuario.GetAllUsuariosByNegocio;
import io.javalin.*;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;

import java.util.List;

public class UsuarioController {
    private final CreateUsuario createUsuario;
    private final GetAllUsuariosByNegocio getAllUsuariosByNegocio;
    private final GetUsuarioInNegocioUC getUsuarioInNegocioUC;

    public UsuarioController(CreateUsuario createUsuario, GetAllUsuariosByNegocio getAllUsuariosByNegocio,
                             GetUsuarioInNegocioUC getUsuarioInNegocioUC) {
        this.createUsuario = createUsuario;
        this.getAllUsuariosByNegocio = getAllUsuariosByNegocio;
        this.getUsuarioInNegocioUC = getUsuarioInNegocioUC;
    }

    public void setCreateUsuario(Context ctx) {
        try{
            int idNegocio = Integer.parseInt(ctx.pathParam("id"));
            Usuario usuario = ctx.bodyAsClass(Usuario.class);
            if(usuario != null && idNegocio > 0){
                createUsuario.createUsuario(usuario);
                ctx.status(HttpStatus.CREATED).result("Usuario creado exitosamente");
            } else {
                ctx.status(HttpStatus.BAD_REQUEST).result("Datos de usuario inválidos");
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }
    }

    public void setGetAllUsuariosByNegocio(Context ctx) {
        try {
            int idNegocio = Integer.parseInt(ctx.pathParam("id"));
            Negocio empleados = getAllUsuariosByNegocio.getAllUsuariosByNegocio(idNegocio);
            if(empleados != null){
                ctx.json(empleados);
            } else {
                ctx.status(HttpStatus.NOT_FOUND).result("Usuario no encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(404).result("Error los usuarios");
        }
    }

    public void setGetUsuarioInNegocio(Context ctx) {
        try {
            int idNegocio = Integer.parseInt(ctx.pathParam("id"));
            String nombreUsuario = ctx.pathParam("nombre");
            Usuario usuario = getUsuarioInNegocioUC.getUsuarioInNegocioUC(idNegocio, nombreUsuario);
            if(usuario != null){
                ctx.json(usuario);
            } else {
                ctx.status(HttpStatus.NOT_FOUND).result("Usuario no encontrado");
            }
        } catch (Exception e) {
            e.printStackTrace();
            ctx.status(404).result("Error al obtener el usuario");
        }
    }
}
