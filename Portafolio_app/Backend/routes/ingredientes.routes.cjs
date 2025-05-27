const express = require('express');
const router = express.Router();
const { buscarIngredientes } = require('../controllers/ingredientes.controller.cjs'); // o ingredientes.controller si lo separas

router.get('/buscar', buscarIngredientes);

module.exports = router;
