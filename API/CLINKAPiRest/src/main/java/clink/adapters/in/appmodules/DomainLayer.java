package clink.adapters.in.appmodules;

import clink.domain.entities.utilities.JwUtil;
import io.javalin.Javalin;
import io.javalin.http.Context;
import io.javalin.http.Handler;

public class DomainLayer {

    private final JwUtil jwUtil = new JwUtil();
    private final LayerOne layerOne;

    public DomainLayer() {
        this.layerOne = new LayerOne();
    }

    public void configureRoutes(Javalin app) {
        // Ruta principal
        app.get("/", ctx -> ctx.result("API CLINK 1.0"));

        // Rutas de autenticación - verificando el host para auth.tudominio.com
        app.post("/login", ctx -> {
            if (esSubdominioAuth(ctx)) {
                // Aquí deberías llamar a tu controlador de autenticación
                ctx.result("Login endpoint");
            } else {
                ctx.status(404);
            }
        });

        app.post("/register", ctx -> {
            if (esSubdominioAuth(ctx)) {
                // Aquí deberías llamar a tu controlador de autenticación
                ctx.result("Register endpoint");
            } else {
                ctx.status(404);
            }
        });

        // Middleware de protección para rutas de negocio
        app.before("/negocio/*", protegerRutasNegocio());

        // Configurar las rutas de negocio (sólo accesibles con token válido)
        LayerOne.initNegocio().negocioRoutes(app);
        LayerOne.initUsuario().usuarioRoutes(app);
    }

    private boolean esSubdominioAuth(Context ctx) {
        String host = ctx.host();
        return host != null && host.startsWith("auth.");
    }

    private boolean esSubdominioNegocio(Context ctx) {
        String host = ctx.host();
        return host != null && host.startsWith("negocio.");
    }

    private Handler protegerRutasNegocio() {
        return ctx -> {
            // Primero verificamos si es el subdominio correcto
            if (!esSubdominioNegocio(ctx)) {
                ctx.status(404);
                ctx.skipRemainingHandlers();
                return;
            }

            // Verificamos autenticación por token
            String authHeader = ctx.header("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwUtil.validarToken(token)) {
                    String username = jwUtil.extraerUsername(token);
                    int idNegocio = jwUtil.extraerIdNegocio(token);
                    ctx.attribute("username", username);
                    ctx.attribute("idNegocio", idNegocio);
                } else {
                    ctx.status(401).result("Token inválido o expirado");
                    ctx.skipRemainingHandlers();
                }
            } else {
                ctx.status(401).result("Token no proporcionado o formato incorrecto");
                ctx.skipRemainingHandlers();
            }
        };
    }
}