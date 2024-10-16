const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Grade', {
        value: {
            type: DataTypes.INTEGER,
            allowNull: false, 
        },
        studentId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Students', 
                key: 'id',
            },
            allowNull: false,
        },
        termId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Terms', 
                key: 'id',
            },
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Categories', 
                key: 'id',
            },
            allowNull: false,
        },
    });
};
