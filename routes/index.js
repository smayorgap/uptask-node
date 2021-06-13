const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { home, formularioProyecto, nuevoProyecto, proyectoPorUrl, formularioEditar, actualizarProyecto, eliminarProyecto } = require('../controllers');
const { autenticarUsuario, usuarioAutenticado, cerrarSesion, enviarToken, validarToken, actualizarPassword } = require('../controllers/auth');
const { agregarTarea, cambiarEstadoTarea, eliminarTarea } = require('../controllers/tareas');
const { formCrearCuenta, crearCuenta, formIniciarSesion, formRestablecerPassword, confirmarCuenta } = require('../controllers/usuarios');



router.get('/', usuarioAutenticado, home );
router.get('/nuevo-proyecto', usuarioAutenticado, formularioProyecto );
router.post('/nuevo-proyecto', [
    usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape()
], nuevoProyecto)

router.get('/proyectos/:url', usuarioAutenticado, proyectoPorUrl );


// Actualizar proyecto
router.get('/proyecto/editar/:id', usuarioAutenticado, formularioEditar )

router.post('/nuevo-proyecto/:id', [
    usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape()
], actualizarProyecto)


// Eliminar proyecto
router.delete('/proyectos/:url', usuarioAutenticado, eliminarProyecto);

// Tareas
router.post('/proyectos/:url', usuarioAutenticado, agregarTarea)


// Actualizar tarea
router.patch('/tareas/:id', usuarioAutenticado, cambiarEstadoTarea );

// Eliminar tarea
router.delete('/tareas/:id', usuarioAutenticado, eliminarTarea );


// Crear nueva cuenta
router.get('/crear-cuenta', formCrearCuenta )
router.post('/crear-cuenta', crearCuenta )
router.get('/confirmar/:correo', confirmarCuenta);


// Iniciar sesion
router.get('/iniciar-sesion', formIniciarSesion);
router.post('/iniciar-sesion', autenticarUsuario );


// Cerrar sesion
router.get('/cerrar-sesion', cerrarSesion )


// reestablecer contrasenia
router.get('/reestablecer', formRestablecerPassword);
router.post('/reestablecer', enviarToken );
router.get('/reestablecer/:token', validarToken )
router.post('/reestablecer/:token', actualizarPassword)
module.exports = router;