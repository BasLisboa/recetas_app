// server/controllers/chatbotController.js
const { callOpenRouter } = require("../services/openrouterService.cjs");

const historialPorUsuario = {};

async function sendMessage(req, res) {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  // Inicializar historial si no existe
  if (!historialPorUsuario[userId]) {
    historialPorUsuario[userId] = [];
  }

  // Agregar mensaje del usuario
  historialPorUsuario[userId].push({ role: "user", content: message });

  // Construir contexto (últimas 10 interacciones)
  const contexto = historialPorUsuario[userId].slice(-10);

  try {
    // Llamada a la IA
    const respuesta = await callOpenRouter([...contexto]);

    // Agregar respuesta de la IA
    historialPorUsuario[userId].push({ role: "assistant", content: respuesta });

    // Enviar respuesta al frontend
    res.json({ reply: respuesta });
  } catch (error) {
    console.error("Error al llamar a la IA:", error);
    res.status(500).json({ error: "Error al procesar la respuesta del chatbot" });
  }
}

module.exports = { sendMessage };
