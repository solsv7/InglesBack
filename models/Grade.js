const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Grade', {
        value: {
            type: DataTypes.INTEGER,
            allowNull: false, // Nota del estudiante
        },
        studentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Students', // Asegúrate de que sea el nombre de la tabla
                key: 'id',
            },
            allowNull: false,
        },
        termId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Terms', // Asegúrate de que sea el nombre de la tabla
                key: 'id',
            },
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categories', // Asegúrate de que sea el nombre de la tabla
                key: 'id',
            },
            allowNull: false,
        },
    });
};
