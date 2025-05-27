const express = require('express');
const router = express.Router();
const {
  listarRecetasDefault,
  buscarRecetasPorIngrediente
} = require('../controllers/recetasadm.controller.cjs');

router.get('/', listarRecetasDefault);
router.get('/buscar', buscarRecetasPorIngrediente);

module.exports = router;
