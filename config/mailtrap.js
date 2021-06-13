require('dotenv').config();

// configuracion de mailtrap
const email = {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT
}



module.exports = {
    email
}