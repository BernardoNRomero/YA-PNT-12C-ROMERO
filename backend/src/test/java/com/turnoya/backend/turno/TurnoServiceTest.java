package com.turnoya.backend.turno;

import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.tienda.HorarioRepository;
import com.turnoya.backend.tienda.TiendaService;
import com.turnoya.backend.usuario.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

class TurnoServiceTest {

    private static final ZoneId BUSINESS_ZONE = ZoneId.of("America/Argentina/Buenos_Aires");
    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-10-26T17:00:00Z"), BUSINESS_ZONE);

    private TurnoRepository turnoRepository;
    private UsuarioRepository usuarioRepository;
    private HorarioRepository horarioRepository;
    private TiendaService tiendaService;
    private TurnoService turnoService;

    @BeforeEach
    void setUp() {
        turnoRepository = mock(TurnoRepository.class);
        usuarioRepository = mock(UsuarioRepository.class);
        horarioRepository = mock(HorarioRepository.class);
        tiendaService = mock(TiendaService.class);
        turnoService = new TurnoService(turnoRepository, usuarioRepository, horarioRepository, tiendaService, FIXED_CLOCK);
    }

    @Test
    void rechazaUnTurnoEnUnaFechaPasada() {
        BusinessException exception = assertThrows(BusinessException.class,
                () -> turnoService.crear(1L, solicitud(LocalDate.of(2026, 10, 25), LocalTime.of(15, 0))));

        assertEquals("No se puede solicitar un turno para una fecha pasada.", exception.getMessage());
        verifyNoInteractions(turnoRepository, usuarioRepository, horarioRepository, tiendaService);
    }

    @Test
    void rechazaUnTurnoDeHoySiLaHoraYaPasoEnLaZonaHorariaDelNegocio() {
        BusinessException exception = assertThrows(BusinessException.class,
                () -> turnoService.crear(1L, solicitud(LocalDate.of(2026, 10, 26), LocalTime.of(13, 59))));

        assertEquals("No se puede solicitar un turno para un horario que ya paso.", exception.getMessage());
        verifyNoInteractions(turnoRepository, usuarioRepository, horarioRepository, tiendaService);
    }

    @Test
    void rechazaUnTurnoDeHoyEnLaHoraActual() {
        BusinessException exception = assertThrows(BusinessException.class,
                () -> turnoService.crear(1L, solicitud(LocalDate.of(2026, 10, 26), LocalTime.of(14, 0))));

        assertEquals("No se puede solicitar un turno para un horario que ya paso.", exception.getMessage());
        verifyNoInteractions(turnoRepository, usuarioRepository, horarioRepository, tiendaService);
    }

    private TurnoRequest solicitud(LocalDate fecha, LocalTime horario) {
        TurnoRequest request = new TurnoRequest();
        request.setTiendaId(1L);
        request.setFecha(fecha);
        request.setHorario(horario);
        request.setServicio("Consulta");
        return request;
    }
}
