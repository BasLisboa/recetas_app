// server/services/openrouterService.js
const axios = require("axios");

<<<<<<< HEAD
const API_KEY = "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"; // ⚠️ Guarda esto en variables de entorno en producción
=======
const API_KEY = "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"; // ⚠️ Guarda esto en variables de entorno en producción
>>>>>>> 2383b4f043ff09478893cdbf1a8bce035d54f531

async function callOpenRouter(messages) {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  try {
    const res = await axios.post(url, {
      model: "nousresearch/deephermes-3-mistral-24b-preview:free",
      messages: messages
    }, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "X-Title": "ChatBot Angular"
      }
    });

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw new Error("Error en la API de OpenRouter");
  }
}

module.exports = { callOpenRouter };
