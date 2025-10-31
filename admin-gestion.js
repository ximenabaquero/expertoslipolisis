document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:4002/images";
  const cardsContainer = document.getElementById("cardsContainer");
  const addCardBtn =
    document.querySelector(".add-card-btn") ||
    document.querySelector("#addCardBtn");

  let cards = [];

  //Renderizar tarjetas
  function renderCards() {
    cardsContainer.innerHTML = "";

    cards.forEach((card, index) => {
      const cardEl = document.createElement("div");
      cardEl.classList.add("result-card");

      cardEl.innerHTML = `
        <div class="before-after">
          ${createImageSlot("before", card.beforeUrl, index)}
          ${createImageSlot("after", card.afterUrl, index)}
        </div>

        <div class="desc-row">
          <input type="text" placeholder="Descripción..." value="${
            card.description || ""
          }" />
        </div>

        <div class="card-actions">
          <button class="btn-upload" data-index="${index}">Subir Imágenes</button>
          <button class="btn-delete" data-index="${index}">🗑️ Eliminar</button>
        </div>
      `;

      cardsContainer.appendChild(cardEl);
    });
  }

  //Crear recuadro de imagen
  function createImageSlot(type, imageUrl, index) {
    return `
      <div class="image-placeholder ${type}">
        ${
          imageUrl
            ? `
            <div class="image-wrapper">
              <img src="${imageUrl}" alt="${type}" />
              <button class="remove-image" data-type="${type}" data-index="${index}">✕</button>
            </div>
          `
            : `
            <label class="upload-label">
              <span>Subir Imagen</span>
              <input type="file" class="file-input" data-type="${type}" data-index="${index}">
            </label>
          `
        }
      </div>
    `;
  }
  //Cargar tarjetas desde backend
  async function loadCards() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al cargar imágenes");
      const data = await res.json();

      cards = data.map((item) => ({
        id: item.id,
        beforeUrl: item.beforeImage
          ? `data:image/jpeg;base64,${item.beforeImage}`
          : "placeholder.jpg",
        afterUrl: item.afterImage
          ? `data:image/jpeg;base64,${item.afterImage}`
          : "placeholder.jpg",
        description: item.description || "",
      }));

      renderCards();
    } catch (err) {
      console.error("❌ Error cargando tarjetas:", err);
    }
  }

  // Agregar nueva tarjeta vacía
  if (addCardBtn) {
    addCardBtn.addEventListener("click", () => {
      cards.push({ before: null, after: null, description: "" });
      renderCards();
    });
  }

  //Subir archivo local
  cardsContainer.addEventListener("change", (e) => {
    if (e.target.matches(".file-input")) {
      const index = e.target.dataset.index;
      const type = e.target.dataset.type;
      const file = e.target.files[0];
      if (!file) return;

      cards[index][type] = file;

      // Mostrar preview inmediata
      const reader = new FileReader();
      reader.onload = (event) => {
        cards[index][`${type}Url`] = event.target.result;
        renderCards();
      };
      reader.readAsDataURL(file);
    }
  });

  //Eventos de clic (subir / eliminar imagen / eliminar tarjeta)
  cardsContainer.addEventListener("click", async (e) => {
    //Eliminar imagen individual
    if (e.target.classList.contains("remove-image")) {
      const index = e.target.dataset.index;
      const type = e.target.dataset.type;
      cards[index][`${type}`] = null;
      cards[index][`${type}Url`] = null;
      renderCards();
      return;
    }

    //Subir tarjeta al backend
    if (e.target.classList.contains("btn-upload")) {
      const index = e.target.dataset.index;
      const card = cards[index];
      const descInput = e.target
        .closest(".result-card")
        .querySelector("input[type='text']");
      const desc = descInput.value.trim();

      if (!card.before && !card.beforeUrl)
        return alert("⚠️ Debes subir la imagen 'Antes'.");
      if (!card.after && !card.afterUrl)
        return alert("⚠️ Debes subir la imagen 'Después'.");
      if (!desc) return alert("⚠️ Ingresa una descripción.");

      const formData = new FormData();

      //Nombres de campo que el backend espera
      formData.append("beforeImage", card.before);
      formData.append("afterImage", card.after);
      formData.append("description", desc);

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/createimage`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: formData,
        });

        //Leer y mostrar respuesta para debug
        const text = await res.text();
        console.log("Respuesta servidor:", res.status, text);

        if (!res.ok) throw new Error(`Error ${res.status}: ${text}`);

        alert("✅ Imagen guardada correctamente");
        loadCards();
      } catch (err) {
        console.error("❌ Error al subir tarjeta:", err);
        alert(`Error al subir las imágenes.\n(${err.message || err})`);
      }
      return;
    }

    //Eliminar tarjeta completa
    if (e.target.classList.contains("btn-delete")) {
      const index = e.target.dataset.index;
      const card = cards[index];

      if (!card.id) {
        cards.splice(index, 1);
        renderCards();
        return;
      }

      const confirmDelete = confirm(
        "¿Seguro que deseas eliminar esta tarjeta?"
      );
      if (!confirmDelete) return;

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/delete/${card.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al eliminar tarjeta");
        alert("🗑️ Tarjeta eliminada correctamente");
        loadCards();
      } catch (err) {
        console.error("❌ Error al eliminar tarjeta:", err);
        alert("Error al eliminar tarjeta.");
      }
    }
  });
  //Iniciar carga
  loadCards();
});
