// MODELO: tiendas y sus horarios de atencion.
const TiendaModel = {
  listar() {
    return ApiClient.get("/api/tiendas");
  },

  horarios(tiendaId) {
    return ApiClient.get(`/api/tiendas/${tiendaId}/horarios`);
  },

  // Devuelve [{ tienda, horarios }] para las tiendas activas.
  async listarConHorarios() {
    const tiendas = await this.listar();
    return Promise.all(tiendas.map(async (tienda) => ({ tienda, horarios: await this.horarios(tienda.id) })));
  },

  miTienda() {
    return ApiClient.get("/api/tiendas/mia");
  },

  actualizarMiTienda(datos) {
    return ApiClient.put("/api/tiendas/mia", datos);
  },

  agregarHorario(datos) {
    return ApiClient.post("/api/horarios", datos);
  },

  eliminarHorario(id) {
    return ApiClient.delete(`/api/horarios/${id}`);
  },
};
