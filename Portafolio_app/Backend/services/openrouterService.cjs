// server/services/openrouterService.js
const axios = require("axios");



const API_KEY = "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"; // ⚠️ Guarda esto en variables de entorno en producción



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
