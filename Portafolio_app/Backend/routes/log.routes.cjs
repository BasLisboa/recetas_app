//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: LOG Coockwell                                                     */
//* servicio: Api LOG router                                                    */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 01-05-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES                                                              */
//*******************************************************************************/
//*******************************************************************************/

const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller.cjs');

//log
router.post('/log', logController.logSys);

module.exports = router;
