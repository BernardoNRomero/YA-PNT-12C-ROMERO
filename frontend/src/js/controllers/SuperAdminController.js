// CONTROLADOR: panel del super administrador (estadisticas y ABM de usuarios).
const SuperAdminController = {
  init() {
    this.configurarEventos();
    this.cargarEstadisticas();
    this.cargarUsuarios();
  },

  async cargarEstadisticas() {
    SuperAdminView.renderEstadisticas(await UsuarioModel.estadisticas());
  },

  async cargarUsuarios() {
    const usuarios = await UsuarioModel.listar();
    SuperAdminView.renderUsuarios(usuarios, {
      onEditar: (usuario) => SuperAdminView.abrirFormulario(usuario),
      onEliminar: async (usuario) => {
        if (!confirm(`¿Eliminar al usuario ${usuario.nombreUsuario}?`)) return;
        await UsuarioModel.eliminar(usuario.id);
        this.cargarUsuarios();
      },
    });
  },

  configurarEventos() {
    const form = document.getElementById("usuario-form");
    document.getElementById("nuevo-usuario-btn").addEventListener("click", () => SuperAdminView.abrirFormulario(null));
    document.getElementById("cancelar-usuario-btn").addEventListener("click", () => (form.hidden = true));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const message = document.getElementById("usuario-message");
      const payload = {
        nombreUsuario: data.nombreUsuario,
        correo: data.correo,
        nombreCompleto: data.nombreCompleto,
        rol: data.rol,
        activo: form.activo.checked,
        password: data.password || null,
      };
      try {
        if (data.id) {
          await UsuarioModel.actualizar(data.id, payload);
        } else {
          await UsuarioModel.crear(payload);
        }
        form.hidden = true;
        this.cargarUsuarios();
      } catch (error) {
        message.textContent = error.message;
      }
    });
  },
};
