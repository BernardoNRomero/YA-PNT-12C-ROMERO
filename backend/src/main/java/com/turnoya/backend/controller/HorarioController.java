package com.turnoya.backend.controller;

import com.turnoya.backend.dto.HorarioRequest;
import com.turnoya.backend.dto.HorarioResponse;
import com.turnoya.backend.security.UserPrincipal;
import com.turnoya.backend.service.HorarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class HorarioController {

    private final HorarioService horarioService;

    public HorarioController(HorarioService horarioService) {
        this.horarioService = horarioService;
    }

    // Publico: los clientes consultan los horarios de atencion de una tienda antes de pedir turno.
    @GetMapping("/api/tiendas/{tiendaId}/horarios")
    public List<HorarioResponse> listarPorTienda(@PathVariable Long tiendaId) {
        return horarioService.listarPorTienda(tiendaId);
    }

    // El ADMIN fija los horarios de atencion de su propia tienda.
    @PostMapping("/api/horarios")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public HorarioResponse crear(@AuthenticationPrincipal UserPrincipal principal, @Valid @RequestBody HorarioRequest request) {
        return horarioService.crear(principal.getUsuario().getId(), request);
    }

    @DeleteMapping("/api/horarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@AuthenticationPrincipal UserPrincipal principal, @PathVariable Long id) {
        horarioService.eliminar(principal.getUsuario().getId(), id);
    }
}
