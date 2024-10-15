const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});


const User = require('./user'); 

const db = {
    Sequelize,
    sequelize,
    User, 
};


const syncDatabase = async () => {
    try {
        await sequelize.sync(); 
        console.log('Base de datos sincronizada');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

syncDatabase();

module.exports = db;
