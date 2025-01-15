const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/users');
const gradesRoutes = require('./routes/Grades');
const categoriesRoutes = require ('./routes/categoriesRoutes');
const nivelesRoutes = require ('./routes/nivelesRoutes');
const periodosRoutes = require('./routes/periodosRoutes');
const authenticateToken = require('./middlewares/authenticateToken');
const protectedRoutes = require('./routes/protectedRoutes');
const crearPersonaYUsuario = require('./routes/crearpersonaRoutes');
const BuscarAlumnos = require('./routes/BuscarAlumRoute');
const Mensajes = require('./routes/messagesRoutes');
const MensajeCurso = require('./routes/messagesCourseRoutes');
const mensajesRoutes = require('./routes/getMsgRoutes'); // O el nombre correcto del archivo de rutas
const subirFormulario = require('./routes/formRoutes');

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
app.use('/api/niveles', nivelesRoutes);
app.use('/api/mensaje', Mensajes);
app.use('/api/mensajeCurso', MensajeCurso);
app.use('/api/getMsg', mensajesRoutes);
app.use('/api/upload-form', subirFormulario);
 


app.get('/api/secure-data', authenticateToken, (req, res) => {
    res.json({ message: 'Datos protegidos', user: req.user });
});

sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT,'0.0.0.0', () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
