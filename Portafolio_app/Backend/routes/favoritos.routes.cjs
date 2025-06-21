const express = require('express');
const router = express.Router();
const { agregarFavorito, obtenerFavoritos, eliminarFavorito } = require('../controllers/favoritos.controller.cjs');

router.post('/', agregarFavorito);
router.get('/', obtenerFavoritos);
router.delete('/:idReceta', eliminarFavorito);
module.exports = router;