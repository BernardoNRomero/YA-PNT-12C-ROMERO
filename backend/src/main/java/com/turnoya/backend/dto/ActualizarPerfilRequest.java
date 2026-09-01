package com.turnoya.backend.dto;

/**
 * Actualizacion de perfil propio: nombre, imagen (URL o data URI base64) y, opcionalmente,
 * cambio de contraseña (requiere la actual).
 */
public class ActualizarPerfilRequest {

    private String nombreCompleto;
    private String imagenPerfil;
    private String passwordActual;
    private String passwordNueva;

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getImagenPerfil() {
        return imagenPerfil;
    }

    public void setImagenPerfil(String imagenPerfil) {
        this.imagenPerfil = imagenPerfil;
    }

    public String getPasswordActual() {
        return passwordActual;
    }

    public void setPasswordActual(String passwordActual) {
        this.passwordActual = passwordActual;
    }

    public String getPasswordNueva() {
        return passwordNueva;
    }

    public void setPasswordNueva(String passwordNueva) {
        this.passwordNueva = passwordNueva;
    }
}
