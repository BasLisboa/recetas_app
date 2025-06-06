const express = require('express');
const router = express.Router();
const {
  listarRecetasDefault,
  buscarRecetasPorIngrediente,
  getDetalleReceta
} = require('../controllers/recetasadm.controller.cjs');

router.get('/', listarRecetasDefault);
router.get('/buscar', buscarRecetasPorIngrediente);
router.get('/:id_recetas', getDetalleReceta);

module.exports = router;
