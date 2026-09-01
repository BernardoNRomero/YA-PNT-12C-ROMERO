package com.turnoya.backend.exception;

/**
 * Error de negocio (ej: horario ocupado, turno inexistente) que se traduce a un 4xx en la API.
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}
