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

async function actualizarPasos(req, res) {
  const { id_receta } = req.params;
  const { pasos } = req.body;

  if (!Array.isArray(pasos)) {
    return res.status(400).json({ message: 'Formato de pasos no válido' });
  }

  try {
    // Eliminamos los pasos existentes de la receta
    await db.query('DELETE FROM pasos_recetas WHERE id_recetas = ?', [id_receta]);

    // Insertamos los pasos nuevamente en el orden recibido
    for (let i = 0; i < pasos.length; i++) {
      const paso = pasos[i];
      const descripcion = paso.descripcion_paso || paso.descripcion;
      const numero = i + 1;
      await db.query(
        'INSERT INTO pasos_recetas (id_recetas, numero_paso, descripcion_paso) VALUES (?, ?, ?)',
        [id_receta, numero, descripcion]
      );
    }

    res.status(200).json({ message: 'Pasos actualizados correctamente' });
  } catch (error) {
    console.error('❌ Error al actualizar pasos de receta:', error);
    res.status(500).json({ message: 'Error al actualizar pasos de receta' });
  }
}

module.exports = { obtenerPasos, actualizarPasos };
