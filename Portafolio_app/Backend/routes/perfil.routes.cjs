const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil.controller.cjs');

router.get('/', perfilController.obtenerCliente);
router.post('/', perfilController.crearCliente);
router.put('/:id_cliente', perfilController.actualizarCliente);
router.get('/nutricional/:userId', perfilController.obtenerResumenNutricional);

module.exports = router;
