const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Clases', {
    id_clase: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'clases',
});

module.exports = Class;
