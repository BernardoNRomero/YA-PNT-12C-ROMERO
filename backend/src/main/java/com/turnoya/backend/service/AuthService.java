package com.turnoya.backend.service;

import com.turnoya.backend.dto.AuthResponse;
import com.turnoya.backend.dto.LoginRequest;
import com.turnoya.backend.dto.RegisterRequest;
import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.model.Rol;
import com.turnoya.backend.model.Tienda;
import com.turnoya.backend.model.Usuario;
import com.turnoya.backend.repository.TiendaRepository;
import com.turnoya.backend.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.turnoya.backend.security.JwtService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final TiendaRepository tiendaRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository usuarioRepository, TiendaRepository tiendaRepository,
                        PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
                        JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.tiendaRepository = tiendaRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse registrar(RegisterRequest request) {
        if (usuarioRepository.existsByNombreUsuarioIgnoreCase(request.getNombreUsuario())) {
            throw new BusinessException("Ese nombre de usuario ya esta en uso.");
        }
        if (usuarioRepository.existsByCorreoIgnoreCase(request.getCorreo())) {
            throw new BusinessException("Ese correo ya esta registrado.");
        }

        Rol rol = request.getRolEnum();
        if (rol == Rol.ADMIN && (request.getNombreTienda() == null || request.getNombreTienda().isBlank())) {
            throw new BusinessException("El nombre de la tienda es obligatorio para cuentas de administrador.");
        }

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setCorreo(request.getCorreo());
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(rol);
        usuario = usuarioRepository.save(usuario);

        if (rol == Rol.ADMIN) {
            Tienda tienda = new Tienda();
            tienda.setNombre(request.getNombreTienda());
            tienda.setAdmin(usuario);
            tiendaRepository.save(tienda);
        }

        return new AuthResponse(jwtService.generarToken(usuario.getNombreUsuario(), rol.name()),
                usuario.getNombreUsuario(), usuario.getNombreCompleto(), rol.name());
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getNombreUsuario(), request.getPassword()));
        } catch (BadCredentialsException ex) {
            throw new BusinessException("Usuario o contraseña incorrectos.");
        }

        Usuario usuario = usuarioRepository.findByNombreUsuarioIgnoreCase(request.getNombreUsuario())
                .orElseThrow(() -> new BusinessException("Usuario o contraseña incorrectos."));

        return new AuthResponse(jwtService.generarToken(usuario.getNombreUsuario(), usuario.getRol().name()),
                usuario.getNombreUsuario(), usuario.getNombreCompleto(), usuario.getRol().name());
    }
}
