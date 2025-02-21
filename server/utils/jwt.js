const jwt = require('jsonwebtoken');

// Función para generar un token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    {
      usuarioId: usuario.usuarioid, // Usando usuarioId en lugar de _id
      correo: usuario.correo,
      primerNombre: usuario.primer_nombre,
      segundoNombre: usuario.segundo_nombre,
      primerApellido: usuario.primer_apellido,
      segundoApellido: usuario.segundo_apellido,
      telefono: usuario.telefono,
    },
    'clave_secreta',  // Usa una clave secreta más segura en producción
    { expiresIn: '1h' }
  );
};

// Función para verificar un token JWT
const verificarToken = (token) => {
  try {
    return jwt.verify(token, 'clave_secreta');
  } catch (error) {
    return null;
  }
};

module.exports = { generarToken, verificarToken };
