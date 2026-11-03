// CONTROLADOR: panel del administrador de tienda (agenda, horarios y datos de la tienda).
const TiendaAdminController = {
  init() {
    this.configurarEventos();
    this.configurarImagen();
    this.cargarAgenda();
    this.cargarHorarios();
    this.cargarMiTienda();
    PerfilController.cargar("perfil-admin-form");
  },

  async cargarAgenda() {
    const estado = document.getElementById("admin-estado-filter").value;
    const contenedor = document.getElementById("admin-agenda-list");
    try {
      TurnoView.renderResumen(await TurnoModel.resumen());
      const turnos = await TurnoModel.agenda(estado);
      TurnoView.renderAgenda(contenedor, turnos, async (turno, nuevoEstado) => {
        try {
          await TurnoModel.cambiarEstado(turno.id, nuevoEstado);
          this.cargarAgenda();
        } catch (error) {
          alert(error.message);
        }
      });
    } catch (error) {
      TiendaView.renderError(contenedor, error.message);
    }
  },

  async cargarHorarios() {
    const tienda = await TiendaModel.miTienda().catch(() => null);
    if (!tienda) return;
    const horarios = await TiendaModel.horarios(tienda.id);
    TiendaView.renderHorarios(document.getElementById("horarios-list"), horarios, async (horario) => {
      await TiendaModel.eliminarHorario(horario.id);
      this.cargarHorarios();
    });
  },

  async cargarMiTienda() {
    try {
      TiendaView.renderMiTienda(await TiendaModel.miTienda());
    } catch (error) {
      // Sin tienda asociada: no deberia pasar para un ADMIN, se ignora.
    }
  },

  configurarEventos() {
    document.getElementById("admin-estado-filter").addEventListener("change", () => this.cargarAgenda());

    document.getElementById("horario-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target));
      const message = document.getElementById("horario-message");
      try {
        await TiendaModel.agregarHorario({
          diaSemana: data.diaSemana,
          horaInicio: `${data.horaInicio}:00`,
          horaFin: `${data.horaFin}:00`,
        });
        FormatView.mensaje(message, "Horario agregado.", true);
        event.target.reset();
        this.cargarHorarios();
      } catch (error) {
        FormatView.mensaje(message, error.message);
      }
    });

    document.getElementById("tienda-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.target));
      const message = document.getElementById("tienda-message");
      try {
        await TiendaModel.actualizarMiTienda({
          nombre: data.nombre,
          descripcion: data.descripcion,
          direccion: data.direccion,
          imagenTienda: event.target.dataset.imagenTienda ?? "",
        });
        FormatView.mensaje(message, "Tienda actualizada.", true);
      } catch (error) {
        FormatView.mensaje(message, error.message);
      }
    });
  },

  configurarImagen() {
    const form = document.getElementById("tienda-form");
    const fileInput = form.elements.imagenTiendaFile;
    const message = document.getElementById("tienda-message");

    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        FormatView.mensaje(message, "La imagen no debe superar los 2 MB.");
        fileInput.value = "";
        return;
      }
      if (!file.type.startsWith("image/")) {
        FormatView.mensaje(message, "Seleccioná un archivo de imagen válido.");
        fileInput.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        form.dataset.imagenTienda = reader.result;
        TiendaView.mostrarImagen(reader.result);
        message.textContent = "";
      };
      reader.onerror = () => FormatView.mensaje(message, "No se pudo leer la imagen seleccionada.");
      reader.readAsDataURL(file);
    });

    document.getElementById("tienda-imagen-remove").addEventListener("click", () => {
      form.dataset.imagenTienda = "";
      fileInput.value = "";
      TiendaView.mostrarImagen(null);
    });
  },
};
