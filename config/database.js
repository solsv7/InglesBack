const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});
console.log('JWT_SECRET:', process.env.JWT_SECRET); // Para depuración
module.exports = sequelize;
