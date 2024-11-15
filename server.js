const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/users');
const gradesRoutes = require('./routes/Grades');
const categoriesRoutes = require ('./routes/categoriesRoutes');
const periodosRoutes = require('./routes/periodosRoutes');
const authenticateToken = require('./middlewares/authenticateToken');
const protectedRoutes = require('./routes/protectedRoutes');
const crearPersonaYUsuario = require('./routes/crearpersonaRoutes');
const BuscarAlumnos = require('./routes/BuscarAlumRoute');
require('dotenv').config();

const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/periodos',periodosRoutes );
app.use('/api/protected', authenticateToken, protectedRoutes);
app.use('/api/crear-persona-usuario', crearPersonaYUsuario);
app.use('/api/obtenerAlumnos', BuscarAlumnos);


app.get('/api/secure-data', authenticateToken, (req, res) => {
    res.json({ message: 'Datos protegidos', user: req.user });
});

sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
