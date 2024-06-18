import VeterinarioModel from '../models/VeterinarioModel.js'
import generarJWT from '../helpers/generarJWT.js'
import generarId from '../helpers/generarId.js';
import { sendEmailVerification, sendEmailForgotPassword } from '../helpers/emailRegistro.js'


const registrar = async (req, res) => {

    //validar usuario duplicado por email
    const { email, nombre } = req.body
    const existeUsuario = await VeterinarioModel.findOne({ email })

    if (existeUsuario) {
        const error = new Error("Ya existe un usuario con ese correo")
        return res.status(400).json({ msg: error.message })
    }

    try {

        //guardar nuevo veterinario
        const veterinario = new VeterinarioModel(req.body)
        const vetrinarioGuardar = await veterinario.save()

        //enviar un email de confirmación
        sendEmailVerification(
            {
                email,
                nombre,
                token:vetrinarioGuardar.token,
            }
        )
        res.json(vetrinarioGuardar)

    } catch (error) {
        console.log(error)
    }
};

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario)
}

const confirmar = async (req, res) => {
    //validar token
    const { token } = req.params
    console.log('desde confirmar', token)
    const usuarioConfirmar = await VeterinarioModel.findOne({ token })
    if (!usuarioConfirmar) {
        const error = new Error("Token no válido")
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save()
        res.json({ msg: 'Usuario confirmado correctamente' })
    } catch (error) {
        console.log(error)
    }
}

const autenticar = async (req, res) => {
    const { email, password } = req.body

    //comprobar si el usuario existe
    const usuario = await VeterinarioModel.findOne({ email })

    if (!usuario) {
        const error = new Error("Error en las credenciales")
        return res.status(403).json({ msg: error.message })
    }

    //comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(401).json({ msg: error.message })
    }

    //validar autenticacion del password
    if (await usuario.comprobarPassword(password)) {

        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error("Error en las credenciales")
        return res.status(403).json({ msg: error.message })
    }
}

const recuperarPassword = async (req, res) => {
    const { email } = req.body
    const existeVeterinario = await VeterinarioModel.findOne({ email })

    if (!existeVeterinario) {
        const error = new Error("correo no registrado")
        return res.status(400).json({ msg: error.message })
    }
    try {
        existeVeterinario.token = generarId()
        await existeVeterinario.save()

        //enviar instrucciones al correo para cambiar contraseña
        sendEmailForgotPassword({

            nombre: existeVeterinario.nombre,
            email,
            token: existeVeterinario.token
        })
        res.json({ msg: 'se ha enviado a su correo las instrucciones' })

    } catch (error) {
        console.log(error)
    }

}

const validarToken = async (req, res) => {
    const { token } = req.params

    const tokenValido = await VeterinarioModel.findOne({ token })

    if (!tokenValido) {
        const error = new Error("Token no válido")
        return res.status(400).json({ msg: error.message })
    }

    res.json({ msg: token })
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body

    const veterinario = await VeterinarioModel.findOne({ token })

    if (!veterinario) {
        const error = new Error("Hubo un error al validar el token")
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinario.password = password;
        veterinario.token = null;
        await veterinario.save()

        res.json({ msg: 'password modificado correctamente' })
    } catch (error) {
        console.log(error)
    }

}

const actualizarPerfil = async (req, res) => {

    const veterinario = await VeterinarioModel.findById(req.params.id)

    if (!veterinario) {
        const error = new Error('Hubo un error al editar')
        return res.status(400).json({ msg: error.message })
    }

    const { email } = req.body
    if (veterinario.email !== req.body.email) {
        const existeEmail = await VeterinarioModel.findOne({ email })
        if (existeEmail) {
            const error = new Error("Este email ya existe en APV")
            return res.status(400).json({ msg: error.message })
        }
    }

    try {
        veterinario.nombre = req.body.nombre || veterinario.nombre
        veterinario.email = req.body.email || veterinario.email
        veterinario.telefono = req.body.telefono
        veterinario.web = req.body.web

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {

    //leer los datos
    const { _id } = req.veterinario
    const { actual, nueva } = req.body

    //comprobar que el veterinario exista
    const veterinario = await VeterinarioModel.findById(_id)

    if (!veterinario) {
        const error = new Error("Falló la comprobación del usuario")
        return res.status(400).json({ msg: error.message })
    }

    //comprobar el password
    if (await veterinario.comprobarPassword(actual)) {
        //cambiar el nuevo password
        veterinario.password = nueva

        await veterinario.save()

        res.json({ msg: 'Contraseña actualizada correctamente' })
    } else {

        const error = new Error("La contraseña actual es incorrecta")
        return res.status(400).json({ msg: error.message })
    }
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    recuperarPassword,
    validarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}