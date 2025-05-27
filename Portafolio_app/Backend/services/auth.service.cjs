//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: Auth Coockwell                                                    */
//* servicio: Generador de token                                                */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 06-05-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES                                                              */
//*******************************************************************************/
//*******************************************************************************/

const jwt = require('jsonwebtoken');

const JWT_SECRET = 'ksdcvH52NjdRla';

function generarToken(usuario) {
    return jwt.sign(
        {
            id: usuario.id,
            correo: usuario.correo
        },
        JWT_SECRET,
        { expiresIn: '24h' } 
    );
}

module.exports = {
    generarToken
};
