const db = require('../config/db.cjs');

async function obtenerPasos(req, res) {
  const { id_receta } = req.params;

  if (!id_receta) {
    return res.status(400).json({ message: 'Falta id_receta en la URL' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id_paso, id_recetas, nombre_parte, numero_paso,
              descripcion_paso, duracion_paso
       FROM pasos_recetas
       WHERE id_recetas = ?
       ORDER BY numero_paso`,
      [id_receta]
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Error al obtener pasos de receta:', err);
    res.status(500).json({ message: 'Error al obtener pasos de la receta' });
  }
}

module.exports = { obtenerPasos };
