const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializar Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});

// Importar modelos
const User = require('./user')(sequelize);
const Student = require('./student')(sequelize);
const Term = require('./Term')(sequelize);
const Category = require('./Category')(sequelize);
const Grade = require('./Grade')(sequelize, Student, Term, Category);

// Definir relaciones
User.hasMany(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId' });

Student.hasMany(Grade, { foreignKey: 'studentId' });
Grade.belongsTo(Student, { foreignKey: 'studentId' });

Term.hasMany(Grade, { foreignKey: 'termId' });
Grade.belongsTo(Term, { foreignKey: 'termId' });

Category.hasMany(Grade, { foreignKey: 'categoryId' });
Grade.belongsTo(Category, { foreignKey: 'categoryId' });

// Sincronizar base de datos
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Base de datos sincronizada");
    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
    }
};

syncDatabase();

// Exportar los modelos y la instancia de sequelize
module.exports = {
    Sequelize,
    sequelize,
    User,
    Student,
    Grade,
    Term,
    Category
};


