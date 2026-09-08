package com.turnoya.backend.turno;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TurnoRepository extends JpaRepository<Turno, Long> {
    List<Turno> findByClienteIdOrderByFechaDescHorarioDesc(Long clienteId);
    List<Turno> findByTiendaIdOrderByFechaAscHorarioAsc(Long tiendaId);
    List<Turno> findByTiendaIdAndEstadoOrderByFechaAscHorarioAsc(Long tiendaId, EstadoTurno estado);
    long countByTiendaIdAndEstado(Long tiendaId, EstadoTurno estado);
    long countByEstado(EstadoTurno estado);
    Optional<Turno> findFirstByTiendaIdAndFechaAndHorarioAndEstadoIn(
            Long tiendaId, LocalDate fecha, LocalTime horario, Collection<EstadoTurno> estados);
}