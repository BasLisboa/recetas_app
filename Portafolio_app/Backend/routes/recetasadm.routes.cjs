const express = require('express');
const router = express.Router();
const {
  listarRecetasDefault,
  buscarRecetasPorIngrediente,
  buscarRecetasPorNombre,
  getDetalleReceta
} = require('../controllers/recetasadm.controller.cjs');

router.get('/', listarRecetasDefault);
router.get('/buscar', buscarRecetasPorIngrediente);
router.get('/:id_recetas', getDetalleReceta);
router.get('/buscar-nombre', buscarRecetasPorNombre);

module.exports = router;
