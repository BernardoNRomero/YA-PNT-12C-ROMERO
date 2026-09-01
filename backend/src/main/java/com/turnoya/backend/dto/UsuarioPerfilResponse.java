package com.turnoya.backend.dto;

import com.turnoya.backend.model.Usuario;

public record UsuarioPerfilResponse(
        Long id,
        String nombreUsuario,
        String correo,
        String nombreCompleto,
        String imagenPerfil,
        String rol
) {
    public static UsuarioPerfilResponse from(Usuario usuario) {
        return new UsuarioPerfilResponse(
                usuario.getId(),
                usuario.getNombreUsuario(),
                usuario.getCorreo(),
                usuario.getNombreCompleto(),
                usuario.getImagenPerfil(),
                usuario.getRol().name()
        );
    }
}
