package com.turnoya.backend.turno;

import jakarta.validation.constraints.NotNull;

public class CambiarEstadoTurnoRequest {

    @NotNull(message = "El nuevo estado es obligatorio.")
    private EstadoTurno estado;

    public EstadoTurno getEstado() {
        return estado;
    }

    public void setEstado(EstadoTurno estado) {
        this.estado = estado;
    }
}