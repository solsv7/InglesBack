const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Student = sequelize.define('Student', {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
            },
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Student; 
};

