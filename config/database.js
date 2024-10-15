const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});

sequelize.authenticate()
.then(() => console.log('Conectado a MySQL correctamente.'))
.catch(err => console.error('Error al conectar a MySQL:', err));

module.exports = sequelize;
