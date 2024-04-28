// import nodemailer 
import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

// configuration Email : 

export const transporter = nodemailer.createTransport({
    service :"gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });




export const sendMail = async (transporter , mailOption)=>{
    try{
        await transporter.sendMail(mailOption)
        console.log("Email has been send ! ");
    }catch(error){
        console.log(error);
    }
}
