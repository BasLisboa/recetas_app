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
<<<<<<< HEAD

router.delete('/:id_receta', RecetasController.eliminarReceta);
=======
>>>>>>> 2383b4f043ff09478893cdbf1a8bce035d54f531
module.exports = router;


