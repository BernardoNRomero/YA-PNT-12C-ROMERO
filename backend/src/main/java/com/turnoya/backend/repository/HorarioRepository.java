package com.turnoya.backend.repository;

import com.turnoya.backend.model.Horario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HorarioRepository extends JpaRepository<Horario, Long> {
    List<Horario> findByTiendaIdOrderByDiaSemanaAscHoraInicioAsc(Long tiendaId);
}
