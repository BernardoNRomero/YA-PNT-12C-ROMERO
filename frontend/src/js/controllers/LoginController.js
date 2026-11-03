// CONTROLADOR: pagina de ingreso/registro (login.html).
const LoginController = {
  init() {
    if (SessionModel.activa()) {
      window.location.href = PAGINAS.panel;
      return;
    }

    const rol = document.getElementById("register-rol");
    const tiendaLabel = document.getElementById("register-tienda-label");
    const actualizarTienda = () => (tiendaLabel.hidden = rol.value !== "ADMIN");
    rol.addEventListener("change", actualizarTienda);
    actualizarTienda();

    this.enlazarFormulario("login-form", "login-message", (datos) => AuthModel.login(datos));
    this.enlazarFormulario("register-form", "register-message", (datos) => AuthModel.registrar(datos));
  },

  enlazarFormulario(formId, messageId, accion) {
    document.getElementById(formId).addEventListener("submit", async (event) => {
      event.preventDefault();
      const message = document.getElementById(messageId);
      try {
        await accion(Object.fromEntries(new FormData(event.target)));
        window.location.href = PAGINAS.panel;
      } catch (error) {
        message.textContent = error.message;
      }
    });
  },
};

LoginController.init();
