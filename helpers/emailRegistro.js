import 'dotenv/config';
import { Resend } from 'resend';
const emailRegistro = async (datos) => {
  try {
    const resend = new Resend(process.env.RESEND_KEY);
    
    const { email, nombre, token } = datos;
    console.log(email)

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: [`${email}`],
      subject: 'Confirma tu cuenta en APV',
      html: `<p> Hola ${nombre}, por favor confirma tu cuenta en APV. </p> 
        <p>Para confirmar, solo debes dar click en el siguiente enlace:
          <a href="${process.env.FRONTEND_URL}/confirmarcuenta/${token}">Comprobar cuenta</a>
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

export default emailRegistro;
