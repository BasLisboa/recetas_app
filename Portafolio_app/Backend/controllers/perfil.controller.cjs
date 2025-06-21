const db = require('../config/db.cjs');
const { calcularNutricional } = require('./nutricional.controller.cjs');

async function obtenerCliente(req, res) {
  console.log('📥 Entró a obtenerCliente (backend)');

  const usuarioId = req.query.id_usuario;

  if (!usuarioId) {
    return res.status(400).json({ message: 'Falta usuarioId en query' });
  }

  const sql = 'SELECT * from cliente where id_usuario = ?';
  const values = [usuarioId];

  try {
    const [results] = await db.query(sql, values);
    console.log('✅ Datos cliente obtenidos:', results);
    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Error al obtener datos cliente:', err);
    return res.status(500).json({ message: 'Error al obtener datos cliente' });
  }
}

async function obtenerResumenNutricional(req, res) {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }

  try {
    const [rows] = await db.query(
      'SELECT id_recetas FROM recetas WHERE id_usuario_creador = ?',
      [userId]
    );

    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalGrasas = 0;

    for (const row of rows) {
      const resumen = await calcularNutricional(row.id_recetas);
      totalCalorias += resumen.totales.totalCalorias;
      totalProteinas += resumen.totales.totalProteinas;
      totalGrasas += resumen.totales.totalGrasas;
    }

    res.json({
      totalCalorias: parseFloat(totalCalorias.toFixed(2)),
      totalProteinas: parseFloat(totalProteinas.toFixed(2)),
      totalGrasas: parseFloat(totalGrasas.toFixed(2))
    });
  } catch (error) {
    console.error('❌ Error al obtener resumen nutricional:', error);
    res.status(500).json({ message: 'Error al obtener resumen nutricional' });
  }
}

async function crearCliente(req, res) {
  console.log('📥 Entró a crearCliente (backend)');
  
  const {
    id_usuario,
    nombre_cliente,
    apellido_cliente,
    peso,
    estatura,
    fecha_nacimiento,
    sexo,
    alergias
  } = req.body;
  console.log('id back: ',id_usuario);
  if (!id_usuario) {
    return res.status(400).json({ message: 'Falta id_usuario' });
  }

  const sql = `
    INSERT INTO cliente 
    (id_usuario,nombre_cliente,apellidos_cliente, peso, estatura, fecha_nacimiento, sexo, alergias) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [id_usuario,nombre_cliente, apellido_cliente                   , peso, estatura, fecha_nacimiento, sexo, alergias];

  try {
    const [result] = await db.query(sql, values);
    console.log('✅ Cliente insertado:', result);
    res.status(201).json({ id_cliente: result.insertId });
  } catch (err) {
    console.error('❌ Error al crear cliente:', err);
    return res.status(500).json({ message: 'Error al crear cliente' });
  }
}

async function actualizarCliente(req, res) {
  console.log('📥 Entró a actualizarCliente (backend)');

  const id_cliente = req.params.id_cliente;
  const campos = req.body;

  if (!id_cliente) {
    return res.status(400).json({ message: 'Falta id_cliente' });
  }

  if (Object.keys(campos).length === 0) {
    return res.status(400).json({ message: 'No hay campos para actualizar' });
  }

  // Construir la consulta SQL dinámicamente
  const setStatements = [];
  const values = [];

  for (const campo in campos) {
    if (campo === 'fecha_nacimiento') {
      // Convertir a formato YYYY-MM-DD
      const fecha = new Date(campos[campo]);
      if (!isNaN(fecha)) {
        campos[campo] = fecha.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      }
    }
    setStatements.push(`${campo} = ?`);
    values.push(campos[campo]);
  } 


  const sql = `UPDATE cliente SET ${setStatements.join(', ')} WHERE id_cliente = ?`;
  values.push(id_cliente);

  try {
    const [result] = await db.query(sql, values);
    console.log('✅ Cliente actualizado:', result);
    res.status(200).json({ message: 'Cliente actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar cliente:', err);
    res.status(500).json({ message: 'Error al actualizar cliente' });
  }
}



module.exports = {
  obtenerCliente,
  crearCliente,
  actualizarCliente,
  obtenerResumenNutricional
};
