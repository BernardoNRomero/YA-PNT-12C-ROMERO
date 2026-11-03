// VISTA: panel del super administrador (estadisticas y usuarios).
const SuperAdminView = {
  renderEstadisticas(est) {
    document.getElementById("estadisticas-cards").innerHTML = `
      <article><span class="metric-label">Usuarios totales</span><strong>${est.totalUsuarios}</strong></article>
      <article><span class="metric-label">Administradores</span><strong>${est.totalAdmins}</strong></article>
      <article><span class="metric-label">Clientes</span><strong>${est.totalClientes}</strong></article>
      <article><span class="metric-label">Tiendas</span><strong>${est.totalTiendas}</strong></article>
      <article><span class="metric-label">Turnos totales</span><strong>${est.totalTurnos}</strong></article>
      <article><span class="metric-label">Pendientes</span><strong>${est.turnosPendientes}</strong></article>
      <article><span class="metric-label">Aceptados</span><strong>${est.turnosAceptados}</strong></article>
      <article><span class="metric-label">Realizados</span><strong>${est.turnosRealizados}</strong></article>
    `;
  },

  renderUsuarios(usuarios, { onEditar, onEliminar }) {
    const tbody = document.getElementById("usuarios-tbody");
    tbody.innerHTML = "";
    usuarios.forEach((usuario) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${FormatView.escapeHtml(usuario.nombreUsuario)}</td>
        <td>${FormatView.escapeHtml(usuario.correo)}</td>
        <td>${FormatView.escapeHtml(usuario.nombreCompleto)}</td>
        <td>${usuario.rol}</td>
        <td>${usuario.activo ? "Sí" : "No"}</td>
        <td>
          <button class="icon-button" title="Editar">✎</button>
          <button class="icon-button remove" title="Eliminar">×</button>
        </td>
      `;
      tr.querySelector("[title='Editar']").addEventListener("click", () => onEditar(usuario));
      tr.querySelector(".remove").addEventListener("click", () => onEliminar(usuario));
      tbody.appendChild(tr);
    });
  },

  abrirFormulario(usuario) {
    const form = document.getElementById("usuario-form");
    form.hidden = false;
    form.reset();
    form.id.value = usuario?.id || "";
    form.nombreUsuario.value = usuario?.nombreUsuario || "";
    form.nombreUsuario.disabled = Boolean(usuario);
    form.correo.value = usuario?.correo || "";
    form.nombreCompleto.value = usuario?.nombreCompleto || "";
    form.rol.value = usuario?.rol || "CLIENTE";
    form.activo.checked = usuario ? usuario.activo : true;
    form.password.required = !usuario;
    document.getElementById("usuario-message").textContent = "";
  },
};
