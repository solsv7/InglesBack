const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/users');
const gradesRoutes = require('./routes/Grades');
const categoriesRoutes = require('./routes/categoriesRoutes');
const nivelesRoutes = require('./routes/nivelesRoutes');
const periodosRoutes = require('./routes/periodosRoutes');
const authenticateToken = require('./middlewares/authenticateToken');
const protectedRoutes = require('./routes/protectedRoutes');
const crearPersonaYUsuario = require('./routes/crearpersonaRoutes');
const crearAlumnoExcel = require('./routes/crearAlumnoExcelRoutes');
const crearProfesor = require('./routes/crearProfesorRoutes');
const BuscarAlumnos = require('./routes/BuscarAlumRoute');
const Mensajes = require('./routes/messagesRoutes');
const MensajeCurso = require('./routes/messagesCourseRoutes');
const mensajesRoutes = require('./routes/getMsgRoutes');
const subirFormulario = require('./routes/formRoutes');
const excelRoutes = require('./routes/excelRoutes');
const subirVideo = require('./routes/uploadVidsRoutes');
const obtenerVideos = require('./routes/obtVidsRoutes');
const obtenerInfoPerfil = require('./routes/infoPerfilRoutes');

const horariosRoutes = require('./routes/horariosRoutes');
const clasesRoutes = require('./routes/clasesRoutes');
const acceptFormRoutes = require('./routes/acceptFormRoutes');
const formRoutes = require('./routes/formRoutes');
const clasesAlumnoRoute = require('./routes/clasesAlumnosRoutes');
const asistenciaRoutes = require('./routes/asistencia.js');
const cuotasRoutes = require('./routes/cuotasRoutes.js');
const planesRoutes = require('./routes/planesRoutes.js');

const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

const allowlist = [
  'http://localhost:3000',
  'https://newinglesfront.vercel.app',
  process.env.FRONTEND_URL 
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    try {
      const url = new URL(origin);
      const isVercel = /\.vercel\.app$/i.test(url.hostname);
      if (allowlist.includes(origin) || isVercel) {
        return callback(null, true);
      }
    } catch (_) { /* ignore */ }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(rateLimit({ windowMs: 60 * 1000, max: 50 })); 
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/periodos', periodosRoutes);
app.use('/api/protected', authenticateToken, protectedRoutes);
app.use('/api/crear-persona-usuario', crearPersonaYUsuario);
app.use('/api/crear-alumno-nuevo', crearAlumnoExcel);
app.use('/api/crear-profesor-nuevo', crearProfesor);
app.use('/api/obtenerAlumnos', BuscarAlumnos);
app.use('/api/niveles', nivelesRoutes);
app.use('/api/mensaje', Mensajes);
app.use('/api/mensajeCurso', MensajeCurso);
app.use('/api/getMsg', mensajesRoutes);
app.use('/api/upload-form', subirFormulario);
app.use('/api', excelRoutes);
app.use('/api/upload-vids', subirVideo);
app.use('/api/all-vids', obtenerVideos);
app.use('/api/perf-info', obtenerInfoPerfil);
app.use('/api/horarios', horariosRoutes);
app.use('/api/clases', clasesRoutes);
app.use('/api/aceptarUsuario', acceptFormRoutes);
app.use('/api/obtenerFormularios', formRoutes); 
app.use('/api/clases-alumnos', clasesAlumnoRoute);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/cuotas', cuotasRoutes);

app.get('/api/secure-data', authenticateToken, (req, res) => {
  res.json({ message: 'Datos protegidos', user: req.user });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API Instituto Inglés funcionando',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });
