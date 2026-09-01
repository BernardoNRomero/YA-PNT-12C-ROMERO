package com.turnoya.backend.dto;

import com.turnoya.backend.model.DiaSemana;
import com.turnoya.backend.model.Horario;

import java.time.LocalTime;

public record HorarioResponse(Long id, DiaSemana diaSemana, LocalTime horaInicio, LocalTime horaFin) {
    public static HorarioResponse from(Horario horario) {
        return new HorarioResponse(horario.getId(), horario.getDiaSemana(), horario.getHoraInicio(), horario.getHoraFin());
    }
}
