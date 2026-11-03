// VISTA: formulario de perfil (comun a cliente y admin de tienda).
const PerfilView = {
  // onGuardar recibe { nombreCompleto, imagenPerfil, passwordActual, passwordNueva } y el elemento de mensaje.
  render(formId, usuario, onGuardar) {
    const form = document.getElementById(formId);
    form.innerHTML = `
      <div class="avatar-row">
        <img class="avatar-preview" id="${formId}-avatar" src="${usuario.imagenPerfil || FormatView.placeholderAvatar()}" alt="Foto de perfil" />
        <label class="button">Cambiar foto
          <input type="file" accept="image/*" id="${formId}-file" hidden />
        </label>
      </div>
      <label>Nombre completo
        <input name="nombreCompleto" type="text" value="${FormatView.escapeHtml(usuario.nombreCompleto)}" required />
      </label>
      <fieldset class="password-fieldset">
        <legend>Cambiar contraseña (opcional)</legend>
        <label>Contraseña actual
          <input name="passwordActual" type="password" />
        </label>
        <label>Contraseña nueva
          <input name="passwordNueva" type="password" minlength="8" />
        </label>
      </fieldset>
      <p class="form-message" id="${formId}-message" role="alert"></p>
      <button class="button primary" type="submit">Guardar cambios</button>
    `;

    const message = document.getElementById(`${formId}-message`);
    let imagenPerfil = usuario.imagenPerfil || null;
    const fileInput = document.getElementById(`${formId}-file`);
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        FormatView.mensaje(message, "La imagen no debe superar los 2 MB.");
        fileInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        imagenPerfil = reader.result;
        document.getElementById(`${formId}-avatar`).src = imagenPerfil;
      };
      reader.readAsDataURL(file);
    });

    form.onsubmit = (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      onGuardar(
        {
          nombreCompleto: data.nombreCompleto,
          imagenPerfil,
          passwordActual: data.passwordActual || null,
          passwordNueva: data.passwordNueva || null,
        },
        message
      );
    };
  },
};
