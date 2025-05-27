// controllers/recetasadm.controller.cjs
const db = require('../config/db.cjs');

async function listarRecetasDefault(req, res) {
  const sql = `
    SELECT
      r.id_recetas   AS id,
      r.nombre_receta,
      COALESCE(MAX(img.ruta_imagen), '') AS imagen_url
    FROM recetas r
    LEFT JOIN imagenes img
      ON img.id_recetas = r.id_recetas
    GROUP BY r.id_recetas, r.nombre_receta
    ORDER BY r.id_recetas
    LIMIT 5
  `;
  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al listar recetas por defecto:', err);
    res.status(500).json({ message: 'Error interno' });
  }
}

async function buscarRecetasPorIngrediente(req, res) {
  const ingrediente = req.query.ingrediente?.trim();
  if (!ingrediente) {
    return listarRecetasDefault(req, res);
  }

  const sql = `
    SELECT
      r.id_recetas   AS id,
      r.nombre_receta,
      COALESCE(MAX(img.ruta_imagen), '') AS imagen_url
    FROM recetas r
    JOIN receta_ingrediente ri
      ON r.id_recetas = ri.id_recetas
    JOIN ingredientes ing
      ON ing.id_ingrediente = ri.id_ingrediente
    LEFT JOIN imagenes img
      ON img.id_recetas = r.id_recetas
    WHERE ing.nombre_ingrediente COLLATE utf8_general_ci LIKE ?
    GROUP BY r.id_recetas, r.nombre_receta
    LIMIT 30
  `;
  const values = [`%${ingrediente}%`];

  try {
    const [rows] = await db.query(sql, values);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al buscar recetas:', err);
    res.status(500).json({ message: 'Error interno' });
  }
}

module.exports = {
  listarRecetasDefault,
  buscarRecetasPorIngrediente
};
