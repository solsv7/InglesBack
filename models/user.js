// models/User.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student'); // Importa el modelo Student
const Profesor = require('./Teacher'); // Importa el modelo Teacher

class User extends Model {}

User.init({
    id_usuario: {  // Clave primaria
        type: DataTypes.INTEGER,
        primaryKey: true,  // Definir como clave primaria
        autoIncrement: true, // Auto incremento habilitado
    },
    id_alumno: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Student,  // Referencia al modelo Student
            key: 'id_alumno',
        },
    },
    id_profesor: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Teacher,  // Referencia al modelo Teacher
            key: 'id_profesor',
        },
    },
    id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'roles',  // Referencia a la tabla 'roles' en la base de datos
            key: 'id_rol',
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'User',  
    tableName: 'usuario',  
    timestamps: true,  
});
module.exports = User;
