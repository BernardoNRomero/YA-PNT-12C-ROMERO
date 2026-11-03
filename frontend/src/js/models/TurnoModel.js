// MODELO: turnos (vista del cliente y de la tienda).
const TurnoModel = {
  mios() {
    return ApiClient.get("/api/turnos/mios");
  },

  solicitar(datos) {
    return ApiClient.post("/api/turnos", datos);
  },

  cancelar(id) {
    return ApiClient.delete(`/api/turnos/${id}`);
  },

  agenda(estado) {
    return ApiClient.get(`/api/turnos/tienda${estado ? `?estado=${estado}` : ""}`);
  },

  resumen() {
    return ApiClient.get("/api/turnos/tienda/resumen");
  },

  cambiarEstado(id, estado) {
    return ApiClient.put(`/api/turnos/${id}/estado`, { estado });
  },
};
