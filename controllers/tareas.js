const { request, response } = require("express");
const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");


const agregarTarea = async (req = request, res = response, next) => {
    //obtenemos el proyecto actual
    const proyecto = await Proyectos.findOne({where: { url: req.params.url }})
    
    // leer el valor del input
    const { tarea } = req.body;

    const estado = false;
    const proyectoId = proyecto.id;

    // Insertar en la bd
    const resultado = await Tareas.create({ tarea, estado, proyectoId})

    if(!resultado) {
        return next();
    }

    // Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}


const cambiarEstadoTarea = async (req = request, res = response, next ) => {

    const { id } = req.params;
    const tarea = await Tareas.findOne({where: { id }});

    // cambiar el estado
    let estado = false;
    if( !tarea.estado ) {
        estado = true;
    }

    tarea.estado = estado;

    const resultado = await tarea.save();

    if( !resultado ) return next();


    res.send('Actualizado..')
}


const eliminarTarea = async( req = request, res = response ) => {

    const { id } = req.params;
    const tarea = await Tareas.destroy({ where: { id } });

    res.status(200).send('Tarea eliminada')
}


module.exports = {
    agregarTarea,
    cambiarEstadoTarea,
    eliminarTarea
}