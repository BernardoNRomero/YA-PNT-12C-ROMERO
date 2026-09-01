package com.turnoya.backend.controller;

import com.turnoya.backend.dto.TiendaRequest;
import com.turnoya.backend.dto.TiendaResponse;
import com.turnoya.backend.security.UserPrincipal;
import com.turnoya.backend.service.TiendaService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tiendas")
public class TiendaController {

    private final TiendaService tiendaService;

    public TiendaController(TiendaService tiendaService) {
        this.tiendaService = tiendaService;
    }

    // Publico: los clientes ven las tiendas disponibles para pedir turno.
    @GetMapping
    public List<TiendaResponse> listarActivas() {
        return tiendaService.listarActivas();
    }

    // El ADMIN consulta/edita el perfil de su propia tienda.
    @GetMapping("/mia")
    @PreAuthorize("hasRole('ADMIN')")
    public TiendaResponse miTienda(@AuthenticationPrincipal UserPrincipal principal) {
        return tiendaService.obtenerPorAdmin(principal.getUsuario().getId());
    }

    @PutMapping("/mia")
    @PreAuthorize("hasRole('ADMIN')")
    public TiendaResponse actualizarMiTienda(@AuthenticationPrincipal UserPrincipal principal,
                                              @Valid @RequestBody TiendaRequest request) {
        return tiendaService.actualizarPropia(principal.getUsuario().getId(), request);
    }
}
