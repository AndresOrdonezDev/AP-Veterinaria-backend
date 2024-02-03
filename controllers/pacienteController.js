import PacienteModel from "../models/PacienteModel.js"

const agregarPaciente = async (req, res)=>{

    const paciente = new PacienteModel(req.body)
    paciente.veterinario = req.veterinario._id

    try {
        const pacienteAlmacenado = await paciente.save()
        res.json({pacienteAlmacenado})

    } catch (error) {
        console.log(error)
    }
    
}

const obtenerPacientes = async (req, res)=>{
    const pacientes = await PacienteModel.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes)
}

const obtenerPaciente = async (req, res)=>{
    const {id} = req.params

    const paciente = await PacienteModel.findById(id)

    if(!paciente){
        return res.json({msg : 'Paciente no encontrado'})
    }

    if(paciente.veterinario._id.toString() ==! req.veterinario._id.toString()){
       
        return res.json({ msg : "Acción no permitida"})
    } 

    res.json({paciente})
    
}
const actualizarPaciente = async (req, res)=>{

    const {id} = req.params
    const paciente = await PacienteModel.findById(id)

    if(!paciente){
        return res.json({msg : 'Paciente no encontrado'})
    }

    if(paciente.veterinario._id.toString() ==! req.veterinario._id.toString()){
       
        return res.json({ msg : "Acción no permitida"})
    } 
    
    //Actualizar paciente
    paciente.nombre = req.body.nombre || paciente.nombre
    paciente.propietario = req.body.propietario || paciente.propietario
    paciente.telefono = req.body.telefono || paciente.telefono
    paciente.fecha_registro = req.body.fecha_registro || paciente.fecha_registro
    paciente.sintomas = req.body.sintomas || paciente.sintomas

    try {
        const pacienteActualizado = await paciente.save();
        res.json({pacienteActualizado})      
    } catch (error) {
        console.log(error)
    }
   
}


const eliminarPaciente = async (req, res)=>{
    const {id} = req.params
    const paciente = await PacienteModel.findById(id)

    if(!paciente){
        return res.json({msg : 'Paciente no encontrado'})
    }

    if(paciente.veterinario._id.toString() ==! req.veterinario._id.toString()){
       
        return res.json({ msg : "Acción no permitida"})
    } 

    try {
        await paciente.deleteOne()
        res.json({msg: 'Paciente eliminado corectamente'})
    } catch (error) {
        console.log(error)
    }
}

export{
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}
