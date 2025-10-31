document.addEventListener("DOMContentLoaded", async () => {
  const API_BASE_URL = "http://localhost:4002";
  const token = localStorage.getItem("token");

  //Si no hay token → redirigir al login
  if (!token) {
    console.log("No hay token en localStorage → redirigiendo al login");
    window.location.href = "admin-login.html";
    return;
  }

  //Verificar si el token sigue siendo válido
  async function verifyToken() {
    try {
      console.log("Verificando token...");
      const res = await fetch(`${API_BASE_URL}/images/all`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      console.log("Resultado verificación:", res.status);

      if (res.status === 401 || res.status === 403 || !res.ok) {
        console.warn("Token inválido o expirado.");
        localStorage.removeItem("token");
        window.location.href = "admin-login.html";
        return false;
      }

      console.log("Token válido ✅");
      return true;
    } catch (err) {
      console.error("Error verificando token:", err);
      localStorage.removeItem("token");
      window.location.href = "admin-login.html";
      return false;
    }
  }

  // Inicializa el panel si el token es válido
  const valid = await verifyToken();
  if (!valid) return;

  // Mostrar mensaje o inicializar gestión
  console.log("Token válido, cargando gestión de imágenes...");

  //Botón de Cerrar Sesión
  const logoutBtn = document.createElement("button");
  logoutBtn.textContent = "Cerrar sesión";
  logoutBtn.style = `
    position: fixed;
    top: 20px;
    right:40px;
    background-color: #ffffffff;
    color: black;
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
    z-index: 9999;
  `;
  logoutBtn.onmouseenter = () =>
    (logoutBtn.style.backgroundColor = "#eaebffff");
  logoutBtn.onmouseleave = () =>
    (logoutBtn.style.backgroundColor = "#ffffffff");
  logoutBtn.onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "admin-login.html";
  };

  document.body.appendChild(logoutBtn);
});
