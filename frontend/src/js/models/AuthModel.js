// MODELO: autenticacion. Al terminar guarda la sesion.
const AuthModel = {
  async login(datos) {
    const auth = await ApiClient.post("/api/auth/login", datos);
    SessionModel.guardar(auth);
    return auth;
  },

  async registrar(datos) {
    const auth = await ApiClient.post("/api/auth/register", datos);
    SessionModel.guardar(auth);
    return auth;
  },
};
