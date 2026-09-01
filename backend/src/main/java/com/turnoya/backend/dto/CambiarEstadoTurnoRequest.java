package com.turnoya.backend.dto;

import com.turnoya.backend.model.EstadoTurno;
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
