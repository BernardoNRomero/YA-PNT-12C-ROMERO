package com.turnoya.backend.tienda;

import jakarta.validation.constraints.NotBlank;

public class TiendaRequest {

    @NotBlank(message = "El nombre de la tienda es obligatorio.")
    private String nombre;

    private String descripcion;
    private String direccion;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }
}