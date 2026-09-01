package com.turnoya.backend.service;

import com.turnoya.backend.dto.HorarioRequest;
import com.turnoya.backend.dto.HorarioResponse;
import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.model.Horario;
import com.turnoya.backend.model.Tienda;
import com.turnoya.backend.repository.HorarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HorarioService {

    private final HorarioRepository horarioRepository;
    private final TiendaService tiendaService;

    public HorarioService(HorarioRepository horarioRepository, TiendaService tiendaService) {
        this.horarioRepository = horarioRepository;
        this.tiendaService = tiendaService;
    }

    @Transactional(readOnly = true)
    public List<HorarioResponse> listarPorTienda(Long tiendaId) {
        return horarioRepository.findByTiendaIdOrderByDiaSemanaAscHoraInicioAsc(tiendaId).stream()
                .map(HorarioResponse::from).toList();
    }

    // Solo el ADMIN dueño de la tienda puede fijar sus horarios de atencion.
    @Transactional
    public HorarioResponse crear(Long adminId, HorarioRequest request) {
        if (!request.getHoraInicio().isBefore(request.getHoraFin())) {
            throw new BusinessException("La hora de inicio debe ser anterior a la hora de fin.");
        }
        Tienda tienda = tiendaService.buscarPorAdmin(adminId);
        Horario horario = new Horario();
        horario.setTienda(tienda);
        horario.setDiaSemana(request.getDiaSemana());
        horario.setHoraInicio(request.getHoraInicio());
        horario.setHoraFin(request.getHoraFin());
        return HorarioResponse.from(horarioRepository.save(horario));
    }

    @Transactional
    public void eliminar(Long adminId, Long horarioId) {
        Tienda tienda = tiendaService.buscarPorAdmin(adminId);
        Horario horario = horarioRepository.findById(horarioId)
                .orElseThrow(() -> new BusinessException("El horario no existe."));
        if (!horario.getTienda().getId().equals(tienda.getId())) {
            throw new BusinessException("El horario no pertenece a tu tienda.");
        }
        horarioRepository.delete(horario);
    }
}
