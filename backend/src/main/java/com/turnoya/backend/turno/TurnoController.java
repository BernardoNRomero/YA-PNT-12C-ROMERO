package com.turnoya.backend.turno;

import com.turnoya.backend.security.UserPrincipal;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/turnos")
public class TurnoController {

    private final TurnoService turnoService;

    public TurnoController(TurnoService turnoService) {
        this.turnoService = turnoService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CLIENTE')")
    public TurnoResponse pedirTurno(@AuthenticationPrincipal UserPrincipal principal,
                                    @Valid @RequestBody TurnoRequest request) {
        return turnoService.crear(principal.getUsuario().getId(), request);
    }

    @GetMapping("/mios")
    @PreAuthorize("hasRole('CLIENTE')")
    public List<TurnoResponse> misTurnos(@AuthenticationPrincipal UserPrincipal principal) {
        return turnoService.listarPorCliente(principal.getUsuario().getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('CLIENTE')")
    public void cancelarTurno(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        turnoService.cancelarComoCliente(principal.getUsuario().getId(), id);
    }

    @GetMapping("/tienda")
    @PreAuthorize("hasRole('ADMIN')")
    public List<TurnoResponse> turnosDeMiTienda(@AuthenticationPrincipal UserPrincipal principal,
                                                 @RequestParam(required = false) EstadoTurno estado) {
        return turnoService.listarPorTienda(principal.getUsuario().getId(), estado);
    }

    @GetMapping("/tienda/resumen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResumenResponse resumenDeMiTienda(@AuthenticationPrincipal UserPrincipal principal) {
        return turnoService.resumenPorTienda(principal.getUsuario().getId());
    }

    @PutMapping("/{id}/estado")
    @PreAuthorize("hasRole('ADMIN')")
    public TurnoResponse cambiarEstado(@AuthenticationPrincipal UserPrincipal principal,
                                        @PathVariable Long id,
                                        @Valid @RequestBody CambiarEstadoTurnoRequest request) {
        return turnoService.cambiarEstadoComoAdmin(principal.getUsuario().getId(), id, request);
    }
}