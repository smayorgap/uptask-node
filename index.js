const app = require("./app");

const db = require('./config/database');
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
require('dotenv').config();


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


// Iniciar nuestro servidor
app.listen(port, host, () => {
    console.log(`Servidor corriendo en ${host} con el puerto ${port}`);
});

// Conexion a la base MySql
db.sync().then(() => console.log('Database is connected'))
                    .catch(err => console.log(err));
