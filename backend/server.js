// Importación de módulos necesarios
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar configuración del archivo .env
dotenv.config();

// Crear una instancia de Express
const app = express();

//Habilitar CORS
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.0:5500'];

app.use(cors({
    // origin: 'http://127.0.0.0:5500',
    function (origin, callback){
        if (!origin || allowedOrigins.indexOf(origin) !==-1){
            callback(null,true);
        }else { 
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conectado a la base de datos MySQL');
});

// Configuración del middleware de sesión
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Debes usar true si usas HTTPS
}));

// Middleware para manejar mensajes flash
app.use(flash());

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuración de las vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
// const authMiddleware = require('./middlewares/authMiddleware');

// Uso de las rutas
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Ruta para la página principal
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'views', 'login.html'));
});

// Manejo de errores 404
app.use((req, res, next) => {
    res.status(404).send('Página no encontrada');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salio mal!');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV}`);
});

module.exports = db; 