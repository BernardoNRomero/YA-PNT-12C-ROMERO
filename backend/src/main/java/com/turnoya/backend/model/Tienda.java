package com.turnoya.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Perfil de tienda/negocio creado por un usuario ADMIN. Los clientes ven las
 * tiendas activas para poder solicitar turnos.
 */
@Entity
@Table(name = "tiendas")
@Getter
@Setter
@NoArgsConstructor
public class Tienda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String descripcion;

    private String direccion;

    @Column(nullable = false)
    private boolean activa = true;

    @OneToOne(optional = false)
    @JoinColumn(name = "id_admin", nullable = false, unique = true)
    private Usuario admin;
}
