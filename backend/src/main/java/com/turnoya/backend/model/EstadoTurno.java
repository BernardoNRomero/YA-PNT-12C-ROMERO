package com.turnoya.backend.model;

/**
 * Estados posibles de un turno.
 * Flujo: PENDIENTE -> ACEPTADO -> REALIZADO, o PENDIENTE/ACEPTADO -> RECHAZADO/CANCELADO.
 */
public enum EstadoTurno {
    PENDIENTE,
    ACEPTADO,
    RECHAZADO,
    REALIZADO,
    CANCELADO
}
