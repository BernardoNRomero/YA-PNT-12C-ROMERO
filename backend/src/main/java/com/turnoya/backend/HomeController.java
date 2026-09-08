package com.turnoya.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "aplicacion", "Turno Ya - API",
                "endpoints", Map.of(
                        "registro", "POST /api/auth/register",
                        "login", "POST /api/auth/login",
                        "tiendas", "GET /api/tiendas",
                        "turnos", "POST /api/turnos, GET /api/turnos/mios"
                )
        );
    }
}