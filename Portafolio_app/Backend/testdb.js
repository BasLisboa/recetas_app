const db = require('./config/db');

db.query('SELECT 1 + 1 AS resultado', (error, results) => {
  if (error) {
    console.error('Error ejecutando prueba:', error);
    return;
  }
  console.log('Conexión exitosa. Resultado de prueba:', results[0].resultado);

});