const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Asistencia', {
    id_asistencia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    studentId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Alumno', 
            key: 'id_alumno',
        },
        allowNull: false,
    },
    classId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Clases', // Nombre de la tabla de clases
            key: 'id_clase',
        },
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Presente', 'Ausente', 'Justificado'),
        allowNull: false,
    },
}, {
    tableName: 'asistencia',
});

module.exports = Attendance;
