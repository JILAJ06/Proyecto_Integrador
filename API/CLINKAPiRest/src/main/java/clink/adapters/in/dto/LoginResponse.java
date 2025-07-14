package clink.adapters.in.dto;

public class LoginResponse {
    public String token;
    public long expiresIn;
    public LoginResponse(String token, long expiresIn) {
        this.token = token;
        this.expiresIn = expiresIn;
    }
}