//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: crear receta Coockwell                                            */
//* servicio: Api receta crear router                                           */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 01-05-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES                                                              */
//*******************************************************************************/
//*******************************************************************************/

const express = require('express');
const router = express.Router();
const crearRecetaController = require('../controllers/crearReceta.controller.cjs');

//log
router.post('/', crearRecetaController.crearReceta);

module.exports = router;