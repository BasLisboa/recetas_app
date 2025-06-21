const db = require('../config/db.cjs');

async function agregarFavorito(req, res) {
  const { id_usuario, id_receta } = req.body;

  if (!id_usuario || !id_receta) {
    return res.status(400).json({ message: 'Faltan datos en la solicitud' });
  }

  try {
    const [rows] = await db.query(
      'SELECT 1 FROM recetas_favoritas WHERE id_usuario = ? AND id_recetas = ? LIMIT 1',
      [id_usuario, id_receta]
    );

    if (rows.length > 0) {
      return res.status(409).json({ message: 'receta ya existe en tus recetas' });
    }

    await db.query(
      'INSERT INTO recetas_favoritas (id_usuario, id_recetas) VALUES (?, ?)',
      [id_usuario, id_receta]
    );

    return res.status(201).json({ message: 'Receta agregada a favoritos' });
  } catch (error) {
    console.error('Error al agregar favorito:', error);
    return res.status(500).json({ message: 'Error interno al agregar favorito' });
  }
}

async function obtenerFavoritos(req, res) {
  const { id_usuario } = req.query;
  if (!id_usuario) {
    return res.status(400).json({ message: 'Falta id_usuario en query' });
  }

  const sql = `
    SELECT r.id_recetas, r.nombre_receta, r.tiempo, r.descripcion_receta,
           COALESCE(MAX(img.ruta_imagen), '') AS imagen_url
    FROM recetas_favoritas rf
    JOIN recetas r ON rf.id_recetas = r.id_recetas
    LEFT JOIN imagenes img ON img.id_recetas = r.id_recetas
    WHERE rf.id_usuario = ?
    GROUP BY r.id_recetas, r.nombre_receta, r.tiempo, r.descripcion_receta
    ORDER BY r.id_recetas
  `;

  try {
    const [results] = await db.query(sql, [id_usuario]);
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error al obtener favoritos:', err);
    res.status(500).json({ message: 'Error al obtener favoritos' });
  }
  
}

async function eliminarFavorito(req, res) {
  console.log('🗑️ Entró a eliminarFavorito (backend)');
  const { idReceta } = req.params;
  const { id_usuario } = req.query;

  if (!idReceta || !id_usuario) {
    return res.status(400).json({ message: 'Faltan idReceta o id_usuario' });
  }

  try {
    const [result] = await db.execute(
      'DELETE FROM recetas_favoritas WHERE id_recetas = ? AND id_usuario = ?',
      [idReceta, id_usuario]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Favorito no encontrado' });
    }

    res.status(200).json({ message: 'Favorito eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar favorito:', err);
    res.status(500).json({ message: 'Error al eliminar favorito' });
  }
}


module.exports = { agregarFavorito, obtenerFavoritos , eliminarFavorito};