package clink.domain.ports.auth;

import io.jsonwebtoken.JwtBuilder;

import java.sql.SQLException;

public interface GenerateTokenUC {
    public String generateToken(String username, String password) throws SQLException;
}
