const express = require('express');
const cors = require('cors');
const db = require('./models/index');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/studentsRoutes'); // Nueva ruta
const gradesRouter = require('./routes/routesGrades');
const categoryRoutes = require('./routes/routesCategory'); 
const termRoutes = require('./routes/routesTerm');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());

// Usar las rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes); 
app.use('/api/grades', gradesRouter);
app.use('/api/categories', categoryRoutes); 
app.use('/api/terms', termRoutes);

// Establecer relaciones entre modelos
const User = db.User;
const Student = db.Student;

// Relación uno a muchos
User.hasMany(Student, { foreignKey: 'userId' });
Student.belongsTo(User, { foreignKey: 'userId' });

db.sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
