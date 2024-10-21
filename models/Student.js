const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('alumno', {
    id_alumno: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dni_alumno: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    id_clase: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
}, {
    timestamps: true, 
    freezeTableName: true 
});

module.exports = Student;
