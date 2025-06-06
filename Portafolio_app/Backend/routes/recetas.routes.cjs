//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: Recetas Coockwell                                                 */
//* servicio: Api Recetas router                                                */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 07-05-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES                                                              */
//*******************************************************************************/
//*******************************************************************************/

const express = require('express');
const router = express.Router();
const RecetasController = require('../controllers/recetas.controller.cjs');

// Ruta para obtener las recetas
router.get('/', RecetasController.obtenerRecetas);  

// PUT para editar una receta existente
router.put('/:id_receta', RecetasController.editarReceta);

router.delete('/:id_receta', RecetasController.eliminarReceta);


router.get('/:id_receta', RecetasController.obtenerRecetaPorId);



module.exports = router;


