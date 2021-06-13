const { request, response } = require('express');
const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Op = require('sequelize').Op;
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const { enviar } = require('../helpers/email');


const autenticarUsuario = passport.authenticate('local', {
   successRedirect: '/',
   failureRedirect: '/iniciar-sesion',
   failureFlash: true,
   
});


// Revisar si el usuario esta logeado o no
const usuarioAutenticado = (req = request, res = response, next) => {

    // Si esta logueado, avanza
    if( req.isAuthenticated() ) {
        return next();
    }
    // Caso contrario, redirigir al formulario
    return res.redirect('/iniciar-sesion');

}

// Finzalizar sesion
const cerrarSesion = (req = request, res = response, next) => {

    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}


// Genera token si usuario es valid
const enviarToken = async (req = request, res = response) => {

    // verificar que el usuario existe
    const usuario = await Usuarios.findOne({ where: { email: req.body.email } })

    if ( !usuario ) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion =  Date.now() + 3600000;

    // guardamos en la bd
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    //console.log(resetUrl);
    
    // enviar el correo con el token
    await enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablecer-password'
    });
    
    req.flash('correcto', 'Se envio un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}


const validarToken = async( req = request, res = response ) => {

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // sino encuentra el usuario
    if ( !usuario ) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    // formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contrasenia'
    });
}



// actualizar password
const actualizarPassword = async( req = request, res = response ) => {

    console.log(req.body.password)
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if( !usuario ) {
        req.flash('error', 'No valido');
        res.redirect('/reestablecer');
    }

    //resetear campos
    usuario.token = null;
    usuario.expiracion = null;
    // hashear nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    // guardamos el nuevo password
    await usuario.save();
    
    req.flash('correcto', 'Tu password se ha cambiado correctamente');
    res.redirect('/iniciar-sesion')

}








module.exports = {
    autenticarUsuario,
    usuarioAutenticado,
    cerrarSesion,
    enviarToken,
    validarToken,
    actualizarPassword
}