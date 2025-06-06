const express = require('express');
const router = express.Router();
const nutricionalController = require('../controllers/nutricional.controller.cjs');

router.get('/:id', nutricionalController.obtenerValoresNutricionales);

module.exports = router;