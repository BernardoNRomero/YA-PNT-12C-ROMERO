package com.turnoya.backend.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Datos que envia el cliente autenticado para solicitar un turno en una tienda.
 */
public class TurnoRequest {

    @NotNull(message = "La tienda es obligatoria.")
    private Long tiendaId;

    @NotNull(message = "La fecha es obligatoria.")
    @FutureOrPresent(message = "La fecha no puede ser anterior a hoy.")
    private LocalDate fecha;

    @NotNull(message = "El horario es obligatorio.")
    private LocalTime horario;

    @NotBlank(message = "El servicio es obligatorio.")
    private String servicio;

    public Long getTiendaId() {
        return tiendaId;
    }

    public void setTiendaId(Long tiendaId) {
        this.tiendaId = tiendaId;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHorario() {
        return horario;
    }

    public void setHorario(LocalTime horario) {
        this.horario = horario;
    }

    public String getServicio() {
        return servicio;
    }

    public void setServicio(String servicio) {
        this.servicio = servicio;
    }
}
