package com.turnoya.backend.dto;

public record AuthResponse(String token, String nombreUsuario, String nombreCompleto, String rol) {
}
