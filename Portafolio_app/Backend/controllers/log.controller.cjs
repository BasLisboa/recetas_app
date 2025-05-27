//*******************************************************************************/
//*                                   Cookwell                                  */
//*******************************************************************************/
//* proyecto: log  Coockwell                                                    */
//* servicio: Controlador api log                                               */
//* Desarrollador: Bastian Lisboa (BAS)                                         */
//* Fecha: 26-04-2025                                                           */
//*******************************************************************************/
//* MODIFICACIONES                                                              */
//*******************************************************************************/
//*******************************************************************************/


const db = require('../config/db.cjs');

async function logSys(req, res) {
    console.log('📥 Entró a logSys (backend)');

    const { id_fun, nombre_servicio, mensaje, estado, fecha } = req.body;
    console.log('➡️ Datos recibidos:', { id_fun, nombre_servicio, mensaje, estado, fecha });

    if (!id_fun || !nombre_servicio || !mensaje || !estado || !fecha) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const [results] = await db.query(
            `INSERT INTO log_sys (id_fun, nombre_servicio, mensaje, estado, fecha)
             VALUES (?, ?, ?, ?, ?)`,
            [id_fun, nombre_servicio, mensaje, estado, fecha]
        );
        console.log('✅ Log guardado correctamente');
        res.status(201).json({ success: true });
    } catch (err) {
        console.error('❌ Error al guardar log en base de datos:', err);
        res.status(500).json({ error: 'Error interno al guardar log', details: err.message });
    }
    
}




function obtenerFechaChile() {
  const sysdate = new Date();

  const optionsFecha = { timeZone: 'America/Santiago' };
  const optionsHora = { timeZone: 'America/Santiago', hour12: false };

  const fecha = sysdate.toLocaleDateString('es-CL', optionsFecha); // dd/mm/yyyy
  const hora = sysdate.toLocaleTimeString('es-CL', optionsHora);   // hh:mm:ss

  return `${fecha} ${hora}`;
}



async function guardarLog(log) {
  const { id_fun, nombre_servicio, mensaje, estado } = log;
  const fecha = obtenerFechaChile();

  const query = `
    INSERT INTO log_sys (id_fun, nombre_servicio, mensaje, estado, fecha)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    await db.query(query, [id_fun, nombre_servicio, mensaje, estado, fecha]);
    console.log('✅ Log guardado correctamente');
  } catch (error) {
    console.error('❌ Error al guardar log en servicio:', error);
    throw error;
  }
}



  
module.exports = {
    logSys,
    guardarLog
};