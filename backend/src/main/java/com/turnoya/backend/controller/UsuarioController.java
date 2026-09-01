package com.turnoya.backend.controller;

import com.turnoya.backend.dto.ActualizarPerfilRequest;
import com.turnoya.backend.dto.UsuarioPerfilResponse;
import com.turnoya.backend.model.Usuario;
import com.turnoya.backend.security.UserPrincipal;
import com.turnoya.backend.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Perfil del usuario autenticado (nombre, imagen, contraseña). */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping("/me")
    public UsuarioPerfilResponse miPerfil(@AuthenticationPrincipal UserPrincipal principal) {
        return UsuarioPerfilResponse.from(principal.getUsuario());
    }

    @PutMapping("/me")
    public UsuarioPerfilResponse actualizarMiPerfil(@AuthenticationPrincipal UserPrincipal principal,
                                                     @Valid @RequestBody ActualizarPerfilRequest request) {
        Usuario usuario = principal.getUsuario();
        return usuarioService.actualizarPerfil(usuario.getId(), request);
    }
}
