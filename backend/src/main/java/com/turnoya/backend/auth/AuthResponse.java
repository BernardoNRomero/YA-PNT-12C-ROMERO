package com.turnoya.backend.auth;

public record AuthResponse(String token, String nombreUsuario, String nombreCompleto, String rol) {
}