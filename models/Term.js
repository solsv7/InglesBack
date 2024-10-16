const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Term', {
        name: {
            type: DataTypes.STRING,
            allowNull: false, // Ejemplo: "Primer Trayecto"
        },
    });
};
