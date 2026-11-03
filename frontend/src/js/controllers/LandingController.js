// CONTROLADOR: landing publica (index.html). Muestra las tiendas; cualquier accion lleva al login.
const LandingController = {
  async init() {
    this.configurarCabecera();
    await this.cargarTiendas();
  },

  destinoAccion() {
    return SessionModel.activa() ? PAGINAS.panel : PAGINAS.login;
  },

  configurarCabecera() {
    if (!SessionModel.activa()) return;
    document.getElementById("nav-guest").hidden = true;
    document.getElementById("nav-user").hidden = false;
    document.getElementById("nav-panel").href = PAGINAS.panel;
    document.getElementById("landing-user-name").textContent = SessionModel.usuario().nombreCompleto;
    document.getElementById("landing-logout").addEventListener("click", () => {
      SessionModel.cerrar();
      window.location.reload();
    });
  },

  async cargarTiendas() {
    const contenedor = document.getElementById("tiendas-list");
    try {
      const items = await TiendaModel.listarConHorarios();
      TiendaView.renderTarjetas(contenedor, items, {
        textoBoton: "Pedir turno",
        onAccion: () => (window.location.href = this.destinoAccion()),
      });
    } catch (error) {
      TiendaView.renderError(contenedor, "No pudimos cargar las tiendas en este momento.");
    }
  },
};

LandingController.init();
