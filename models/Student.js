const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Student = sequelize.define('Student', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users', // El nombre de la tabla generada
                key: 'id',
            },
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Student; // Devolver el modelo
};

