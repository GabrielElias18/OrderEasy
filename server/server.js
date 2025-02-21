const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const cors = require('cors');
const path = require('path'); 
const pool = require('./config/db'); // Nueva conexión a PostgreSQL

// Rutas
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const ingresoRoutes = require('./routes/ventaRoutes');
const egresoRoutes = require('./routes/egresoRoutes');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', // Cambia esto en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Servir archivos estáticos (imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middlewares
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/', categoryRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/ventas', ingresoRoutes);
app.use('/api/egresos', egresoRoutes);

// Iniciar servidor solo si la conexión es exitosa
const PORT = process.env.PORT || 3000;

pool.connect()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
  })
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));
