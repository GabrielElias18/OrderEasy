const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  usuarioid: {  // Cambiado de usuarioId a usuarioid
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  primer_nombre: {  // Cambiado para coincidir con el nombre de la columna
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  segundo_nombre: {  // Cambiado para coincidir con el nombre de la columna
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50]
    }
  },
  primer_apellido: {  // Cambiado para coincidir con el nombre de la columna
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    }
  },
  segundo_apellido: {  // Cambiado para coincidir con el nombre de la columna
    type: DataTypes.STRING(50),
    allowNull: true,
    validate: {
      len: [0, 50]
    }
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  telefono: {
    type: DataTypes.STRING(15),
    allowNull: true,
    validate: {
      is: /^\+?[1-9]\d{1,14}$/ // Formato E.164
    }
  },
  contraseña: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 255]
    }
  }
}, {
  tableName: 'usuarios',
  timestamps: false,
  underscored: true, // Esto ayuda a manejar los nombres de columnas con guiones bajos
});

module.exports = Usuario;