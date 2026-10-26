package com.turnoya.backend.tienda;

import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.usuario.UsuarioRepository;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

class TiendaServiceTest {

    private final TiendaService service =
            new TiendaService(mock(TiendaRepository.class), mock(UsuarioRepository.class));

    @Test
    void aceptaUnaImagenBase64Valida() {
        String imagen = "data:image/png;base64,iVBORw0KGgo=";
        assertEquals(imagen, service.normalizarImagen(imagen));
    }

    @Test
    void unaCadenaVaciaQuitaLaFoto() {
        assertNull(service.normalizarImagen(""));
    }

    @Test
    void rechazaContenidoQueNoEsUnaImagenPermitida() {
        assertThrows(BusinessException.class, () -> service.normalizarImagen("http://ejemplo.com/foto.png"));
        assertThrows(BusinessException.class, () -> service.normalizarImagen("data:image/svg+xml;base64,PHN2Zz4="));
    }

    @Test
    void rechazaImagenesDemasiadoGrandes() {
        String grande = "data:image/png;base64," + "A".repeat(3_000_001);
        assertThrows(BusinessException.class, () -> service.normalizarImagen(grande));
    }
}
