const express = require('express');
const routes = require('./routes');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// crear aplicacion de express
const app = express();


// DOnde cargar archivos estaticos
app.use(express.static('public'));


// habilitar pug
app.set('view engine', 'pug');


// add carpeta de vistas
app.set('views', path.join(__dirname, './views') );


// leer datos de formularios
app.use(express.urlencoded({extended: true}));
app.use(express.json());


// add flash messages
app.use(flash());

app.use(cookieParser());

// sessiones permite navegar en distintas pagina sin volver a logear
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null
    next();
    console.log(res.locals.usuario)
})

// ruta para el home
app.use( routes );




module.exports = app;
