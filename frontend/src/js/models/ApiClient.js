// MODELO: cliente HTTP de la API REST. Es el unico lugar que habla con el backend.
const ApiClient = {
  async request(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const token = SessionModel.token();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (response.status === 204) return null;

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const body = isJson ? await response.json() : null;
    if (!response.ok) {
      if (response.status === 401 && token) {
        SessionModel.cerrar();
        window.location.href = PAGINAS.login;
      }
      const detalle = body?.errores ? Object.values(body.errores).join(" ") : body?.mensaje;
      throw new Error(detalle || "Ocurrió un error inesperado.");
    }
    return body;
  },

  get(path) {
    return this.request(path);
  },

  post(path, data) {
    return this.request(path, { method: "POST", body: JSON.stringify(data) });
  },

  put(path, data) {
    return this.request(path, { method: "PUT", body: JSON.stringify(data) });
  },

  delete(path) {
    return this.request(path, { method: "DELETE" });
  },
};
