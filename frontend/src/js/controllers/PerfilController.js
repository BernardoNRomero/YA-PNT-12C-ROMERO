// CONTROLADOR: perfil del usuario (compartido por cliente y admin de tienda).
const PerfilController = {
  async cargar(formId) {
    try {
      const usuario = await UsuarioModel.perfil();
      PerfilView.render(formId, usuario, (datos, message) => this.guardar(datos, message));
    } catch (error) {
      // El perfil es secundario: si falla, el formulario queda vacio.
    }
  },

  async guardar(datos, message) {
    try {
      await UsuarioModel.actualizarPerfil(datos);
      SessionModel.actualizarNombre(datos.nombreCompleto);
      AppController.mostrarUsuario();
      FormatView.mensaje(message, "Perfil actualizado.", true);
    } catch (error) {
      FormatView.mensaje(message, error.message);
    }
  },
};
