package com.turnoya.backend.service;

import com.turnoya.backend.dto.TiendaRequest;
import com.turnoya.backend.dto.TiendaResponse;
import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.model.Rol;
import com.turnoya.backend.model.Tienda;
import com.turnoya.backend.model.Usuario;
import com.turnoya.backend.repository.TiendaRepository;
import com.turnoya.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TiendaService {

    private final TiendaRepository tiendaRepository;
    private final UsuarioRepository usuarioRepository;

    public TiendaService(TiendaRepository tiendaRepository, UsuarioRepository usuarioRepository) {
        this.tiendaRepository = tiendaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<TiendaResponse> listarActivas() {
        return tiendaRepository.findByActivaTrue().stream().map(TiendaResponse::from).toList();
    }

    @Transactional
    public TiendaResponse obtenerPorAdmin(Long adminId) {
        return TiendaResponse.from(buscarPorAdmin(adminId));
    }

    @Transactional
    public TiendaResponse actualizarPropia(Long adminId, TiendaRequest request) {
        Tienda tienda = buscarPorAdmin(adminId);
        tienda.setNombre(request.getNombre());
        tienda.setDescripcion(request.getDescripcion());
        tienda.setDireccion(request.getDireccion());
        return TiendaResponse.from(tiendaRepository.save(tienda));
    }

    @Transactional
    public Tienda buscarPorAdmin(Long adminId) {
        return tiendaRepository.findByAdminId(adminId).orElseGet(() -> {
            Usuario admin = usuarioRepository.findById(adminId)
                    .orElseThrow(() -> new BusinessException("Usuario administrador no encontrado."));
            if (admin.getRol() != Rol.ADMIN && admin.getRol() != Rol.SUPER_ADMIN) {
                throw new BusinessException("El usuario no es un administrador.");
            }
            Tienda nueva = new Tienda();
            nueva.setNombre("Tienda de " + admin.getNombreCompleto());
            nueva.setAdmin(admin);
            return tiendaRepository.save(nueva);
        });
    }

    Tienda buscarTiendaActivaPorId(Long tiendaId) {
        Tienda tienda = tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new BusinessException("La tienda solicitada no existe."));
        if (!tienda.isActiva()) {
            throw new BusinessException("La tienda solicitada no esta disponible.");
        }
        return tienda;
    }
}
