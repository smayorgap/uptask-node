const { request, response } = require('express');
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

const home = async ( req = request, res = response ) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
    
};



const formularioProyecto = async ( req, res ) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}



const nuevoProyecto = async ( req = request, res = response ) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    // validar qeu tengamos algo en el input
    const { nombre } = req.body;

    let errores = [];
    
    if(!nombre) {
        errores.push({'texto': 'Agrega un nombre al Proyecto'})
    }

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // insertar en la base
        const usuarioId = res.locals.usuario.id;
        const proyecto = await Proyectos.create({nombre, usuarioId});
        console.log(proyecto); 
        res.redirect('/');
    }

}

const proyectoPorUrl = async (req = request, res= response, next ) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId }});

    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    })

    // Consultar tarea por proyecto
    const tareas = await Tareas.findAll({ 
        where: { proyectoId: proyecto.id }
    });


    if (!proyecto) return next();

    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

const formularioEditar = async (req = request, res = response) => {

    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId }});
    //const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne({
        where: { 
            id: req.params.id,
            usuarioId 
        }
    });

    const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]);
    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    })
    
}


const actualizarProyecto = async ( req = request, res = response) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({ where: { usuarioId }});

    // validar qeu tengamos algo en el input
    const { nombre } = req.body;

    let errores = [];
    
    if(!nombre) {
        errores.push({'texto': 'Agrega un nombre al Proyecto'})
    }

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // insertar en la base
        await Proyectos.update({
            nombre: nombre
        }, {
            where: { id: req.params.id }
        }) 
        res.redirect('/');
    }

}


const eliminarProyecto = async( req = request, res = response ) => {
    

    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

    res.status(200).send('Proyecto eliminado correctamente');
}


module.exports = {
    home,
    formularioProyecto,
    nuevoProyecto,
    proyectoPorUrl,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto
}