package com.turnoya.backend.config;

import com.turnoya.backend.model.Rol;
import com.turnoya.backend.model.Usuario;
import com.turnoya.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Crea el usuario SUPER_ADMIN inicial si todavia no existe (no se puede registrar por la API publica). */
@Configuration
public class SuperAdminBootstrap {

    @Bean
    CommandLineRunner crearSuperAdminInicial(UsuarioRepository usuarioRepository,
                                              PasswordEncoder passwordEncoder,
                                              @Value("${superadmin.username}") String username,
                                              @Value("${superadmin.password}") String password,
                                              @Value("${superadmin.correo}") String correo) {
        return args -> {
            if (usuarioRepository.existsByNombreUsuarioIgnoreCase(username)) {
                return;
            }
            Usuario superAdmin = new Usuario();
            superAdmin.setNombreUsuario(username);
            superAdmin.setCorreo(correo);
            superAdmin.setNombreCompleto("Super Administrador");
            superAdmin.setPasswordHash(passwordEncoder.encode(password));
            superAdmin.setRol(Rol.SUPER_ADMIN);
            usuarioRepository.save(superAdmin);
        };
    }
}
