const express = require('express');
const router = express.Router();
const { obtenerPasos } = require('../controllers/pasosRecetas.controller.cjs');

router.get('/:id_receta', obtenerPasos);

module.exports = router;
