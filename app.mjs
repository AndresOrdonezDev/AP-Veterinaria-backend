import express from 'express'
import cors from 'cors'
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'


const app = express();
//recibir datos por req.body 
app.use(express.json())

conectarDB()

const dominiosPermitidos = [process.env.FRONTEND_URL, undefined]

const corsOptions = {
    origin: function (origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //el origen del req esta perimitido
            callback(null, true)
        }else{
            callback(new Error("No permitido por CORS"))
        }
    }
}

app.use(cors(corsOptions))

app.use('/api/veterinarios',veterinarioRoutes)
app.use('/api/pacientes',pacienteRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT,()=>{
    console.log(`servidor en puerto ${PORT}`)
})
