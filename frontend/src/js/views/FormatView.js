// VISTA: utilidades de presentacion compartidas.
const FormatView = {
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  },

  fechaLocalISO(fecha = new Date()) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
  },

  hora(valor) {
    return valor.slice(0, 5);
  },

  placeholderAvatar() {
    return "data:image/svg+xml;utf8," + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#d5ece6"/><text x="50%" y="55%" font-size="26" text-anchor="middle" fill="#006359">?</text></svg>'
    );
  },

  imagenConRespaldo(elemento, imagen) {
    const esImagenBase64 = typeof imagen === "string" && /^data:image\/[\w.+-]+;base64,/i.test(imagen);
    elemento.onerror = () => {
      elemento.onerror = null;
      elemento.src = "assets/images/store-placeholder.svg";
    };
    elemento.src = esImagenBase64 ? imagen : "assets/images/store-placeholder.svg";
  },

  mensaje(elemento, texto, exito = false) {
    elemento.classList.toggle("success", exito);
    elemento.textContent = texto;
  },
};
