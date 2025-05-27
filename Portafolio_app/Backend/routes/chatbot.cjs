// server/routes/chatbot.js
const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controllers/chatbotController.cjs");

router.post("/message", sendMessage);

module.exports = router;
