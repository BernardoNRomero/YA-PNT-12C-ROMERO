package com.turnoya.backend.usuario;

import com.turnoya.backend.exception.BusinessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UsuarioPerfilResponse actualizarPerfil(Long usuarioId, ActualizarPerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado."));

        if (request.getNombreCompleto() != null && !request.getNombreCompleto().isBlank()) {
            usuario.setNombreCompleto(request.getNombreCompleto());
        }
        if (request.getImagenPerfil() != null) {
            usuario.setImagenPerfil(request.getImagenPerfil());
        }
        if (request.getPasswordNueva() != null && !request.getPasswordNueva().isBlank()) {
            if (request.getPasswordActual() == null || !passwordEncoder.matches(request.getPasswordActual(), usuario.getPasswordHash())) {
                throw new BusinessException("La contraseña actual no es correcta.");
            }
            if (request.getPasswordNueva().length() < 8) {
                throw new BusinessException("La nueva contraseña debe tener al menos 8 caracteres.");
            }
            usuario.setPasswordHash(passwordEncoder.encode(request.getPasswordNueva()));
        }

        return UsuarioPerfilResponse.from(usuarioRepository.save(usuario));
    }
}