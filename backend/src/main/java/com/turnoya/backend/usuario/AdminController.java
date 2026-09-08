package com.turnoya.backend.usuario;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/estadisticas")
    public EstadisticasResponse estadisticas() {
        return adminService.estadisticas();
    }

    @GetMapping("/usuarios")
    public List<UsuarioAdminResponse> listarUsuarios() {
        return adminService.listarUsuarios();
    }

    @PostMapping("/usuarios")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioAdminResponse crearUsuario(@Valid @RequestBody UsuarioAdminRequest request) {
        return adminService.crearUsuario(request);
    }

    @PutMapping("/usuarios/{id}")
    public UsuarioAdminResponse actualizarUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioAdminRequest request) {
        return adminService.actualizarUsuario(id, request);
    }

    @DeleteMapping("/usuarios/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarUsuario(@PathVariable Long id) {
        adminService.eliminarUsuario(id);
    }
}