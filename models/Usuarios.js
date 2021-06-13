
const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcryptjs');

const Usuarios = db.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'Email ya registrado'
        },
        validate: {
            isEmail: {
                msg: 'Agrega un Correo Valido'
            },
            notEmpty: {
                msg: 'El Email no puede ir vacio'
            },
        }
        
    },
    password: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    token: {
        type: DataTypes.STRING
    },
    expiracion: {
        type: DataTypes.DATE
    }

},{
    hooks: {
        beforeCreate(usuario) {
            const salt = bcrypt.genSaltSync(10);
            usuario.password = bcrypt.hashSync( usuario.password, salt );
        }
    }
});

// Metodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync( password, this.password );
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;