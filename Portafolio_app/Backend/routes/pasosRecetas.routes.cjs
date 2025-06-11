const express = require('express');
const router = express.Router();
const PasosRecetasController = require('../controllers/pasosRecetas.controller.cjs');

router.get('/:id_receta', PasosRecetasController.obtenerPasos);
router.put('/:id_receta', PasosRecetasController.actualizarPasos);

module.exports = router;
