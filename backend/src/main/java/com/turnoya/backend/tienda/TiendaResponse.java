package com.turnoya.backend.tienda;

public record TiendaResponse(Long id, String nombre, String descripcion, String direccion, String imagenTienda, boolean activa) {
    public static TiendaResponse from(Tienda tienda) {
        return new TiendaResponse(tienda.getId(), tienda.getNombre(), tienda.getDescripcion(), tienda.getDireccion(),
                tienda.getImagenTienda(), tienda.isActiva());
    }
}