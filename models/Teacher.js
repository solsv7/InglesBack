const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Teacher = sequelize.define('Profesor', {
    id_profesor: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Usuario', 
            key: 'id_usuario',
        },
        allowNull: false,
    },
}, {
    tableName: 'profesor',
});

module.exports = Teacher;
