const db = require('../config/db.cjs');

function buscarIngredientes(req, res) {
  const { texto } = req.query;
  console.log('📥 [BACKEND] Texto recibido del frontend:', texto);
  
  if (!texto) {
    console.log('❌ [BACKEND] Texto vacío');
    return res.status(400).json({ message: 'Texto de búsqueda requerido' });
  }

  const sql = `
    SELECT nombre_ingrediente 
    FROM ingredientes 
    WHERE nombre_ingrediente COLLATE utf8_general_ci LIKE ? 
    LIMIT 30
  `;
  const values = [`%${texto}%`];
  console.log('🔎 [BACKEND] SQL ejecutada:', sql.trim());
  console.log('🔎 [BACKEND] Valores:', values);

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error('❌ [BACKEND] Error al ejecutar query:', error);
      return res.status(500).json({ message: 'Error en la búsqueda' });
    }

    console.log('✅ [BACKEND] Resultados:', results);
    const nombres = results.map(row => row.nombre_ingrediente);
    res.status(200).json(nombres);
  });

  console.log('🔍 Petición recibida para texto:', texto);
}
module.exports = {
  buscarIngredientes
};
