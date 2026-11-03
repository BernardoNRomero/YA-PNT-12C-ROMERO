// MODELO: sesion del usuario (JWT + datos basicos), persistida en localStorage.
const SessionModel = {
  KEY_TOKEN: "turnoya_token",
  KEY_USUARIO: "turnoya_usuario",

  token() {
    return localStorage.getItem(this.KEY_TOKEN);
  },

  usuario() {
    return JSON.parse(localStorage.getItem(this.KEY_USUARIO) || "null");
  },

  activa() {
    return Boolean(this.token() && this.usuario());
  },

  guardar(auth) {
    const usuario = { nombreUsuario: auth.nombreUsuario, nombreCompleto: auth.nombreCompleto, rol: auth.rol };
    localStorage.setItem(this.KEY_TOKEN, auth.token);
    localStorage.setItem(this.KEY_USUARIO, JSON.stringify(usuario));
  },

  actualizarNombre(nombreCompleto) {
    const usuario = this.usuario();
    usuario.nombreCompleto = nombreCompleto;
    localStorage.setItem(this.KEY_USUARIO, JSON.stringify(usuario));
  },

  cerrar() {
    localStorage.removeItem(this.KEY_TOKEN);
    localStorage.removeItem(this.KEY_USUARIO);
  },
};
