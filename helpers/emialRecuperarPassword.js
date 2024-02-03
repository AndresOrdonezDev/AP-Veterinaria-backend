import 'dotenv/config';
import { Resend } from 'resend';


const emailRecuperar = async (datos) => {
    try {

        const resend = new Resend(process.env.RESEND_KEY);

        const { email, nombre, token } = datos;
        console.log(email)

        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [`${email}`],
            subject: 'Restablece tu contraseña en APV',
            html: `<p> Hola ${nombre}, vamos a cambiar tu contraseña en APV. </p> 
        <p>Para cambiar tu contraseña, debes dar click en el siguiente enlace:
          <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Crear nueva contaseña</a>
        </p>
        <p>¿No creaste esta cuenta? Puedes ignorar este mensaje.</p>
      `
        });

        if (error) {
            return console.error({ error });
        }


    } catch (error) {
        console.log(error);
    }
}

export default emailRecuperar;