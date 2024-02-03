import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const conectarDB = async ()=>{
    try {
        //conectar a base de datos de mongoDB
        const db = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`conectado a ${url}`)
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1)
    }
}

export default conectarDB;