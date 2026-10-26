package com.turnoya.backend.turno;

import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.tienda.DiaSemana;
import com.turnoya.backend.tienda.Horario;
import com.turnoya.backend.tienda.HorarioRepository;
import com.turnoya.backend.tienda.Tienda;
import com.turnoya.backend.tienda.TiendaService;
import com.turnoya.backend.usuario.Usuario;
import com.turnoya.backend.usuario.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class TurnoService {

    private final TurnoRepository turnoRepository;
    private final UsuarioRepository usuarioRepository;
    private final HorarioRepository horarioRepository;
    private final TiendaService tiendaService;
    private final Clock clock;

    public TurnoService(TurnoRepository turnoRepository, UsuarioRepository usuarioRepository,
                        HorarioRepository horarioRepository, TiendaService tiendaService, Clock clock) {
        this.turnoRepository = turnoRepository;
        this.usuarioRepository = usuarioRepository;
        this.horarioRepository = horarioRepository;
        this.tiendaService = tiendaService;
        this.clock = clock;
    }

    @Transactional
    public TurnoResponse crear(Long clienteId, TurnoRequest request) {
        if (request.getFecha() == null) {
            throw new BusinessException("La fecha es requerida.");
        }
        if (request.getHorario() == null) {
            throw new BusinessException("El horario es requerido.");
        }
        ZonedDateTime ahora = ZonedDateTime.now(clock);
        LocalDate fechaActual = ahora.toLocalDate();
        if (request.getFecha().isBefore(fechaActual)) {
            throw new BusinessException("No se puede solicitar un turno para una fecha pasada.");
        }
        if (request.getFecha().isEqual(fechaActual) && !request.getHorario().isAfter(ahora.toLocalTime())) {
            throw new BusinessException("No se puede solicitar un turno para un horario que ya paso.");
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