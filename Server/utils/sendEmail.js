import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WelcomeEmailTemplate } from './email_Templates/welcome.js';

// This helps resolve __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from one level above
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = async ( to, index, values) => {
  let text,subject,html;
  switch(index){
    case 1:
      subject= `MediSoft ${values.type.charAt(0).toUpperCase() + values.type.slice(1)} Login Details`;
      [html,text]=WelcomeEmailTemplate(values.name,values.id,values.password);
      break;
  }
  const mailOptions = {
    from: `"Medisoft Private Limited" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export default sendMail;
