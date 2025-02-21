const Usuario = require('../models/userModel');
const { generarToken } = require('../utils/jwt');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const { primerNombre, segundoNombre, primerApellido, segundoApellido, correo, telefono, contraseña } = req.body;

    console.log('📌 Datos recibidos para registro:', { ...req.body, contraseña: '[PROTECTED]' });

    const usuarioExistente = await Usuario.findOne({ where: { correo } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const nuevoUsuario = await Usuario.create({
      primer_nombre: primerNombre,
      segundo_nombre: segundoNombre,
      primer_apellido: primerApellido,
      segundo_apellido: segundoApellido,
      correo,
      telefono,
      contraseña: hashedPassword
    });

    console.log('✅ Usuario registrado:', { ...nuevoUsuario.toJSON(), contraseña: '[PROTECTED]' });

    const token = generarToken(nuevoUsuario.toJSON());

    const usuarioData = {
      id: nuevoUsuario.usuarioid,
      primerNombre: nuevoUsuario.primer_nombre,
      segundoNombre: nuevoUsuario.segundo_nombre,
      primerApellido: nuevoUsuario.primer_apellido,
      segundoApellido: nuevoUsuario.segundo_apellido,
      correo: nuevoUsuario.correo,
      telefono: nuevoUsuario.telefono
    };

    res.status(201).json({ 
      mensaje: 'Usuario registrado exitosamente.', 
      token,
      usuario: usuarioData 
    });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario.', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    console.log('📌 Datos recibidos:', { correo, contraseña: '[PROTECTED]' });

    if (!correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });
    }

    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    console.log('✅ Usuario autenticado:', usuario.correo);

    const token = generarToken(usuario.toJSON());

    const usuarioData = {
      id: usuario.usuarioid,
      primerNombre: usuario.primer_nombre,
      segundoNombre: usuario.segundo_nombre,
      primerApellido: usuario.primer_apellido,
      segundoApellido: usuario.segundo_apellido,
      correo: usuario.correo,
      telefono: usuario.telefono
    };

    res.status(200).json({ 
      mensaje: 'Inicio de sesión exitoso.', 
      token, 
      usuario: usuarioData 
    });
  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión.', error: error.message });
  }
};

module.exports = { registerUser, loginUser };