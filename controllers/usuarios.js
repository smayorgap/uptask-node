const { request, response } = require("express");
const { enviar } = require("../helpers/email");
const Usuarios = require("../models/Usuarios");


const formCrearCuenta = async( req = request, res = response ) => {

    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Upstak'
    })

}

const formIniciarSesion = async( req = request, res = response ) => {

    const { error } = res.locals.mensajes;

    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesion en Upstak',
        error
    })

}



const crearCuenta = async(req = request, res = response) => {

    const { email, password } = req.body;

    try {
        const resp = await Usuarios.create({
            email,
            password
        })

        // crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // crear el objeto de usuario
        const usuario = { email };

        // enviar email
        await enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo: 'confirmar-cuenta'
        });


        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error', error.errors.map(e => e.message));
        res.render('crearCuenta', {
            //mensajes: req.flash(),
            errores: req.flash(),//error.errors,
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        })
    }
}

// cambia el estado de una cuenta
const confirmarCuenta = async( req = request, res = response ) => {

    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // Si no existe el usuario
    if( !usuario ) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}


const formRestablecerPassword = (req = request, res = response ) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contrasenia'
    })
}

module.exports = {
    formCrearCuenta,
    crearCuenta,
    confirmarCuenta,
    formIniciarSesion,
    formRestablecerPassword
}