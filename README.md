# Turno Ya

Sistema de reserva y administración de turnos con login por roles (cliente, administrador de tienda y super administrador), backend REST en Spring Boot + Spring Security (JWT) y persistencia en MySQL.

## Roles del sistema

| Rol | Cómo se obtiene | Puede hacer |
| --- | --- | --- |
| **CLIENTE** | Se registra libremente desde el frontend/API | Ver tiendas disponibles con su foto, abrir el detalle ampliado de cada tienda para consultar información y solicitar turnos, cancelarlos, gestionar su perfil (nombre, foto, contraseña). |
| **ADMIN** (tienda) | Se registra libremente eligiendo "tengo una tienda" | Fijar horarios de atención, trabajar los turnos de su tienda (aceptar/rechazar/marcar como realizado), editar el perfil y la foto de su tienda, gestionar su perfil. |
| **SUPER_ADMIN** | Se crea automáticamente al levantar el backend (no se puede auto-registrar) | Ver estadísticas globales y gestionar usuarios (alta, baja, modificación). |

Las credenciales iniciales del super administrador se definen en `.env` (`SUPERADMIN_USERNAME` / `SUPERADMIN_PASSWORD`, por defecto `superadmin` / `CambiarPassword123`). **Cambialas antes de usar esto en un entorno real.**

## Frontend

Se puede abrir [frontend/src/index.html](frontend/src/index.html) directamente en un navegador, o servirlo desde el contenedor Apache incluido en Docker Compose (ver abajo). `index.html` es una landing pública que explica el proyecto y lista las tiendas disponibles; cualquier acción (pedir un turno, crear cuenta) lleva a `login.html`, y tras ingresar se accede al panel en `app.html`. Está hecho en JavaScript plano con estructura MVC (`js/models`, `js/views`, `js/controllers`), consume la API REST (`API_BASE` en `js/config.js`, por defecto `http://localhost:8080`) y guarda la sesión (JWT) en `localStorage`.

## Servicios con Docker

Todo el stack se levanta con Docker Compose:

- **frontend** (`frontend/`): Apache HTTP Server sirviendo `frontend/src/` (`index.html`, `login.html`, `app.html`, `js/`, `assets/`, `templates/`), montado como volumen para editar sin reconstruir la imagen.
- **backend** (`backend/`): API REST en Spring Boot con autenticación JWT.
- **mysql**: base de datos donde persisten usuarios, tiendas, horarios y turnos.
- **phpmyadmin**: administración web de MySQL.

### Requisitos

- Docker y Docker Compose instalados.

### Pasos

1. Copiar el archivo de variables de entorno de ejemplo:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Editar `.env` y ajustar credenciales de MySQL, `JWT_SECRET` y las del super administrador (`SUPERADMIN_*`). `APP_TIME_ZONE` define la zona horaria usada para validar fechas y horarios de turnos (por defecto, `America/Argentina/Buenos_Aires`).
3. Levantar todos los servicios:

   ```powershell
   docker compose up --build
   ```

4. Servicios disponibles:

   | Servicio | URL | Descripción |
   | --- | --- | --- |
   | Frontend | http://localhost:8082 | Sitio servido con Apache |
   | Backend (API REST) | http://localhost:8080 | API de Turno Ya |
   | phpMyAdmin | http://localhost:8081 | Administración web de MySQL |
   | MySQL | localhost:3306 | Base de datos (accesible también desde clientes SQL externos) |

5. Para detener los servicios:

   ```powershell
   docker compose down
   ```

   Agregar `-v` si además se quiere borrar el volumen de datos de MySQL (`docker compose down -v`).

### Probar la foto de la tienda

1. Abrir http://localhost:8082 y entrar como ADMIN (o registrarse con "tengo una tienda").
2. En **Mi tienda**, completar los datos, elegir una foto con **Cambiar foto** (PNG, JPG, GIF o WEBP, hasta 2 MB), verificar la vista previa y guardar. Al recargar la página la foto debe seguir ahí. **Quitar foto** vuelve a la imagen por defecto.
3. Entrar como CLIENTE: en **Tiendas disponibles** la tarjeta muestra la foto (o la imagen por defecto) y **Pedir turno** abre la pantalla ampliada con foto, descripción, dirección, horarios y el formulario de reserva.
4. Validación del servidor: un `PUT /api/tiendas/mia` con una imagen que no sea PNG/JPG/GIF/WEBP en base64 (por ejemplo SVG) o mayor a 2 MB responde 409.
5. Tests automáticos del backend (incluye `TiendaServiceTest`):

   ```powershell
   $repo = (Get-Location).Path
   docker run --rm --mount "type=bind,source=$repo\backend,target=/workspace" --workdir /workspace maven:3.9-eclipse-temurin-17 mvn -B -q clean test
   ```

### Solución de problemas

- **No veo los cambios en "Mi tienda" o en las tarjetas:** el frontend se monta como volumen, pero el navegador puede conservar los archivos `.js` y las plantillas anteriores. Recargar sin caché con `Ctrl + F5`.
- **La foto no se guarda o la API ignora `imagenTienda`:** el contenedor del backend corresponde a una imagen anterior. Reconstruirlo con `docker compose up -d --build backend` (la columna `imagen_tienda` se crea sola al iniciar).

### Endpoints de la API

**Autenticación** (públicos):

| Método | Endpoint | Descripción |
| --- | --- | --- |
| POST | `/api/auth/register` | Alta de cuenta como `ADMIN` (requiere `nombreTienda`) o `CLIENTE`. |
| POST | `/api/auth/login` | Devuelve un JWT (`Authorization: Bearer <token>` en el resto de los endpoints). |

**Tiendas y horarios**:

| Método | Endpoint | Rol | Descripción |
| --- | --- | --- | --- |
| GET | `/api/tiendas` | Público | Lista las tiendas activas (para elegir dónde pedir turno). |
| GET | `/api/tiendas/{id}/horarios` | Público | Horarios de atención de una tienda. |
| GET / PUT | `/api/tiendas/mia` | ADMIN | Consultar/editar el perfil de la propia tienda, incluida la foto (`imagenTienda`, data URL base64 PNG/JPG/GIF/WEBP de hasta 2 MB; cadena vacía la quita). |
| POST | `/api/horarios` | ADMIN | Agregar un horario de atención a la propia tienda. |
| DELETE | `/api/horarios/{id}` | ADMIN | Eliminar un horario propio. |

**Turnos**:

| Método | Endpoint | Rol | Descripción |
| --- | --- | --- | --- |
| POST | `/api/turnos` | CLIENTE | Pedir un turno (`tiendaId`, `fecha`, `horario`, `servicio`). |
| GET | `/api/turnos/mios` | CLIENTE | Ver mis turnos. |
| DELETE | `/api/turnos/{id}` | CLIENTE | Cancelar un turno propio. |
| GET | `/api/turnos/tienda?estado=` | ADMIN | Agenda de la propia tienda, filtrable por estado. |
| PUT | `/api/turnos/{id}/estado` | ADMIN | Aceptar, rechazar o marcar como realizado (`{"estado":"ACEPTADO"}`). |
| GET | `/api/turnos/tienda/resumen` | ADMIN | Indicadores (pendientes/aceptados/realizados/...). |

**Perfil propio** (CLIENTE o ADMIN):

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET / PUT | `/api/usuarios/me` | Ver/editar nombre, imagen de perfil (URL o base64) y contraseña. |

**Super administrador**:

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/api/admin/estadisticas` | Totales de usuarios, tiendas y turnos por estado. |
| GET | `/api/admin/usuarios` | Lista todos los usuarios. |
| POST | `/api/admin/usuarios` | Crea un usuario (cualquier rol). |
| PUT | `/api/admin/usuarios/{id}` | Edita un usuario. |
| DELETE | `/api/admin/usuarios/{id}` | Elimina un usuario. |

### Estructura del backend

```text
backend/
  Dockerfile              # build multi-stage (Maven -> JRE)
  pom.xml
  src/main/java/com/turnoya/backend/
    model/                # MODELO: entidades JPA y enums (Usuario, Rol, Tienda, Horario, Turno, EstadoTurno)
    repository/           # MODELO: repositorios Spring Data JPA
    service/              # MODELO: reglas de negocio (auth, tiendas, horarios, turnos, admin)
    controller/           # CONTROLADOR: endpoints REST
    view/                 # VISTA: representación JSON de la API (request/response)    security/              # JWT (generación/validación) y UserDetailsService
    exception/             # Manejo centralizado de errores
    config/                # Spring Security, CORS y bootstrap del super admin
```

### Estructura del frontend (Docker)

```text
frontend/
  Dockerfile              # httpd:2.4-alpine, copia src/ a /usr/local/apache2/htdocs
  src/
    index.html            # Landing pública: qué es Turno Ya y tiendas disponibles
    login.html            # Ingreso y registro
    app.html              # Panel privado (cliente, admin de tienda o super admin)
    assets/               # css/ e images/
    templates/            # VISTA: fragmentos HTML de cada panel
    js/
      config.js           # API_BASE y páginas del sitio
      models/             # MODELO: acceso a la API y sesión (ApiClient, SessionModel, TiendaModel, ...)
      views/              # VISTA: renderizado del DOM, sin llamadas a la API
      controllers/        # CONTROLADOR: eventos, coordinan modelos y vistas
```

En Docker Compose, `frontend/src` se monta como volumen sobre `/usr/local/apache2/htdocs` del contenedor: los cambios en esos archivos se reflejan al instante (solo hay que refrescar el navegador, sin `docker compose up --build`).

## Entrega

La documentación funcional completa se encuentra en [docs/entrega.md](docs/entrega.md).