
const db = require('../config/db.cjs');


async function crearReceta(req, res){
  console.log("entro a crearReceta en backend");
  
  const { nombre_receta, tiempo, descripcion_receta, id_tipo_creador, id_usuario_creador, imagen_url } = req.body;
  console.log('➡️ Datos recibidos:', { nombre_receta, tiempo, descripcion_receta, id_tipo_creador, id_usuario_creador, imagen_url });

  if (!nombre_receta || !tiempo || !descripcion_receta || !id_tipo_creador || !id_usuario_creador || !imagen_url) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
      await subirReceta(nombre_receta, tiempo, descripcion_receta, id_tipo_creador, id_usuario_creador);   
      
      const results = await consultarID(nombre_receta, tiempo, id_tipo_creador, id_usuario_creador);

      if (!results || results.length === 0) {
        return res.status(404).json({ message: 'Receta no encontrada después de crear' });
      }

      const id = results[0].id_recetas;

      await subirImagen(imagen_url, id , nombre_receta);

      res.status(201).json({ success: true });     
      console.log('✅ receta guardada correctamente');
  } catch (error) {
      console.error('❌ Error al crear receta en base de datos:', error);
      res.status(500).json({ error: 'Error interno al guardar receta', details: error.message });
  }
}
  




async function subirReceta(nombre_receta, tiempo, descripcion_receta, id_tipo_creador, id_usuario_creador) {
    
    try {
        const [results] = await db.query(
            `INSERT INTO recetas (nombre_receta, tiempo, descripcion_receta, id_valoracion ,id_tipo_creador, id_usuario_creador)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [nombre_receta, tiempo, descripcion_receta, 0 ,id_tipo_creador, id_usuario_creador]);
    } catch (error) {
        console.error('❌ Error al SUBIR RECETA en base de datos:', error);
    }
    
}





async function subirImagen(url, id, nom_receta){
  try {
    const [results] = await db.query(
      `INSERT INTO imagenes (nombre_imagen, tipo_imagen, datos, ruta_imagen, id_recetas)
       VALUES (?, ?, ?, ?, ?)`,
      [nom_receta, 'image/png', null, url, id]
    );

    console.log('✅ Imagen guardada correctamente');
  } catch (error) {
    console.error('❌ Error al subir imagen:', error);
    throw error;
  }
}






async function consultarID(nombre_receta, tiempo, id_tipo_creador, id_usuario_creador){
  try {
    const [results] = await db.query(
      `SELECT id_recetas FROM recetas WHERE nombre_receta = ? and tiempo = ? and id_tipo_creador = ? and id_usuario_creador = ?`,
      [nombre_receta, tiempo ,id_tipo_creador, id_usuario_creador]
    );
    return results;
  } catch (error) {
    console.error('❌ Error al consultar ID:', error);
    throw error; // para que lo capture el catch en crearReceta
  }
}


module.exports = {
    crearReceta,
    subirImagen,
    consultarID,
    subirReceta
};