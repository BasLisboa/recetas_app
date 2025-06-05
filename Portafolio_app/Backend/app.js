const express = require('express');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes.cjs');
const logRoutes = require('./routes/log.routes.cjs');
const recetasRoutes = require('./routes/recetas.routes.cjs');
const ingredientesRoutes = require('./routes/ingredientes.routes.cjs');
const recetasadmRoutes = require('./routes/recetasadm.routes.cjs');
const CrearRecetas = require('./routes/crearReceta.routes.cjs');
const perfilRoutes = require('./routes/perfil.routes.cjs');
const chatbotRoutes = require("./routes/chatbot.cjs");

// Middlewares
app.use(cors());
app.use(express.json());

// -------- SERVIR ARCHIVOS ESTÁTICOS --------
const wwwPath = path.resolve(__dirname, '..', 'frontend', 'www');
console.log('🟢 Sirviendo archivos estáticos desde:', wwwPath);
app.use(express.static(wwwPath));

// Tus rutas API
app.use('/api/auth', authRoutes); 
app.use('/api/logs', logRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/ingredientes', ingredientesRoutes);
app.use('/api/recetasadm', recetasadmRoutes);
app.use('/api/CrearReceta', CrearRecetas);
app.use('/api/perfil', perfilRoutes);
app.use("/api/chatbot", chatbotRoutes);

// Ruta base (opcional)
app.get('/', (req, res) => {
  res.send('¡Backend Express corriendo con MySQL!');
});

// Redirige cualquier ruta que no sea /api/* al index.html de Ionic/Angular
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(wwwPath, 'index.html'));
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
