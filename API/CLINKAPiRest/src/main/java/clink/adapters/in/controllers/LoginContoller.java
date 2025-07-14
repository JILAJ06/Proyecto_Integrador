package clink.adapters.in.controllers;

import clink.domain.entities.utilities.JwUtil;
import clink.domain.entities.utilities.LoginRequest;
import clink.domain.entities.utilities.LoginResponse;
import clink.domain.usecases.auth.Login;

import io.javalin.http.Context;

import java.sql.SQLException;
import java.util.Map;


public class LoginContoller {
    private final Login login;
    private final JwUtil jwUtil;

    public LoginContoller(Login login, JwUtil jwUtil) {
        this.login = login;
        this.jwUtil = jwUtil;
    }

    public void setLogin(Context ctx) throws SQLException {
        LoginRequest request = ctx.bodyAsClass(LoginRequest.class);

        boolean credencialesValidas = login.validateData(request.getIdNegocio(),
                request.getUsername(),
                request.getPassword(),
                request.getRol());

        if(credencialesValidas) {
            // Aquí se generaría el token, pero por ahora solo devolvemos un mensaje de éxito
            String token = jwUtil.generarToken(request.getUsername(), request.getIdNegocio(), request.getRol());
            ctx.json(new LoginResponse(token, jwUtil.getExpirationTime()));
        } else {
            ctx.status(401).json(Map.of("message", "Credenciales inválidas"));
        }

    }
}
