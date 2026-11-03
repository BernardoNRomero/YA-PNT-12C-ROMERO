package com.turnoya.backend.view;

import com.turnoya.backend.model.Rol;

public record AuthResponse(String token, String nombreUsuario, String nombreCompleto, String rol) {
}