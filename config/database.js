const { Sequelize } = require('sequelize');
require('dotenv').config();
const mysql = require('mysql2'); 


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    dialectModule: mysql,
    dialectOptions: {
      connectTimeout: 15000, 
    },
    logging: false,
  }
);

console.log('JWT_SECRET:', process.env.JWT_SECRET); 
module.exports = sequelize;
