const { DataTypes } = require('sequelize');

const db = require('../config/database');
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: DataTypes.STRING(100),
    estado: DataTypes.BOOLEAN
});
Tareas.belongsTo(Proyectos);

module.exports = Tareas;