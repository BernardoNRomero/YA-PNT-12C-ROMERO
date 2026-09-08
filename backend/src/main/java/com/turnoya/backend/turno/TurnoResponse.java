package com.turnoya.backend.turno;

import java.time.LocalDate;
import java.time.LocalTime;

public record TurnoResponse(
        Long id,
        Long tiendaId,
        String tiendaNombre,
        Long clienteId,
        String clienteNombre,
        LocalDate fecha,
        LocalTime horario,
        String servicio,
        EstadoTurno estado
) {
    public static TurnoResponse from(Turno turno) {
        return new TurnoResponse(
                turno.getId(),
                turno.getTienda().getId(),
                turno.getTienda().getNombre(),
                turno.getCliente().getId(),
                turno.getCliente().getNombreCompleto(),
                turno.getFecha(),
                turno.getHorario(),
                turno.getServicio(),
                turno.getEstado()
        );
    }
}