# Carátula

**Sistema:** Turno Ya - Gestión de turnos de atención
**Integrante:** Romero Bernardo Nahuel
**Repositorio:** `YA-PNT-12C-ROMERO`
**Fecha de entrega:** Completar fecha de entrega

---

## 1. Descripción general

**Nombre del sistema:** Turno Ya.

**Objetivo:** Centralizar la reserva y administración de turnos entre múltiples tiendas/negocios y sus clientes, evitando superposiciones, reduciendo la atención manual y dando visibilidad sobre la agenda diaria y las estadísticas globales del sistema.

**Usuarios del sistema:** clientes que solicitan turnos, administradores de tienda que los atienden y un super administrador que gestiona la plataforma.

## 2. Alcance

**Incluye:** registro e inicio de sesión por rol, alta de tiendas, definición de horarios de atención, solicitud y cancelación de turnos, gestión del ciclo de vida del turno (aceptar/rechazar/marcar como realizado), gestión de perfil de usuario (nombre, foto, contraseña), estadísticas globales y administración de usuarios (altas, bajas y modificaciones).

**No incluye:** pagos en línea, envío de correos o mensajes automáticos, integración con calendarios externos, administración de múltiples sucursales por una misma tienda ni recuperación de contraseña por correo.

## 3. Actores / usuarios

| Actor | Acciones permitidas |
| --- | --- |
| Cliente | Se registra, inicia sesión, visualiza las tiendas disponibles junto a sus horarios, solicita turnos, cancela sus propios turnos y gestiona su perfil (nombre, foto de perfil y contraseña). |
| Administrador (tienda) | Se registra creando el perfil de su tienda, inicia sesión, define los horarios de atención, consulta la agenda de su tienda y trabaja cada turno (acepta, rechaza o marca como realizado), edita el perfil de la tienda y gestiona su propio perfil. |
| Super administrador | Cuenta creada automáticamente al iniciar el sistema (no se registra públicamente). Visualiza estadísticas globales (usuarios, tiendas y turnos) y gestiona usuarios: altas, bajas y modificaciones de cualquier rol. |

## 4. Flujos funcionales

### Registro e inicio de sesión

**Descripción:** Un usuario crea su cuenta eligiendo si quiere pedir turnos (cliente) o dar turnos con su propia tienda (administrador).
**Paso a paso:**
1. Completa nombre de usuario, correo, contraseña y nombre completo.
2. Si elige "administrador", ingresa además el nombre de su tienda.
3. El sistema valida los datos, crea la cuenta (y la tienda si corresponde) e inicia sesión automáticamente.
4. En accesos posteriores, inicia sesión con usuario y contraseña.

**Resultado esperado:** El usuario queda autenticado y ve el panel correspondiente a su rol (cliente, administrador o super administrador).

### Definición de horarios de atención

**Descripción:** El administrador configura los horarios en los que su tienda atiende turnos.
**Paso a paso:**
1. Selecciona el día de la semana y el rango horario (desde/hasta).
2. El sistema valida que la hora de inicio sea anterior a la de fin.
3. El horario queda visible para los clientes al consultar la tienda.

**Resultado esperado:** Los horarios definidos se listan en el perfil de la tienda y son consultables públicamente.

### Solicitud de turno

**Descripción:** Un cliente elige una tienda disponible y solicita un turno.
**Paso a paso:**
1. Visualiza en la pantalla principal las tiendas activas con su foto (o una imagen por defecto), descripción y horarios de atención.
2. Presiona "Pedir turno": se abre una pantalla ampliada con la foto, la descripción, la dirección y los horarios de la tienda.
3. Elige fecha, horario y servicio en el formulario de esa pantalla.
4. El sistema verifica los datos obligatorios, que la fecha/hora no haya pasado (según la zona horaria configurada) y que el horario no esté ocupado en esa tienda.
5. El turno se registra con estado "pendiente".

**Resultado esperado:** El turno aparece en "Mis turnos" del cliente y en la agenda del administrador de la tienda.

### Gestión del turno por el administrador

**Descripción:** El administrador trabaja los turnos pendientes de su tienda.
**Paso a paso:**
1. Consulta la agenda de su tienda, con la opción de filtrar por estado.
2. Para un turno pendiente, lo acepta o lo rechaza.
3. Para un turno aceptado, una vez atendido lo marca como realizado (o lo cancela si corresponde).

**Resultado esperado:** El estado del turno se actualiza y el cliente puede verlo reflejado en "Mis turnos".

### Cancelación de turno (cliente)

**Descripción:** El cliente cancela un turno propio que todavía no fue realizado.
**Paso a paso:**
1. Ubica el turno en "Mis turnos".
2. Presiona el botón de cancelar.
3. El sistema cambia el estado a "cancelado" y libera el horario.

**Resultado esperado:** El turno deja de estar activo y el horario vuelve a estar disponible para otros clientes.

### Gestión de perfil

**Descripción:** Cualquier usuario autenticado (cliente o administrador) edita su nombre, foto de perfil y contraseña.
**Paso a paso:**
1. Accede a la sección "Mi perfil".
2. Modifica su nombre y/o sube una nueva foto.
3. Opcionalmente cambia su contraseña indicando la actual y la nueva.

**Resultado esperado:** Los datos del perfil quedan actualizados; la contraseña solo cambia si la actual es correcta.

### Estadísticas y gestión de usuarios (super administrador)

**Descripción:** El super administrador supervisa la plataforma.
**Paso a paso:**
1. Consulta estadísticas globales: usuarios totales, administradores, clientes, tiendas y turnos por estado.
2. Accede al listado de usuarios y puede crear, editar o eliminar cualquier usuario (incluyendo su rol y estado activo/inactivo).

**Resultado esperado:** Los cambios sobre usuarios se reflejan de inmediato en el listado y en las estadísticas.

## 5. Maquetas de pantallas

### Login / registro

```text
+--------------------------------------------------------------+
| Turno Ya                                                      |
+--------------------------------------------------------------+
| Iniciar sesión          | Crear una cuenta                   |
| Usuario: [            ] | Quiero: [Cliente | Administrador]  |
| Contraseña: [         ] | Nombre tienda (si admin): [       ]|
| [ Ingresar ]             | Nombre, usuario, correo, password  |
|                          | [ Crear cuenta ]                   |
+--------------------------------------------------------------+
```

### Panel cliente

```text
+--------------------------------------------------------------+
| Turno Ya   [Tiendas disponibles] [Mis turnos] [Mi perfil]  AR |
+--------------------------------------------------------------+
| [foto] Tienda A - descripción - horarios      [Pedir turno]  |
| [foto] Tienda B - descripción - horarios      [Pedir turno]  |
+--------------------------------------------------------------+

Al presionar "Pedir turno" se abre una pantalla ampliada:
+--------------------------------------------------------------+
| Tienda A                                                [X]  |
| [ Foto grande ]            | Fecha    [..........]           |
| Dirección                  | Horario  [..........]           |
| Sobre la tienda: ...       | Servicio [..........]           |
| Horarios de atención       | [Confirmar turno]               |
+--------------------------------------------------------------+
```

### Panel administrador

```text
+--------------------------------------------------------------+
| Turno Ya   [Agenda] [Horarios] [Mi tienda] [Mi perfil]     AR |
+--------------------------------------------------------------+
| Pendientes: 3   Aceptados: 5   Realizados: 12                |
| 10:00  Cliente - Servicio - PENDIENTE  [Aceptar] [Rechazar]  |
| 11:00  Cliente - Servicio - ACEPTADO   [Realizado] [Cancelar]|
+--------------------------------------------------------------+
```

### Panel super administrador

```text
+--------------------------------------------------------------+
| Turno Ya                    [Estadísticas] [Usuarios]     AR |
+--------------------------------------------------------------+
| Usuarios: 20  Tiendas: 5  Turnos: 130  Pendientes: 8          |
| [+ Nuevo usuario]                                             |
| usuario | correo | nombre | rol | activo | [editar] [borrar] |
+--------------------------------------------------------------+
```

**Elementos:** navegación por pestañas según rol, formularios de login/registro, tarjetas de tiendas con horarios, formulario de solicitud de turno, listado de turnos con acciones según estado, indicadores numéricos, formulario de perfil con foto, tabla de usuarios con alta/edición/baja.

## 6. Validaciones

- Nombre de usuario, correo, contraseña (mínimo 8 caracteres) y nombre completo son obligatorios para registrarse.
- El correo debe tener formato válido.
- El nombre de la tienda es obligatorio al registrarse como administrador.
- No se permite registrar más de un turno en el mismo horario y fecha para una misma tienda.
- No se permiten turnos en fechas pasadas ni en horarios del día actual que ya transcurrieron; se usa la zona horaria `APP_TIME_ZONE` (por defecto `America/Argentina/Buenos_Aires`) y el selector de fecha del frontend usa la fecha local.
- La foto de la tienda (subida por su administrador) debe ser PNG, JPG, GIF o WEBP, de hasta 2 MB; el servidor lo valida. Sin foto se muestra una imagen por defecto.
- Un turno solo puede pasar de pendiente a aceptado/rechazado, y de aceptado a realizado/cancelado (no se permiten otras transiciones).
- Un cliente solo puede cancelar sus propios turnos, y solo si no fueron marcados como realizados.
- Para cambiar la contraseña del perfil propio, se debe indicar correctamente la contraseña actual.
- Se muestra un mensaje de error cuando una validación falla.

## 7. Requisitos funcionales

- **RF1:** El sistema debe permitir el registro de cuentas como cliente o como administrador (con su tienda asociada).
- **RF2:** El sistema debe permitir iniciar sesión y mantener la sesión autenticada mediante un token.
- **RF3:** El sistema debe validar los datos obligatorios y el formato de correo/contraseña al registrarse.
- **RF4:** El cliente debe poder visualizar las tiendas disponibles junto con sus horarios de atención.
- **RF5:** El administrador debe poder definir los horarios de atención de su tienda.
- **RF6:** El cliente debe poder solicitar un turno indicando tienda, fecha, horario y servicio.
- **RF7:** El sistema debe impedir reservar un horario que ya se encuentre ocupado en esa tienda.
- **RF8:** El administrador debe poder consultar la agenda de su tienda y filtrarla por estado.
- **RF9:** El administrador debe poder aceptar, rechazar o marcar como realizado cada turno de su tienda.
- **RF10:** El cliente debe poder cancelar sus propios turnos (si aún no fueron realizados).
- **RF11:** Todo usuario autenticado debe poder gestionar su perfil: nombre, foto e (opcionalmente) contraseña.
- **RF12:** El super administrador debe poder visualizar estadísticas globales de usuarios, tiendas y turnos.
- **RF13:** El super administrador debe poder dar de alta, modificar y eliminar usuarios de cualquier rol.
- **RF14:** El administrador debe poder subir, cambiar y quitar la foto de su tienda.
- **RF15:** El cliente debe ver la foto de cada tienda (o una imagen por defecto) y, al pedir turno, una pantalla ampliada con foto, descripción y demás información de la tienda.
- **RF16:** El sistema debe rechazar turnos cuya fecha y hora ya hayan pasado.

## 8. Requisitos no funcionales

- **Usabilidad:** interfaz clara, adaptable a pantallas de escritorio y móviles, con paneles diferenciados por rol.
- **Rendimiento:** las operaciones de agenda y autenticación deben responder en menos de 2 segundos en condiciones normales.
- **Seguridad:** las contraseñas se almacenan hasheadas (BCrypt); el acceso a la API se controla mediante tokens JWT y autorización por rol; el super administrador no es auto-registrable.
- **Compatibilidad:** debe ejecutarse en navegadores modernos sin instalación adicional.
- **Despliegue:** el sistema se distribuye mediante contenedores Docker (frontend, backend y base de datos) para facilitar su instalación.

## 9. Modelo de datos

### Entidad Usuario

| Atributo | Tipo | Descripción |
| --- | --- | --- |
| id | Número | Identificador único. |
| nombreUsuario | Texto | Usuario único para iniciar sesión. |
| correo | Texto | Correo electrónico de contacto (único). |
| passwordHash | Texto | Contraseña almacenada hasheada. |
| nombreCompleto | Texto | Nombre y apellido. |
| imagenPerfil | Texto | Foto de perfil (URL o imagen embebida). |
| rol | Texto | SUPER_ADMIN, ADMIN o CLIENTE. |
| activo | Booleano | Habilita o deshabilita la cuenta. |

### Entidad Tienda

| Atributo | Tipo | Descripción |
| --- | --- | --- |
| id | Número | Identificador único. |
| nombre | Texto | Nombre del negocio. |
| descripcion | Texto | Descripción del negocio. |
| direccion | Texto | Dirección física. |
| imagenTienda | Texto largo | Foto de la tienda (imagen base64 embebida), cargada por su administrador. |
| activa | Booleano | Indica si la tienda acepta turnos. |
| idAdmin | Número | Referencia al Usuario (rol ADMIN) dueño de la tienda. |

### Entidad Horario

| Atributo | Tipo | Descripción |
| --- | --- | --- |
| id | Número | Identificador único. |
| idTienda | Número | Referencia a la tienda. |
| diaSemana | Texto | Día de la semana (lunes a domingo). |
| horaInicio | Hora | Inicio de la atención. |
| horaFin | Hora | Fin de la atención. |

### Entidad Turno

| Atributo | Tipo | Descripción |
| --- | --- | --- |
| id | Número | Identificador único. |
| idTienda | Número | Referencia a la tienda donde se solicita el turno. |
| idCliente | Número | Referencia al Usuario (rol CLIENTE) que solicita el turno. |
| fecha | Fecha | Día de la atención. |
| horario | Hora | Horario asignado. |
| servicio | Texto | Tipo de atención solicitada. |
| estado | Texto | Pendiente, aceptado, rechazado, realizado o cancelado. |

**Relaciones:** un Usuario con rol ADMIN tiene una única Tienda; una Tienda tiene muchos Horarios; una Tienda y un Usuario con rol CLIENTE pueden tener muchos Turnos; cada Turno corresponde a una única Tienda y a un único cliente.
