package com.turnoya.backend.repository;

import com.turnoya.backend.model.Tienda;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TiendaRepository extends JpaRepository<Tienda, Long> {
    List<Tienda> findByActivaTrue();
    Optional<Tienda> findByAdminId(Long adminId);
}