package clink.domain.entities.utilities;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.*;
import java.util.*;
import java.util.concurrent.TimeUnit;

public class JwUtil {
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private final long expirationTime = TimeUnit.DAYS.toMillis(1);

    public Key getSecretKey() {
        return secretKey;
    }

    public long getExpirationTime() {
        return expirationTime;
    }

    public String generarToken(String username, int idNegocio, String rol) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setSubject(username)
                .claim("idNegocio", idNegocio)
                .claim("rol", rol)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(secretKey)
                .compact();
    }

    // Valida que el token sea válido y no haya expirado
    public boolean validarToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Extrae el nombre de usuario del token
    public String extraerUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Extrae el ID de negocio del token
    public int extraerIdNegocio(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("idNegocio", Integer.class);
    }

    public String extraerRol(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("rol", String.class);
    }
}
