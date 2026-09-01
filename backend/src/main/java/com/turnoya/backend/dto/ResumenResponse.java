package com.turnoya.backend.dto;

/**
 * Indicadores de agenda de una tienda: total, aceptados/pendientes/realizados.
 */
public record ResumenResponse(long total, long pendientes, long aceptados, long realizados, long rechazados, long cancelados) {
}
