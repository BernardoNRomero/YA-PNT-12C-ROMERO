package com.turnoya.backend.dto;

import com.turnoya.backend.model.Usuario;

public record UsuarioAdminResponse(
        Long id,
        String nombreUsuario,
        String correo,
        String nombreCompleto,
        String rol,
        boolean activo
) {
    public static UsuarioAdminResponse from(Usuario usuario) {
        return new UsuarioAdminResponse(
                usuario.getId(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getNombreCompleto(),
                usuario.getRol().name(),
                usuario.isActivo()
        );
    }
}
