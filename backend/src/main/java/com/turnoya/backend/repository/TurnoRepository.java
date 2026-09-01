package com.turnoya.backend.repository;

import com.turnoya.backend.model.EstadoTurno;
import com.turnoya.backend.model.Turno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TurnoRepository extends JpaRepository<Turno, Long> {

    List<Turno> findByClienteIdOrderByFechaDescHorarioDesc(Long clienteId);

    List<Turno> findByTiendaIdOrderByFechaAscHorarioAsc(Long tiendaId);

    List<Turno> findByTiendaIdAndEstadoOrderByFechaAscHorarioAsc(Long tiendaId, EstadoTurno estado);

    // Un horario ya ocupado (en un turno no rechazado/cancelado) no puede volver a reservarse en esa tienda.
    Optional<Turno> findFirstByTiendaIdAndFechaAndHorarioAndEstadoIn(Long tiendaId, LocalDate fecha, LocalTime horario, List<EstadoTurno> estados);

    long countByEstado(EstadoTurno estado);

    long countByTiendaIdAndEstado(Long tiendaId, EstadoTurno estado);
}
