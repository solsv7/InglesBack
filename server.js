const express = require('express');
const cors = require('cors');
const db = require('./models/index');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/users');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3001; 
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'OPTIONS'], 
    credentials: true, 
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

db.sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });   
    })
    .catch(err => {
        console.error('Error al sincronizar la base de datos:', err);
    });
