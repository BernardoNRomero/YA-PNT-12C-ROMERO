// CONTROLADOR: panel privado (app.html). Exige sesion, carga la plantilla del rol y delega en su controlador.
const AppController = {
  PANELES: {
    CLIENTE: { plantilla: "templates/cliente.html", controlador: () => ClienteController },
    ADMIN: { plantilla: "templates/admin.html", controlador: () => TiendaAdminController },
    SUPER_ADMIN: { plantilla: "templates/superadmin.html", controlador: () => SuperAdminController },
  },

  async init() {
    if (!SessionModel.activa()) {
      window.location.href = PAGINAS.login;
      return;
    }
    const usuario = SessionModel.usuario();
    const panel = this.PANELES[usuario.rol];
    if (!panel) {
      this.cerrarSesion();
      return;
    }

    const [header, contenido] = await Promise.all([
      fetch("templates/header.html").then((r) => r.text()),
      fetch(panel.plantilla).then((r) => r.text()),
    ]);
    document.getElementById("app-header").outerHTML = header;
    document.getElementById("app-main").innerHTML = contenido;

    document.getElementById("logout-btn").addEventListener("click", () => this.cerrarSesion());
    this.mostrarUsuario();
    this.initTabs();
    panel.controlador().init();
  },

  mostrarUsuario() {
    const usuario = SessionModel.usuario();
    document.getElementById("user-name").textContent = `${usuario.nombreCompleto} (${usuario.rol})`;
  },

  cerrarSesion() {
    SessionModel.cerrar();
    window.location.href = PAGINAS.inicio;
  },

  initTabs() {
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
  },
};

AppController.init();
