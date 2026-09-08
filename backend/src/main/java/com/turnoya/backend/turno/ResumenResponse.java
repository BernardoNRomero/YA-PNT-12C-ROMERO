package com.turnoya.backend.turno;

public record ResumenResponse(long total, long pendientes, long aceptados, long realizados, long rechazados, long cancelados) {
}