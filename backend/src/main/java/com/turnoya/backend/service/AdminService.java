package com.turnoya.backend.service;

import com.turnoya.backend.dto.EstadisticasResponse;
import com.turnoya.backend.dto.UsuarioAdminRequest;
import com.turnoya.backend.dto.UsuarioAdminResponse;
import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.model.EstadoTurno;
import com.turnoya.backend.model.Rol;
import com.turnoya.backend.model.Tienda;
import com.turnoya.backend.model.Usuario;
import com.turnoya.backend.repository.TiendaRepository;
import com.turnoya.backend.repository.TurnoRepository;
import com.turnoya.backend.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** Operaciones exclusivas del SUPER_ADMIN: estadisticas globales y gestion de usuarios. */
@Service
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final TiendaRepository tiendaRepository;
    private final TurnoRepository turnoRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(UsuarioRepository usuarioRepository, TiendaRepository tiendaRepository,
                         TurnoRepository turnoRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tiendaRepository = tiendaRepository;
        this.turnoRepository = turnoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public EstadisticasResponse estadisticas() {
        long admins = usuarioRepository.findByRol(Rol.ADMIN).size();
        long clientes = usuarioRepository.findByRol(Rol.CLIENTE).size();
        long totalUsuarios = usuarioRepository.count();
        long totalTiendas = tiendaRepository.count();
        long pendientes = turnoRepository.countByEstado(EstadoTurno.PENDIENTE);
        long aceptados = turnoRepository.countByEstado(EstadoTurno.ACEPTADO);
        long realizados = turnoRepository.countByEstado(EstadoTurno.REALIZADO);
        long rechazados = turnoRepository.countByEstado(EstadoTurno.RECHAZADO);
        long cancelados = turnoRepository.countByEstado(EstadoTurno.CANCELADO);
        long totalTurnos = pendientes + aceptados + realizados + rechazados + cancelados;
        return new EstadisticasResponse(totalUsuarios, admins, clientes, totalTiendas, totalTurnos,
                pendientes, aceptados, realizados, rechazados, cancelados);
    }

    @Transactional(readOnly = true)
    public List<UsuarioAdminResponse> listarUsuarios() {
        return usuarioRepository.findAll().stream().map(UsuarioAdminResponse::from).toList();
    }

    @Transactional
    public UsuarioAdminResponse crearUsuario(UsuarioAdminRequest request) {
        if (usuarioRepository.existsByNombreUsuarioIgnoreCase(request.getNombreUsuario())) {
            throw new BusinessException("Ese nombre de usuario ya esta en uso.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new BusinessException("La contraseña debe tener al menos 8 caracteres.");
        }
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setCorreo(request.getCorreo());
        usuario.setNombreCompleto(request.getNombreCompleto());
        usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.valueOf(request.getRol()));
        usuario.setActivo(request.getActivo() == null || request.getActivo());
        usuario = usuarioRepository.save(usuario);

        if (usuario.getRol() == Rol.ADMIN) {
            Tienda tienda = new Tienda();
            tienda.setNombre("Tienda de " + usuario.getNombreCompleto());
            tienda.setAdmin(usuario);
            tiendaRepository.save(tienda);
        }

        return UsuarioAdminResponse.from(usuario);
    }

    @Transactional
    public UsuarioAdminResponse actualizarUsuario(Long id, UsuarioAdminRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado."));
        if (request.getNombreCompleto() != null) {
            usuario.setNombreCompleto(request.getNombreCompleto());
        }
        if (request.getCorreo() != null) {
            usuario.setCorreo(request.getCorreo());
        }
        if (request.getRol() != null) {
            Rol nuevoRol = Rol.valueOf(request.getRol());
            usuario.setRol(nuevoRol);
            if (nuevoRol == Rol.ADMIN && tiendaRepository.findByAdminId(usuario.getId()).isEmpty()) {
                Tienda tienda = new Tienda();
                tienda.setNombre("Tienda de " + usuario.getNombreCompleto());
                tienda.setAdmin(usuario);
                tiendaRepository.save(tienda);
            }
        }
        if (request.getActivo() != null) {
            usuario.setActivo(request.getActivo());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            if (request.getPassword().length() < 8) {
                throw new BusinessException("La contraseña debe tener al menos 8 caracteres.");
            }
            usuario.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        return UsuarioAdminResponse.from(usuarioRepository.save(usuario));
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new BusinessException("Usuario no encontrado.");
        }
        usuarioRepository.deleteById(id);
    }
}
