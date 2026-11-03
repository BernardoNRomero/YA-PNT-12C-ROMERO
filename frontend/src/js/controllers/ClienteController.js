// CONTROLADOR: panel del cliente (tiendas, reserva de turnos y mis turnos).
const ClienteController = {
  init() {
    this.configurarReserva();
    this.cargarTiendas();
    this.cargarMisTurnos();
    PerfilController.cargar("perfil-cliente-form");
  },

  async cargarTiendas() {
    const contenedor = document.getElementById("tiendas-list");
    try {
      const items = await TiendaModel.listarConHorarios();
      TiendaView.renderTarjetas(contenedor, items, {
        textoBoton: "Pedir turno",
        onAccion: (tienda, horarios) => TiendaView.abrirDetalle(tienda, horarios),
      });
    } catch (error) {
      TiendaView.renderError(contenedor, error.message);
    }
  },

  async cargarMisTurnos() {
    const contenedor = document.getElementById("mis-turnos-list");
    try {
      const turnos = await TurnoModel.mios();
      TurnoView.renderMisTurnos(contenedor, turnos, async (turno) => {
        try {
          await TurnoModel.cancelar(turno.id);
          this.cargarMisTurnos();
        } catch (error) {
          alert(error.message);
        }
      });
    } catch (error) {
      TiendaView.renderError(contenedor, error.message);
    }
  },

  configurarReserva() {
    const dialog = document.getElementById("tienda-detalle-dialog");
    const form = document.getElementById("tienda-turno-form");
    const fechaInput = form.elements.fecha;
    const message = document.getElementById("tienda-turno-message");

    document.getElementById("cerrar-tienda-dialog").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    fechaInput.addEventListener("focus", () => {
      fechaInput.min = FormatView.fechaLocalISO();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const submitButton = form.querySelector('[type="submit"]');
      submitButton.disabled = true;
      FormatView.mensaje(message, "");

      try {
        await TurnoModel.solicitar({
          tiendaId: Number(form.dataset.tiendaId),
          fecha: data.fecha,
          horario: `${data.horario}:00`,
          servicio: data.servicio,
        });
        FormatView.mensaje(message, "¡Solicitud enviada! La tienda confirmará tu turno.", true);
        form.reset();
        fechaInput.min = FormatView.fechaLocalISO();
        this.cargarMisTurnos();
      } catch (error) {
        FormatView.mensaje(message, error.message);
      } finally {
        submitButton.disabled = false;
      }
    });
  },
};
