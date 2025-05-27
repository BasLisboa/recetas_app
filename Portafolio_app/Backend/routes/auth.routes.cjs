//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: Auth Coockwell                                                    */
//* servicio: Api auth router                                                   */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 26-04-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES       
// 04/05/2025 se agrega el buscacadr de ingredientes                            */
//*******************************************************************************/
//*******************************************************************************/

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.cjs');

//Registrar
router.post('/register', authController.registerUser);
    
//Iniciar sesión
router.post('/login', authController.loginUser);

// 🔹 Nueva ruta para búsqueda de ingredientes
router.get('/buscar-ingredientes', authController.buscarIngredientes);


module.exports = router;
