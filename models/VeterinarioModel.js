import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import generarId from '../helpers/generarId.js';

const veterinarioSchema = mongoose.Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true
    },
    telefono:{
        type:String,
        default:null,
        trim:true
    },
    web:{
        type:String,
        default:null
    },
    token:{
        type:String,
        default:generarId()
    },
    confirmado:{
        type:Boolean,
        default:false
    }
});

//hashear pass
veterinarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//crear los methods para comprobar el password
veterinarioSchema.methods.comprobarPassword = async function (passwordData) {
    return await bcrypt.compare(passwordData, this.password)
}

//crear la entidad de veterinario con los argumentos del schema
const Veterinario = mongoose.model("Veterinarios",veterinarioSchema)

export default Veterinario
