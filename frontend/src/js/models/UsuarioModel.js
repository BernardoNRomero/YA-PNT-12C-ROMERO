// MODELO: perfil del usuario autenticado y administracion de usuarios (super admin).
const UsuarioModel = {
  perfil() {
    return ApiClient.get("/api/usuarios/me");
  },

  actualizarPerfil(datos) {
    return ApiClient.put("/api/usuarios/me", datos);
  },

  estadisticas() {
    return ApiClient.get("/api/admin/estadisticas");
  },

  listar() {
    return ApiClient.get("/api/admin/usuarios");
  },

  crear(datos) {
    return ApiClient.post("/api/admin/usuarios", datos);
  },

  actualizar(id, datos) {
    return ApiClient.put(`/api/admin/usuarios/${id}`, datos);
  },

  eliminar(id) {
    return ApiClient.delete(`/api/admin/usuarios/${id}`);
  },
};
