const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/studentsRoutes'); 
const authenticateToken = require('./middlewares/authMiddleware'); 

require('dotenv').config();

const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes); 

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
