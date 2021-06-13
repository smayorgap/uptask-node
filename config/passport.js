const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde autenticaremos
const Usuarios = require('../models/Usuarios');


// local Strategy - Login con credenciales propias (user y pass)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password para autenticar
        // Pero podemos sobreescribir con los valores que queremos autenticar asi:
        {
            // campos que tenemos creados en nuestra tb de usuarios
            usernameField: 'email',
            passwordField: 'password' 
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });

                // El usuario existe pero el password es incorrecto
                if( !usuario.verificarPassword(password) ) {
                    return done(null, false, {
                        message: 'Password Incorrecto'
                    });
                }
                // Email existe y password correcto
                return done( null, usuario );

            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {
                    message: 'El email ingresado no existe'
                });
            }
        }

    )
);


// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// desearilzar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;