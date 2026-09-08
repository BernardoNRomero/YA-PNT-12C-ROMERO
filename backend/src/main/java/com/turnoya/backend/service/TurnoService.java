package com.turnoya.backend.service;

import com.turnoya.backend.dto.CambiarEstadoTurnoRequest;
import com.turnoya.backend.dto.ResumenResponse;
import com.turnoya.backend.dto.TurnoRequest;
import com.turnoya.backend.dto.TurnoResponse;
import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.model.DiaSemana;
import com.turnoya.backend.model.EstadoTurno;
import com.turnoya.backend.model.Horario;
import com.turnoya.backend.model.Tienda;
import com.turnoya.backend.model.Turno;
import com.turnoya.backend.model.Usuario;
import com.turnoya.backend.repository.HorarioRepository;
import com.turnoya.backend.repository.TurnoRepository;
import com.turnoya.backend.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HorarioRepository horarioRepository;
    private final TiendaService tiendaService;

    public TurnoService(TurnoRepository turnoRepository, UsuarioRepository usuarioRepository,
                        HorarioRepository horarioRepository, TiendaService tiendaService) {
        this.turnoRepository = turnoRepository;
        this.usuarioRepository = usuarioRepository;
        this.horarioRepository = horarioRepository;
        this.tiendaService = tiendaService;
    }

    // El cliente solicita un turno en una tienda; queda PENDIENTE hasta que el admin lo trabaje.
    @Transactional
    public TurnoResponse crear(Long clienteId, TurnoRequest request) {
        if (request.getFecha() == null) {
            throw new BusinessException("La fecha es requerida.");
        }
        if (request.getHorario() == null) {
            throw new BusinessException("El horario es requerido.");
        }
        if (request.getFecha().isBefore(LocalDate.now())) {
            throw new BusinessException("No se puede solicitar un turno para una fecha pasada.");
        }

        Tienda tienda = tiendaService.buscarTiendaActivaPorId(request.getTiendaId());

        DiaSemana diaSemana = mapDayOfWeek(request.getFecha().getDayOfWeek());
        List<Horario> horariosEnDia = horarioRepository.findByTiendaIdAndDiaSemana(tienda.getId(), diaSemana);
        if (horariosEnDia.isEmpty()) {
            throw new BusinessException("La tienda no se encuentra disponible en la fecha seleccionada (" + diaSemana.name() + ").");
        }
        boolean horarioValido = horariosEnDia.stream().anyMatch(h ->
                !request.getHorario().isBefore(h.getHoraInicio()) && !request.getHorario().isAfter(h.getHoraFin())
        );
        if (!horarioValido) {
            throw new BusinessException("La tienda no se encuentra disponible en el horario seleccionado.");
        }

        boolean horarioOcupado = turnoRepository
                .findFirstByTiendaIdAndFechaAndHorarioAndEstadoIn(
                        request.getTiendaId(), request.getFecha(), request.getHorario(),
                        List.of(EstadoTurno.PENDIENTE, EstadoTurno.ACEPTADO))
                .isPresent();
        if (horarioOcupado) {
            throw new BusinessException("Ese horario ya esta reservado en esa tienda. Elegi otro.");
        }

        Usuario cliente = usuarioRepository.findById(clienteId)
                .orElseThrow(() -> new BusinessException("Usuario no encontrado."));

        Turno turno = new Turno();
        turno.setFecha(request.getFecha());
        turno.setHorario(request.getHorario());
        turno.setServicio(request.getServicio());
        turno.setEstado(EstadoTurno.PENDIENTE);
        turno.setCliente(cliente);
        turno.setTienda(tienda);
        return TurnoResponse.from(turnoRepository.save(turno));
    }

    private DiaSemana mapDayOfWeek(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> DiaSemana.LUNES;
            case TUESDAY -> DiaSemana.MARTES;
            case WEDNESDAY -> DiaSemana.MIERCOLES;
            case THURSDAY -> DiaSemana.JUEVES;
            case FRIDAY -> DiaSemana.VIERNES;
            case SATURDAY -> DiaSemana.SABADO;
            case SUNDAY -> DiaSemana.DOMINGO;
        };
    }

    @Transactional(readOnly = true)
    public List<TurnoResponse> listarPorCliente(Long clienteId) {
        return turnoRepository.findByClienteIdOrderByFechaDescHorarioDesc(clienteId).stream()
                .map(TurnoResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<TurnoResponse> listarPorTienda(Long adminId, EstadoTurno estado) {
        Tienda tienda = tiendaService.buscarPorAdmin(adminId);
        List<Turno> turnos = estado == null
                ? turnoRepository.findByTiendaIdOrderByFechaAscHorarioAsc(tienda.getId())
                : turnoRepository.findByTiendaIdAndEstadoOrderByFechaAscHorarioAsc(tienda.getId(), estado);
        return turnos.stream().map(TurnoResponse::from).toList();
    }

    // El cliente cancela su propio turno (si todavia no fue realizado).
    @Transactional
    public void cancelarComoCliente(Long clienteId, Long turnoId) {
        Turno turno = buscarTurno(turnoId);
        if (!turno.getCliente().getId().equals(clienteId)) {
            throw new BusinessException("Este turno no te pertenece.");
        }
        if (turno.getEstado() == EstadoTurno.REALIZADO) {
            throw new BusinessException("No se puede cancelar un turno ya realizado.");
        }
        turno.setEstado(EstadoTurno.CANCELADO);
        turnoRepository.save(turno);
    }

    // El admin de la tienda acepta/rechaza/marca como realizado un turno de su agenda.
    @Transactional
    public TurnoResponse cambiarEstadoComoAdmin(Long adminId, Long turnoId, CambiarEstadoTurnoRequest request) {
        Tienda tienda = tiendaService.buscarPorAdmin(adminId);
        Turno turno = buscarTurno(turnoId);
        if (!turno.getTienda().getId().equals(tienda.getId())) {
            throw new BusinessException("Este turno no pertenece a tu tienda.");
        }
        validarTransicion(turno.getEstado(), request.getEstado());
        turno.setEstado(request.getEstado());
        return TurnoResponse.from(turnoRepository.save(turno));
    }

    private void validarTransicion(EstadoTurno actual, EstadoTurno nuevo) {
        boolean valido = switch (actual) {
            case PENDIENTE -> nuevo == EstadoTurno.ACEPTADO || nuevo == EstadoTurno.RECHAZADO;
            case ACEPTADO -> nuevo == EstadoTurno.REALIZADO || nuevo == EstadoTurno.CANCELADO;
            default -> false;
        };
        if (!valido) {
            throw new BusinessException("No se puede pasar de " + actual + " a " + nuevo + ".");
        }
    }

    @Transactional(readOnly = true)
    public ResumenResponse resumenPorTienda(Long adminId) {
        Tienda tienda = tiendaService.buscarPorAdmin(adminId);
        long pendientes = turnoRepository.countByTiendaIdAndEstado(tienda.getId(), EstadoTurno.PENDIENTE);
        long aceptados = turnoRepository.countByTiendaIdAndEstado(tienda.getId(), EstadoTurno.ACEPTADO);
        long realizados = turnoRepository.countByTiendaIdAndEstado(tienda.getId(), EstadoTurno.REALIZADO);
        long rechazados = turnoRepository.countByTiendaIdAndEstado(tienda.getId(), EstadoTurno.RECHAZADO);
        long cancelados = turnoRepository.countByTiendaIdAndEstado(tienda.getId(), EstadoTurno.CANCELADO);
        long total = pendientes + aceptados + realizados + rechazados + cancelados;
        return new ResumenResponse(total, pendientes, aceptados, realizados, rechazados, cancelados);
    }

    private Turno buscarTurno(Long turnoId) {
        return turnoRepository.findById(turnoId)
                .orElseThrow(() -> new BusinessException("El turno solicitado no existe."));
    }
}
