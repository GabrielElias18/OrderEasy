const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta de registro
router.post('/register', registerUser);

// Ruta de inicio de sesión
router.post('/login', loginUser);

// Ruta protegida (requiere token)
router.get('/perfil', verificarToken, (req, res) => {
  // El middleware verificó el token y adjuntó los datos del usuario
  res.status(200).json({ mensaje: 'Ruta protegida accedida con éxito', usuario: req.usuario });
});

module.exports = router;
