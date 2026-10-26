package com.turnoya.backend.tienda;

import com.turnoya.backend.exception.BusinessException;
import com.turnoya.backend.usuario.Rol;
import com.turnoya.backend.usuario.Usuario;
import com.turnoya.backend.usuario.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TiendaService {

    private static final int MAX_IMAGEN_CHARS = 3_000_000;
    private static final java.util.regex.Pattern PREFIJO_IMAGEN =
            java.util.regex.Pattern.compile("^data:image/(png|jpeg|jpg|gif|webp);base64,");

    private final TiendaRepository tiendaRepository;
    private final UsuarioRepository usuarioRepository;

    public TiendaService(TiendaRepository tiendaRepository, UsuarioRepository usuarioRepository) {
        this.tiendaRepository = tiendaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<TiendaResponse> listarActivas() {
        return tiendaRepository.findByActivaTrue().stream().map(TiendaResponse::from).toList();
    }

    @Transactional
    public TiendaResponse obtenerPorAdmin(Long adminId) {
        return TiendaResponse.from(buscarPorAdmin(adminId));
    }

    @Transactional
    public TiendaResponse actualizarPropia(Long adminId, TiendaRequest request) {
        Tienda tienda = buscarPorAdmin(adminId);
        tienda.setNombre(request.getNombre());
        tienda.setDescripcion(request.getDescripcion());
        tienda.setDireccion(request.getDireccion());
        if (request.getImagenTienda() != null) {
            tienda.setImagenTienda(normalizarImagen(request.getImagenTienda()));
        }
        return TiendaResponse.from(tiendaRepository.save(tienda));
    }

    // Cadena vacia = quitar la foto; si no, debe ser una imagen base64 permitida y acotada.
    String normalizarImagen(String imagen) {
        if (imagen.isBlank()) {
            return null;
        }
        if (imagen.length() > MAX_IMAGEN_CHARS) {
            throw new BusinessException("La imagen de la tienda no debe superar los 2 MB.");
        }
        if (!PREFIJO_IMAGEN.matcher(imagen).find()) {
            throw new BusinessException("La imagen de la tienda debe ser PNG, JPG, GIF o WEBP.");
        }
        return imagen;
    }

    @Transactional
    public Tienda buscarPorAdmin(Long adminId) {
        return tiendaRepository.findByAdminId(adminId).orElseGet(() -> {
            Usuario admin = usuarioRepository.findById(adminId)
                    .orElseThrow(() -> new BusinessException("Usuario administrador no encontrado."));
            if (admin.getRol() != Rol.ADMIN && admin.getRol() != Rol.SUPER_ADMIN) {
                throw new BusinessException("El usuario no es un administrador.");
            }
            Tienda nueva = new Tienda();
            nueva.setNombre("Tienda de " + admin.getNombreCompleto());
            nueva.setAdmin(admin);
            return tiendaRepository.save(nueva);
        });
    }

    public Tienda buscarTiendaActivaPorId(Long tiendaId) {
        Tienda tienda = tiendaRepository.findById(tiendaId)
                .orElseThrow(() -> new BusinessException("La tienda solicitada no existe."));
        if (!tienda.isActiva()) {
            throw new BusinessException("La tienda solicitada no esta disponible.");
        }
        return tienda;
    }
}