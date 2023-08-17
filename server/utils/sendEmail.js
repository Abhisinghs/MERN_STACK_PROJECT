//import nodemailer module 
import { createTransport } from "nodemailer";

//async .. awat is not allowed in gloabal scope, must use a wrapper 
const sendEmail = async function(email,subject,message){

    //create reusable transporter object using the default SMTP transport 
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,  //true for 465, false for other ports 
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD,
        }
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM_EMAIL, // sender address (OUR EMAIL)
        to: email, // list of receivers  (WEBSITE USER EMAIL)
        subject: subject, // Subject line
        html: message, // html body
    });


}


export default sendEmail;