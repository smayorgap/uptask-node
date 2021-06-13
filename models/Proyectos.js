const { DataTypes } = require('sequelize');

const db = require('../config/database');
const slug = require('slug');
const shortid = require('shortid');

const Proyectos = db.define('proyectos', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING
    },
    url: DataTypes.STRING
}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`
        }
    }
});

module.exports = Proyectos;

