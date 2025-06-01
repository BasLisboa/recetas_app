const express = require('express');
const router = express.Router();
const {
  obtenerValoresNutricionales
} = require('../controllers/nutricional.controller.cjs');

router.get('/nutri',obtenerValoresNutricionales);

module.exports = router;