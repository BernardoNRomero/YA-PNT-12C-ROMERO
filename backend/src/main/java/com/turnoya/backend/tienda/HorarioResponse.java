package com.turnoya.backend.tienda;

import java.time.LocalTime;

public record HorarioResponse(Long id, DiaSemana diaSemana, LocalTime horaInicio, LocalTime horaFin) {
    public static HorarioResponse from(Horario horario) {
        return new HorarioResponse(horario.getId(), horario.getDiaSemana(), horario.getHoraInicio(), horario.getHoraFin());
    }
}