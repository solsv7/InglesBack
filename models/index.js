const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});

// Importamos los modelos
const User = require('./user')(sequelize);
const Student = require('./student')(sequelize);
const Term = require('./Term')(sequelize);
const Category = require('./Category')(sequelize);
const Grade = require('./Grade')(sequelize, Student, Term, Category);

// Definimos relaciones
User.hasMany(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId' });

Student.hasMany(Grade, { foreignKey: 'studentId' });
Grade.belongsTo(Student, { foreignKey: 'studentId' });

Term.hasMany(Grade, { foreignKey: 'termId' });
Grade.belongsTo(Term, { foreignKey: 'termId' });

Category.hasMany(Grade, { foreignKey: 'categoryId' });
Grade.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = {
    Sequelize,
    sequelize,
    User,
    Student,
    Grade,
    Term,
    Category
};


