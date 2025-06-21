const express = require('express');
const router = express.Router();
const nutricionalController = require('../controllers/nutricional.controller.cjs');
const { obtenerResumenNutricional } = require('../controllers/perfil.controller.cjs');

router.get('/:id', nutricionalController.obtenerValoresNutricionales);
router.get('/:userId', obtenerResumenNutricional);
module.exports = router;