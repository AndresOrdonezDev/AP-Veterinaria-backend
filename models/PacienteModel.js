import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import generarId from '../helpers/generarId.js';

const pacienteSchema = mongoose.Schema({

    nombre:{
        type:String,
        required: true
    },
    propietario:{
        type:String,
        required: true
    },
    telefono:{
        type:String,
        required: true
    },
    fecha_registro:{
        type:Date,
        required: true,
        default:Date.now()
    },
    sintomas:{
        type:String,
        required: false
    },
    veterinario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Veterinarios'
    }

},{
    timestamps:true,
});

const Paciente = mongoose.model("Pacientes",pacienteSchema)

export default Paciente
