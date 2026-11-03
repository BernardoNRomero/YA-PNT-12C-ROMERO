// VISTA: turnos (calendario, listado del cliente y agenda de la tienda).
const TurnoView = {
  calendarioMes: new Date(new Date().getFullYear(), new Date().getMonth(), 1),

  renderCalendario(turnos) {
    const cont = document.getElementById("mis-turnos-calendar");
    if (!cont) return;
    const anio = this.calendarioMes.getFullYear();
    const mes = this.calendarioMes.getMonth();
    const titulo = this.calendarioMes.toLocaleDateString("es-AR", { month: "long", year: "numeric" });
    const offset = (new Date(anio, mes, 1).getDay() + 6) % 7;
    const diasMes = new Date(anio, mes + 1, 0).getDate();
    const pad = (n) => String(n).padStart(2, "0");

    const porDia = {};
    turnos.forEach((t) => {
      (porDia[t.fecha] = porDia[t.fecha] || []).push(t);
    });

    let celdas = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => `<div class="cal-dow">${d}</div>`).join("");
    for (let i = 0; i < offset; i++) celdas += `<div class="cal-day empty"></div>`;
    for (let d = 1; d <= diasMes; d++) {
      const key = `${anio}-${pad(mes + 1)}-${pad(d)}`;
      const items = (porDia[key] || [])
        .sort((a, b) => a.horario.localeCompare(b.horario))
        .map(
          (t) =>
            `<span class="status cal-turno ${t.estado.toLowerCase()}" title="${FormatView.escapeHtml(t.tiendaNombre)} · ${FormatView.escapeHtml(t.servicio)} · ${t.estado}">${FormatView.hora(t.horario)} ${FormatView.escapeHtml(t.tiendaNombre)}</span>`
        )
        .join("");
      celdas += `<div class="cal-day"><span class="cal-num">${d}</span>${items}</div>`;
    }

    cont.innerHTML = `
      <div class="cal-header">
        <button type="button" class="icon-button" data-cal="prev" title="Mes anterior">‹</button>
        <strong>${titulo}</strong>
        <button type="button" class="icon-button" data-cal="next" title="Mes siguiente">›</button>
      </div>
      <div class="cal-grid">${celdas}</div>
      <div class="cal-legend">
        ${["PENDIENTE", "ACEPTADO", "REALIZADO", "RECHAZADO", "CANCELADO"]
          .map((e) => `<span class="status ${e.toLowerCase()}">${e}</span>`)
          .join("")}
      </div>`;
    cont.querySelectorAll("[data-cal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.calendarioMes = new Date(anio, mes + (btn.dataset.cal === "next" ? 1 : -1), 1);
        this.renderCalendario(turnos);
      });
    });
  },

  renderMisTurnos(contenedor, turnos, onCancelar) {
    this.renderCalendario(turnos);
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
          <strong>${FormatView.escapeHtml(turno.tiendaNombre)}</strong>
          <span>${turno.fecha} ${FormatView.hora(turno.horario)} · ${FormatView.escapeHtml(turno.servicio)}</span>
        </div>
        <span class="status ${turno.estado.toLowerCase()}">${turno.estado}</span>
        ${turno.estado === "PENDIENTE" || turno.estado === "ACEPTADO" ? '<button class="icon-button remove" title="Cancelar turno">×</button>' : ""}
      `;
      const cancelBtn = row.querySelector(".remove");
      if (cancelBtn) cancelBtn.addEventListener("click", () => onCancelar(turno));
      contenedor.appendChild(row);
    });
  },

  renderResumen(resumen) {
    document.getElementById("admin-resumen").innerHTML = `
      <article><span class="metric-label">Pendientes</span><strong>${resumen.pendientes}</strong></article>
      <article><span class="metric-label">Aceptados</span><strong>${resumen.aceptados}</strong></article>
      <article><span class="metric-label">Realizados</span><strong>${resumen.realizados}</strong></article>
    `;
  },

  renderAgenda(contenedor, turnos, onEstado) {
    if (turnos.length === 0) {
      contenedor.innerHTML = `<p class="empty-state">No hay turnos con este filtro.</p>`;
      return;
    }
    contenedor.innerHTML = "";
    turnos.forEach((turno) => {
      const row = document.createElement("article");
      row.className = "turno-row";
      const acciones =
        turno.estado === "PENDIENTE"
          ? `<button class="button primary" data-accion="ACEPTADO">Aceptar</button><button class="button" data-accion="RECHAZADO">Rechazar</button>`
          : turno.estado === "ACEPTADO"
            ? `<button class="button primary" data-accion="REALIZADO">Marcar realizado</button><button class="button" data-accion="CANCELADO">Cancelar</button>`
            : "";
      row.innerHTML = `
        <div>
          <strong>${FormatView.escapeHtml(turno.clienteNombre)}</strong>
          <span>${turno.fecha} ${FormatView.hora(turno.horario)} · ${FormatView.escapeHtml(turno.servicio)}</span>
        </div>
        <span class="status ${turno.estado.toLowerCase()}">${turno.estado}</span>
        <div class="turno-acciones">${acciones}</div>
      `;
      row.querySelectorAll("[data-accion]").forEach((btn) => {
        btn.addEventListener("click", () => onEstado(turno, btn.dataset.accion));
      });
      contenedor.appendChild(row);
    });
  },
};
