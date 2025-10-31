const API_URL = "http://localhost:4002/api/v1/auth/authenticate";

document
  .getElementById("adminLoginForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.style.display = "none";
    errorMsg.textContent = "";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Mostrar status y cuerpo para depuración
      console.log("Login status:", res.status);
      const data = await res.json().catch(() => null);
      console.log("Login body:", data);

      if (!res.ok) {
        const serverMsg =
          data?.message ||
          data?.error ||
          JSON.stringify(data) ||
          "Credenciales incorrectas";
        throw new Error(serverMsg);
      }

      // Buscar token
      const token =
        data?.access_token ||
        data?.accessToken ||
        data?.token ||
        data?.jwt ||
        data?.data?.access_token ||
        data?.data?.token;

      if (!token) {
        console.warn("Token no encontrado en la respuesta:", data);
        throw new Error(
          "El servidor no devolvió un token. Revisa la respuesta en Network."
        );
      }

      // Guardar token
      localStorage.setItem("token", token);
      localStorage.setItem("adminEmail", email);
      console.log("Token guardado en localStorage:", token);

      // Redirigir al panel
      window.location.href = "admin-panel.html";
    } catch (err) {
      console.error("Error login:", err);
      errorMsg.style.display = "block";
      errorMsg.textContent = err.message || "Error en el login";
    }
  });
