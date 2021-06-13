const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const { email } = require('../config/mailtrap');


// configuracion de transporte de nodemailer con un correo de mailtrap en vez de gmail
let transport = nodemailer.createTransport({
    host: email.host,
    port: email.port,
    auth: {
        user: email.user,
        pass: email.pass
    }
});


// generar HTML
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
    return juice(html);
}




const enviar = async( opciones ) => {

    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.fromString(html);

    let mailOptions = {
        from: 'UpTask <no-reply@uptask.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    };
    
    //transport.sendMail no soporta async/await por ende lo convertimos con UTIL.promisify
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, mailOptions);

}


module.exports = {
    enviar
}