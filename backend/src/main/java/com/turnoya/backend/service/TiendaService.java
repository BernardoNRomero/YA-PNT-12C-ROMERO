package com.turnoya.backend.service;

import com.turnoya.backend.dto.TiendaRequest;
import com.turnoya.backend.dto.TiendaResponse;
import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.model.Tienda;
import com.turnoya.backend.repository.TiendaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TiendaService {

    private final TiendaRepository tiendaRepository;

    public TiendaService(TiendaRepository tiendaRepository) {
        this.tiendaRepository = tiendaRepository;
    }

    @Transactional(readOnly = true)
    public List<TiendaResponse> listarActivas() {
        return tiendaRepository.findByActivaTrue().stream().map(TiendaResponse::from).toList();
    }

    @Transactional(readOnly = true)
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

    Tienda buscarPorAdmin(Long adminId) {
        return tiendaRepository.findByAdminId(adminId)
                .orElseThrow(() -> new BusinessException("No se encontro una tienda para este administrador."));
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
