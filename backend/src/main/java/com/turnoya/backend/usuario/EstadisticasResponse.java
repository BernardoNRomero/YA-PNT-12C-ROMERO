package com.turnoya.backend.usuario;

public record EstadisticasResponse(
        long totalUsuarios,
        long totalAdmins,
        long totalClientes,
        long totalTiendas,
        long totalTurnos,
        long turnosPendientes,
        long turnosAceptados,
        long turnosRealizados,
        long turnosRechazados,
        long turnosCancelados
) {
}