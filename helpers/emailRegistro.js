import { createTransport } from '../config/nodemailer.js';

export async function sendEmailVerification({ email,nombre, token }) {
  
  const transporter = createTransport(
    process.env.HOST_EMAIL,
    process.env.PORT_EMAIL,
    process.env.USER_EMAIL,
    process.env.PASS_EMAIL,
  )
  
  //send email
  const info = await transporter.sendMail({
    from: "portafolio@ordonezandres.com", // sender address
    to: `${email}`, // list of receivers
    subject: "AP-Veterinaria - Activar cuenta", // Subject line
    text: `AP-Veterinaria - Activar cuenta`, // plain text body
    html: `<p>😊 Hola ${nombre}, tu cuenta esta casi lista 👌, debes confirmar que ere tú 😉!</p> 
    <a href="${process.env.FRONTEND_URL}/confirmarcuenta/${token}">Confirmar cuenta</a>
    <p>No creaste esta cuenta? 🤔, ignora este mensaje</p>`, // html body
  });

  console.log("the Message was sent successfully");
}
export async function sendEmailForgotPassword({ nombre, email, token }) {
  const transporter = createTransport(
    process.env.HOST_EMAIL,
    process.env.PORT_EMAIL,
    process.env.USER_EMAIL,
    process.env.PASS_EMAIL,
  )
  
  //send email
  const info = await transporter.sendMail({
    from: "portafolio@ordonezandres.com", // sender address
    to: `${email}`, // list of receivers
    subject: "AP-Veterinaria - Recuperar cuenta", // Subject line
    text: `AP-Veterinaria - Recuperar cuenta`, // plain text body
    html: `<p> Hola ${nombre} 😊, has realizado la solicitud de recuperación de contraseña 🟢</p> 
    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Establecer nueva Contraseña</a>
    <p>No has sido tú? 🤔, ignora este mensaje</p>`, // html body
  });

  console.log("Message sent:", info.messageId);
}
