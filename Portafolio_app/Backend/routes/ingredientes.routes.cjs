const express = require('express');
const router = express.Router();
const { buscarIngredientes, listarIngredientes } = require('../controllers/ingredientes.controller.cjs');

router.get('/buscar', buscarIngredientes);
router.get('/', listarIngredientes);
module.exports = router;
