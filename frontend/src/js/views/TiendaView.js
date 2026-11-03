// VISTA: tiendas, horarios y detalle. No llama a la API: recibe datos y callbacks del controlador.
const TiendaView = {
  // items: [{ tienda, horarios }]
  renderTarjetas(contenedor, items, { textoBoton, onAccion }) {
    if (items.length === 0) {
      contenedor.innerHTML = `<p class="empty-state">Todavía no hay tiendas disponibles.</p>`;
      return;
    }
    contenedor.innerHTML = "";
    items.forEach(({ tienda, horarios }) => {
      const resumenHorarios =
        horarios.map((h) => `${h.diaSemana} ${FormatView.hora(h.horaInicio)}-${FormatView.hora(h.horaFin)}`).join(", ") ||
        "Sin horarios cargados";
      const card = document.createElement("article");
      card.className = "tienda-card";
      card.innerHTML = `
        <img class="tienda-imagen" alt="Foto de ${FormatView.escapeHtml(tienda.nombre)}" />
        <h3>${FormatView.escapeHtml(tienda.nombre)}</h3>
        <p>${FormatView.escapeHtml(tienda.descripcion || "")}</p>
        <p class="tienda-direccion">${FormatView.escapeHtml(tienda.direccion || "")}</p>
        <p class="tienda-horarios">${FormatView.escapeHtml(resumenHorarios)}</p>
        <button class="button primary tienda-card-reservar" type="button">${FormatView.escapeHtml(textoBoton)}</button>
      `;
      FormatView.imagenConRespaldo(card.querySelector(".tienda-imagen"), tienda.imagenTienda);
      card.querySelector(".tienda-card-reservar").addEventListener("click", () => onAccion(tienda, horarios));
      contenedor.appendChild(card);
    });
  },

  renderError(contenedor, mensaje) {
    contenedor.innerHTML = `<p class="form-message">${FormatView.escapeHtml(mensaje)}</p>`;
  },

  // ---- Detalle y reserva (cliente) ----

  abrirDetalle(tienda, horarios) {
    const dialog = document.getElementById("tienda-detalle-dialog");
    const imagen = document.getElementById("tienda-detalle-imagen");
    const listaHorarios = document.getElementById("tienda-detalle-horarios");
    const form = document.getElementById("tienda-turno-form");

    document.getElementById("tienda-detalle-nombre").textContent = tienda.nombre;
    document.getElementById("tienda-detalle-direccion").textContent = tienda.direccion || "Dirección no informada";
    document.getElementById("tienda-detalle-descripcion").textContent =
      tienda.descripcion || "Esta tienda todavía no agregó una descripción.";
    imagen.alt = `Foto de ${tienda.nombre}`;
    FormatView.imagenConRespaldo(imagen, tienda.imagenTienda);

    listaHorarios.replaceChildren();
    if (horarios.length === 0) {
      const item = document.createElement("li");
      item.textContent = "Sin horarios cargados";
      listaHorarios.appendChild(item);
    } else {
      horarios.forEach((horario) => {
        const item = document.createElement("li");
        item.textContent = `${horario.diaSemana}: ${FormatView.hora(horario.horaInicio)}–${FormatView.hora(horario.horaFin)}`;
        listaHorarios.appendChild(item);
      });
    }

    form.reset();
    form.dataset.tiendaId = tienda.id;
    form.elements.fecha.min = FormatView.fechaLocalISO();
    FormatView.mensaje(document.getElementById("tienda-turno-message"), "");
    dialog.showModal();
  },

  // ---- Administrador de tienda ----

  renderHorarios(contenedor, horarios, onEliminar) {
    if (horarios.length === 0) {
      contenedor.innerHTML = `<p class="empty-state">Todavía no cargaste horarios de atención.</p>`;
      return;
    }
    contenedor.innerHTML = "";
    horarios.forEach((horario) => {
      const row = document.createElement("article");
      row.className = "turno-row";
      row.innerHTML = `
        <div><strong>${horario.diaSemana}</strong><span>${FormatView.hora(horario.horaInicio)} a ${FormatView.hora(horario.horaFin)}</span></div>
        <button class="icon-button remove" title="Eliminar horario">×</button>
      `;
      row.querySelector(".remove").addEventListener("click", () => onEliminar(horario));
      contenedor.appendChild(row);
    });
  },

  renderMiTienda(tienda) {
    const form = document.getElementById("tienda-form");
    form.nombre.value = tienda.nombre;
    form.descripcion.value = tienda.descripcion || "";
    form.direccion.value = tienda.direccion || "";
    form.dataset.imagenTienda = tienda.imagenTienda || "";
    this.mostrarImagen(tienda.imagenTienda);
  },

  mostrarImagen(imagen) {
    FormatView.imagenConRespaldo(document.getElementById("tienda-imagen-preview"), imagen);
  },
};
