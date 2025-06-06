const db = require('../config/db.cjs');

async function obtenerPasos(req, res) {
  const { id_receta } = req.params;
  try {
    const [results] = await db.query(
      `SELECT id_paso, id_recetas, nombre_parte, numero_paso, descripcion_paso, duracion_paso
       FROM pasos_recetas
       WHERE id_recetas = ?
       ORDER BY numero_paso`,
      [id_receta]
    );
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Error al obtener pasos de receta:', error);
    res.status(500).json({ message: 'Error al obtener pasos de receta' });
  }
}

module.exports = { obtenerPasos };
