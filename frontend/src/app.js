// URL base del backend (Spring Boot). Cambiar si se despliega en otro host/puerto.
const API_BASE = "http://localhost:8080";

const state = {
  token: localStorage.getItem("turnoya_token") || null,
  usuario: JSON.parse(localStorage.getItem("turnoya_usuario") || "null"),
};

function guardarSesion(auth) {
  state.token = auth.token;
  state.usuario = { nombreUsuario: auth.nombreUsuario, nombreCompleto: auth.nombreCompleto, rol: auth.rol };
  localStorage.setItem("turnoya_token", state.token);
  localStorage.setItem("turnoya_usuario", JSON.stringify(state.usuario));
}

function cerrarSesion() {
  state.token = null;
  state.usuario = null;
  localStorage.removeItem("turnoya_token");
  localStorage.removeItem("turnoya_usuario");
  mostrarVista();
}

function fechaLocalISO(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

async function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (response.status === 204) return null;
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 401) cerrarSesion();
    const detalle = body?.errores ? Object.values(body.errores).join(" ") : body?.mensaje;
    throw new Error(detalle || "Ocurrió un error inesperado.");
  }
  return body;
}

// ---------- Navegación entre vistas segun sesion/rol ----------

function mostrarVista() {
  const vistas = ["vista-auth", "vista-cliente", "vista-admin", "vista-superadmin"];
  vistas.forEach((id) => (document.getElementById(id).hidden = true));
  const userBox = document.getElementById("user-box");

  if (!state.usuario) {
    document.getElementById("vista-auth").hidden = false;
    userBox.hidden = true;
    return;
  }

  userBox.hidden = false;
  document.getElementById("user-name").textContent = `${state.usuario.nombreCompleto} (${state.usuario.rol})`;

  if (state.usuario.rol === "CLIENTE") {
    document.getElementById("vista-cliente").hidden = false;
    cargarTiendas();
    cargarMisTurnos();
    cargarPerfil("perfil-cliente-form");
  } else if (state.usuario.rol === "ADMIN") {
    document.getElementById("vista-admin").hidden = false;
    cargarAgendaAdmin();
    cargarHorarios();
    cargarMiTienda();
    cargarPerfil("perfil-admin-form");
  } else if (state.usuario.rol === "SUPER_ADMIN") {
    document.getElementById("vista-superadmin").hidden = false;
    cargarEstadisticas();
    cargarUsuarios();
  }
}

function initTabs() {
  document.querySelectorAll(".tabs").forEach((tabs) => {
    const panel = tabs.closest("section");
    tabs.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        tabs.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        panel.querySelectorAll(".tab-content").forEach((content) => {
          content.hidden = content.dataset.tabContent !== btn.dataset.tab;
        });
      });
    });
  });
}

// ---------- Carga de vistas/componentes HTML ----------

async function cargarVistas() {
  const [headerHtml, authHtml, clienteHtml, adminHtml, superadminHtml] = await Promise.all([
    fetch("views/header.html").then((r) => r.text()),
    fetch("views/auth.html").then((r) => r.text()),
    fetch("views/cliente.html").then((r) => r.text()),
    fetch("views/admin.html").then((r) => r.text()),
    fetch("views/superadmin.html").then((r) => r.text()),
  ]);

  document.getElementById("app-header").outerHTML = headerHtml;
  document.getElementById("app-main").innerHTML = authHtml + clienteHtml + adminHtml + superadminHtml;
}

let usuarioForm;

function configurarEventos() {
  // Autenticación
  const registerRol = document.getElementById("register-rol");
  const registerTiendaLabel = document.getElementById("register-tienda-label");

  registerRol.addEventListener("change", (event) => {
    registerTiendaLabel.hidden = event.target.value !== "ADMIN";
  });
  registerTiendaLabel.hidden = registerRol.value !== "ADMIN";

  document.getElementById("login-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const message = document.getElementById("login-message");
    try {
      const auth = await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
      guardarSesion(auth);
      event.target.reset();
      message.textContent = "";
      mostrarVista();
    } catch (error) {
      message.textContent = error.message;
    }
  });

  document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const message = document.getElementById("register-message");
    try {
      const auth = await apiFetch("/api/auth/register", { method: "POST", body: JSON.stringify(data) });
      guardarSesion(auth);
      event.target.reset();
      message.textContent = "";
      mostrarVista();
    } catch (error) {
      message.textContent = error.message;
    }
  });

  document.getElementById("logout-btn").addEventListener("click", cerrarSesion);

  configurarReservaTienda();

  // Admin
  document.getElementById("admin-estado-filter").addEventListener("change", cargarAgendaAdmin);

  document.getElementById("horario-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const message = document.getElementById("horario-message");
    try {
      await apiFetch("/api/horarios", {
        method: "POST",
        body: JSON.stringify({ diaSemana: data.diaSemana, horaInicio: `${data.horaInicio}:00`, horaFin: `${data.horaFin}:00` }),
      });
      message.classList.add("success");
      message.textContent = "Horario agregado.";
      event.target.reset();
      cargarHorarios();
    } catch (error) {
      message.classList.remove("success");
      message.textContent = error.message;
    }
  });

  document.getElementById("tienda-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const message = document.getElementById("tienda-message");
    try {
      await apiFetch("/api/tiendas/mia", {
        method: "PUT",
        body: JSON.stringify({
          nombre: data.nombre,
          descripcion: data.descripcion,
          direccion: data.direccion,
          imagenTienda: event.target.dataset.imagenTienda ?? "",
        }),
      });
      message.classList.add("success");
      message.textContent = "Tienda actualizada.";
    } catch (error) {
      message.classList.remove("success");
      message.textContent = error.message;
    }
  });

  // Superadmin
  usuarioForm = document.getElementById("usuario-form");
  document.getElementById("nuevo-usuario-btn").addEventListener("click", () => abrirFormularioUsuario(null));
  document.getElementById("cancelar-usuario-btn").addEventListener("click", () => (usuarioForm.hidden = true));

  usuarioForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(usuarioForm));
    const message = document.getElementById("usuario-message");
    const payload = {
      nombreUsuario: data.nombreUsuario,
      correo: data.correo,
      nombreCompleto: data.nombreCompleto,
      rol: data.rol,
      activo: usuarioForm.activo.checked,
      password: data.password || null,
    };
    try {
      if (data.id) {
        await apiFetch(`/api/admin/usuarios/${data.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/api/admin/usuarios", { method: "POST", body: JSON.stringify(payload) });
      }
      usuarioForm.hidden = true;
      cargarUsuarios();
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

function configurarReservaTienda() {
  const dialog = document.getElementById("tienda-detalle-dialog");
  const form = document.getElementById("tienda-turno-form");
  const fechaInput = form.elements.fecha;
  const message = document.getElementById("tienda-turno-message");

  document.getElementById("cerrar-tienda-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  fechaInput.addEventListener("focus", () => {
    fechaInput.min = fechaLocalISO();
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    message.classList.remove("success");
    message.textContent = "";

    try {
      await apiFetch("/api/turnos", {
        method: "POST",
        body: JSON.stringify({
          tiendaId: Number(form.dataset.tiendaId),
          fecha: data.fecha,
          horario: `${data.horario}:00`,
          servicio: data.servicio,
        }),
      });
      message.classList.add("success");
      message.textContent = "¡Solicitud enviada! La tienda confirmará tu turno.";
      form.reset();
      fechaInput.min = fechaLocalISO();
      cargarMisTurnos();
    } catch (error) {
      message.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
}

function abrirDetalleTienda(tienda, horarios) {
  const dialog = document.getElementById("tienda-detalle-dialog");
  const imagen = document.getElementById("tienda-detalle-imagen");
  const listaHorarios = document.getElementById("tienda-detalle-horarios");
  const form = document.getElementById("tienda-turno-form");
  const message = document.getElementById("tienda-turno-message");

  document.getElementById("tienda-detalle-nombre").textContent = tienda.nombre;
  document.getElementById("tienda-detalle-direccion").textContent = tienda.direccion || "Dirección no informada";
  document.getElementById("tienda-detalle-descripcion").textContent =
    tienda.descripcion || "Esta tienda todavía no agregó una descripción.";
  imagen.alt = `Foto de ${tienda.nombre}`;
  setImagenConRespaldo(imagen, tienda.imagenTienda);

  listaHorarios.replaceChildren();
  if (horarios.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Sin horarios cargados";
    listaHorarios.appendChild(item);
  } else {
    horarios.forEach((horario) => {
      const item = document.createElement("li");
      item.textContent = `${horario.diaSemana}: ${horario.horaInicio.slice(0, 5)}–${horario.horaFin.slice(0, 5)}`;
      listaHorarios.appendChild(item);
    });
  }

  form.reset();
  form.dataset.tiendaId = tienda.id;
  form.elements.fecha.min = fechaLocalISO();
  message.classList.remove("success");
  message.textContent = "";
  dialog.showModal();
}

// ---------- Perfil (comun a cliente y admin): nombre, imagen y contraseña ----------

function cargarPerfil(formId) {
  apiFetch("/api/usuarios/me").then((usuario) => renderPerfilForm(formId, usuario)).catch(() => {});
}

function renderPerfilForm(formId, usuario) {
  const form = document.getElementById(formId);
  form.innerHTML = `
    <div class="avatar-row">
      <img class="avatar-preview" id="${formId}-avatar" src="${usuario.imagenPerfil || placeholderAvatar()}" alt="Foto de perfil" />
      <label class="button">Cambiar foto
        <input type="file" accept="image/*" id="${formId}-file" hidden />
      </label>
    </div>
    <label>Nombre completo
      <input name="nombreCompleto" type="text" value="${escapeHtml(usuario.nombreCompleto)}" required />
    </label>
    <fieldset class="password-fieldset">
      <legend>Cambiar contraseña (opcional)</legend>
      <label>Contraseña actual
        <input name="passwordActual" type="password" />
      </label>
      <label>Contraseña nueva
        <input name="passwordNueva" type="password" minlength="8" />
      </label>
    </fieldset>
    <p class="form-message" id="${formId}-message" role="alert"></p>
    <button class="button primary" type="submit">Guardar cambios</button>
  `;

  let imagenPerfil = usuario.imagenPerfil || null;
  const fileInput = document.getElementById(`${formId}-file`);
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      const message = document.getElementById(`${formId}-message`);
      message.classList.remove("success");
      message.textContent = "La imagen no debe superar los 2 MB.";
      fileInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      imagenPerfil = reader.result;
      document.getElementById(`${formId}-avatar`).src = imagenPerfil;
    };
    reader.readAsDataURL(file);
  });

  form.onsubmit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const message = document.getElementById(`${formId}-message`);
    try {
      await apiFetch("/api/usuarios/me", {
        method: "PUT",
        body: JSON.stringify({
          nombreCompleto: data.nombreCompleto,
          imagenPerfil,
          passwordActual: data.passwordActual || null,
          passwordNueva: data.passwordNueva || null,
        }),
      });
      message.classList.add("success");
      message.textContent = "Perfil actualizado.";
      state.usuario.nombreCompleto = data.nombreCompleto;
      localStorage.setItem("turnoya_usuario", JSON.stringify(state.usuario));
      document.getElementById("user-name").textContent = `${state.usuario.nombreCompleto} (${state.usuario.rol})`;
    } catch (error) {
      message.classList.remove("success");
      message.textContent = error.message;
    }
  };
}

function placeholderAvatar() {
  return "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#d5ece6"/><text x="50%" y="55%" font-size="26" text-anchor="middle" fill="#006359">?</text></svg>'
  );
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

// ---------- Cliente: tiendas disponibles ----------

async function cargarTiendas() {
  const contenedor = document.getElementById("tiendas-list");
  try {
    const tiendas = await apiFetch("/api/tiendas");
    if (tiendas.length === 0) {
      contenedor.innerHTML = `<p class="empty-state">Todavía no hay tiendas disponibles.</p>`;
      return;
    }
    contenedor.innerHTML = "";
    for (const tienda of tiendas) {
      const horarios = await apiFetch(`/api/tiendas/${tienda.id}/horarios`);
      const card = document.createElement("article");
      card.className = "tienda-card";
      card.innerHTML = `
        <img class="tienda-imagen" alt="Foto de ${escapeHtml(tienda.nombre)}" />
        <h3>${escapeHtml(tienda.nombre)}</h3>
        <p>${escapeHtml(tienda.descripcion || "")}</p>
        <p class="tienda-direccion">${escapeHtml(tienda.direccion || "")}</p>
        <p class="tienda-horarios">${horarios.map((h) => `${h.diaSemana} ${h.horaInicio.slice(0, 5)}-${h.horaFin.slice(0, 5)}`).join(", ") || "Sin horarios cargados"}</p>
        <button class="button primary tienda-card-reservar" type="button">Pedir turno</button>
      `;
      setImagenConRespaldo(card.querySelector(".tienda-imagen"), tienda.imagenTienda);
      card.querySelector(".tienda-card-reservar").addEventListener("click", () => {
        abrirDetalleTienda(tienda, horarios);
      });
      contenedor.appendChild(card);
    }
  } catch (error) {
    contenedor.innerHTML = `<p class="form-message">${error.message}</p>`;
  }
}

async function cargarMisTurnos() {
  const contenedor = document.getElementById("mis-turnos-list");
  try {
    const turnos = await apiFetch("/api/turnos/mios");
    if (turnos.length === 0) {
      contenedor.innerHTML = `<p class="empty-state">Todavía no pediste turnos.</p>`;
      return;
    }
    contenedor.innerHTML = "";
    turnos.forEach((turno) => {
      const row = document.createElement("article");
      row.className = "turno-row";
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(turno.tiendaNombre)}</strong>
          <span>${turno.fecha} ${turno.horario.slice(0, 5)} · ${escapeHtml(turno.servicio)}</span>
        </div>
        <span class="status ${turno.estado.toLowerCase()}">${turno.estado}</span>
        ${turno.estado === "PENDIENTE" || turno.estado === "ACEPTADO" ? '<button class="icon-button remove" title="Cancelar turno">×</button>' : ""}
      `;
      const cancelBtn = row.querySelector(".remove");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", async () => {
          try {
            await apiFetch(`/api/turnos/${turno.id}`, { method: "DELETE" });
            cargarMisTurnos();
          } catch (error) {
            alert(error.message);
          }
        });
      }
      contenedor.appendChild(row);
    });
  } catch (error) {
    contenedor.innerHTML = `<p class="form-message">${error.message}</p>`;
  }
}

// ---------- Admin: agenda, horarios, tienda ----------

async function cargarAgendaAdmin() {
  const estado = document.getElementById("admin-estado-filter").value;
  const contenedor = document.getElementById("admin-agenda-list");
  try {
    const resumen = await apiFetch("/api/turnos/tienda/resumen");
    document.getElementById("admin-resumen").innerHTML = `
      <article><span class="metric-label">Pendientes</span><strong>${resumen.pendientes}</strong></article>
      <article><span class="metric-label">Aceptados</span><strong>${resumen.aceptados}</strong></article>
      <article><span class="metric-label">Realizados</span><strong>${resumen.realizados}</strong></article>
    `;

    const query = estado ? `?estado=${estado}` : "";
    const turnos = await apiFetch(`/api/turnos/tienda${query}`);
    if (turnos.length === 0) {
      contenedor.innerHTML = `<p class="empty-state">No hay turnos con este filtro.</p>`;
      return;
    }
    contenedor.innerHTML = "";
    turnos.forEach((turno) => {
      const row = document.createElement("article");
      row.className = "turno-row";
      const acciones = turno.estado === "PENDIENTE"
        ? `<button class="button primary" data-accion="ACEPTADO">Aceptar</button><button class="button" data-accion="RECHAZADO">Rechazar</button>`
        : turno.estado === "ACEPTADO"
          ? `<button class="button primary" data-accion="REALIZADO">Marcar realizado</button><button class="button" data-accion="CANCELADO">Cancelar</button>`
          : "";
      row.innerHTML = `
        <div>
          <strong>${escapeHtml(turno.clienteNombre)}</strong>
          <span>${turno.fecha} ${turno.horario.slice(0, 5)} · ${escapeHtml(turno.servicio)}</span>
        </div>
        <span class="status ${turno.estado.toLowerCase()}">${turno.estado}</span>
        <div class="turno-acciones">${acciones}</div>
      `;
      row.querySelectorAll("[data-accion]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          try {
            await apiFetch(`/api/turnos/${turno.id}/estado`, {
              method: "PUT",
              body: JSON.stringify({ estado: btn.dataset.accion }),
            });
            cargarAgendaAdmin();
          } catch (error) {
            alert(error.message);
          }
        });
      });
      contenedor.appendChild(row);
    });
  } catch (error) {
    contenedor.innerHTML = `<p class="form-message">${error.message}</p>`;
  }
}

async function cargarHorarios() {
  const tienda = await apiFetch("/api/tiendas/mia").catch(() => null);
  if (!tienda) return;
  const contenedor = document.getElementById("horarios-list");
  const horarios = await apiFetch(`/api/tiendas/${tienda.id}/horarios`);
  if (horarios.length === 0) {
    contenedor.innerHTML = `<p class="empty-state">Todavía no cargaste horarios de atención.</p>`;
    return;
  }
  contenedor.innerHTML = "";
  horarios.forEach((horario) => {
    const row = document.createElement("article");
    row.className = "turno-row";
    row.innerHTML = `
      <div><strong>${horario.diaSemana}</strong><span>${horario.horaInicio.slice(0, 5)} a ${horario.horaFin.slice(0, 5)}</span></div>
      <button class="icon-button remove" title="Eliminar horario">×</button>
    `;
    row.querySelector(".remove").addEventListener("click", async () => {
      await apiFetch(`/api/horarios/${horario.id}`, { method: "DELETE" });
      cargarHorarios();
    });
    contenedor.appendChild(row);
  });
}

async function cargarMiTienda() {
  try {
    const tienda = await apiFetch("/api/tiendas/mia");
    const form = document.getElementById("tienda-form");
    form.nombre.value = tienda.nombre;
    form.descripcion.value = tienda.descripcion || "";
    form.direccion.value = tienda.direccion || "";
    form.dataset.imagenTienda = tienda.imagenTienda || "";
    mostrarImagenTienda(tienda.imagenTienda);
  } catch (error) {
    // Sin tienda asociada: no debería pasar para un ADMIN, se ignora silenciosamente.
  }
}

function mostrarImagenTienda(imagen) {
  setImagenConRespaldo(document.getElementById("tienda-imagen-preview"), imagen);
}

function setImagenConRespaldo(elemento, imagen) {
  const esImagenBase64 = typeof imagen === "string" && /^data:image\/[\w.+-]+;base64,/i.test(imagen);
  elemento.onerror = () => {
    elemento.onerror = null;
    elemento.src = "images/store-placeholder.svg";
  };
  elemento.src = esImagenBase64 ? imagen : "images/store-placeholder.svg";
}

function configurarImagenTienda() {
  const form = document.getElementById("tienda-form");
  const fileInput = form.elements.imagenTiendaFile;
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const message = document.getElementById("tienda-message");
    if (file.size > 2 * 1024 * 1024) {
      message.classList.remove("success");
      message.textContent = "La imagen no debe superar los 2 MB.";
      fileInput.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      message.classList.remove("success");
      message.textContent = "Seleccioná un archivo de imagen válido.";
      fileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      form.dataset.imagenTienda = reader.result;
      mostrarImagenTienda(reader.result);
      message.textContent = "";
    };
    reader.onerror = () => {
      message.classList.remove("success");
      message.textContent = "No se pudo leer la imagen seleccionada.";
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("tienda-imagen-remove").addEventListener("click", () => {
    form.dataset.imagenTienda = "";
    fileInput.value = "";
    mostrarImagenTienda(null);
  });
}

// ---------- Super administrador ----------

async function cargarEstadisticas() {
  const contenedor = document.getElementById("estadisticas-cards");
  const est = await apiFetch("/api/admin/estadisticas");
  contenedor.innerHTML = `
    <article><span class="metric-label">Usuarios totales</span><strong>${est.totalUsuarios}</strong></article>
    <article><span class="metric-label">Administradores</span><strong>${est.totalAdmins}</strong></article>
    <article><span class="metric-label">Clientes</span><strong>${est.totalClientes}</strong></article>
    <article><span class="metric-label">Tiendas</span><strong>${est.totalTiendas}</strong></article>
    <article><span class="metric-label">Turnos totales</span><strong>${est.totalTurnos}</strong></article>
    <article><span class="metric-label">Pendientes</span><strong>${est.turnosPendientes}</strong></article>
    <article><span class="metric-label">Aceptados</span><strong>${est.turnosAceptados}</strong></article>
    <article><span class="metric-label">Realizados</span><strong>${est.turnosRealizados}</strong></article>
  `;
}

async function cargarUsuarios() {
  const usuarios = await apiFetch("/api/admin/usuarios");
  const tbody = document.getElementById("usuarios-tbody");
  tbody.innerHTML = "";
  usuarios.forEach((usuario) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(usuario.nombreUsuario)}</td>
      <td>${escapeHtml(usuario.correo)}</td>
      <td>${escapeHtml(usuario.nombreCompleto)}</td>
      <td>${usuario.rol}</td>
      <td>${usuario.activo ? "Sí" : "No"}</td>
      <td>
        <button class="icon-button" title="Editar">✎</button>
        <button class="icon-button remove" title="Eliminar">×</button>
      </td>
    `;
    tr.querySelector("[title='Editar']").addEventListener("click", () => abrirFormularioUsuario(usuario));
    tr.querySelector(".remove").addEventListener("click", async () => {
      if (!confirm(`¿Eliminar al usuario ${usuario.nombreUsuario}?`)) return;
      await apiFetch(`/api/admin/usuarios/${usuario.id}`, { method: "DELETE" });
      cargarUsuarios();
    });
    tbody.appendChild(tr);
  });
}

function abrirFormularioUsuario(usuario) {
  if (!usuarioForm) usuarioForm = document.getElementById("usuario-form");
  usuarioForm.hidden = false;
  usuarioForm.reset();
  usuarioForm.id.value = usuario?.id || "";
  usuarioForm.nombreUsuario.value = usuario?.nombreUsuario || "";
  usuarioForm.nombreUsuario.disabled = Boolean(usuario);
  usuarioForm.correo.value = usuario?.correo || "";
  usuarioForm.nombreCompleto.value = usuario?.nombreCompleto || "";
  usuarioForm.rol.value = usuario?.rol || "CLIENTE";
  usuarioForm.activo.checked = usuario ? usuario.activo : true;
  usuarioForm.password.required = !usuario;
  document.getElementById("usuario-message").textContent = "";
}

// ---------- Arranque ----------

async function init() {
  await cargarVistas();
  configurarEventos();
  configurarImagenTienda();
  initTabs();
  mostrarVista();
}

init();
