package com.turnoya.backend.controller;

import com.turnoya.backend.dto.CambiarEstadoTurnoRequest;
import com.turnoya.backend.dto.ResumenResponse;
import com.turnoya.backend.dto.TurnoRequest;
import com.turnoya.backend.dto.TurnoResponse;
import com.turnoya.backend.model.EstadoTurno;
import com.turnoya.backend.security.UserPrincipal;
import com.turnoya.backend.service.TurnoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TurnoController {

    private final TurnoService turnoService;

    public TurnoController(TurnoService turnoService) {
        this.turnoService = turnoService;
    }

    // El cliente solicita un turno en una tienda.
    @PostMapping("/api/turnos")
    @PreAuthorize("hasRole('CLIENTE')")
    @ResponseStatus(HttpStatus.CREATED)
    public TurnoResponse crear(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody TurnoRequest request) {
        return turnoService.crear(principal.getUsuario().getId(), request);
    }

    // El cliente ve sus propios turnos.
    @GetMapping("/api/turnos/mios")
    @PreAuthorize("hasRole('CLIENTE')")
    public List<TurnoResponse> misTurnos(@AuthenticationPrincipal UserPrincipal principal) {
        return turnoService.listarPorCliente(principal.getUsuario().getId());
    }

    // El cliente cancela un turno propio.
    @DeleteMapping("/api/turnos/{id}")
    @PreAuthorize("hasRole('CLIENTE')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelar(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        turnoService.cancelarComoCliente(principal.getUsuario().getId(), id);
    }

    // El admin ve la agenda de su tienda, opcionalmente filtrada por estado.
    @GetMapping("/api/turnos/tienda")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TurnoResponse> agendaDeMiTienda(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) EstadoTurno estado) {
        return turnoService.listarPorTienda(principal.getUsuario().getId(), estado);
    }

    // El admin trabaja el turno: lo acepta, rechaza o marca como realizado.
    @PutMapping("/api/turnos/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public TurnoResponse cambiarEstado(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id,
                                        @Valid @RequestBody CambiarEstadoTurnoRequest request) {
        return turnoService.cambiarEstadoComoAdmin(principal.getUsuario().getId(), id, request);
    }

    // Indicadores de la agenda de la tienda del admin autenticado.
    @GetMapping("/api/turnos/tienda/resumen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResumenResponse resumen(@AuthenticationPrincipal UserPrincipal principal) {
        return turnoService.resumenPorTienda(principal.getUsuario().getId());
    }
}
