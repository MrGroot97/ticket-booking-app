import nodeMailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the directory name

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

function replaceContent(content, creds) {
    return Object.keys(creds).reduce((updatedContent, key) => {
      return updatedContent.replace(new RegExp(`#{${key}}`, "g"), creds[key]);
    }, content);
}

const sendMail = async (templateName, receiverEmail, creds, subject) => {
    const templatePath = path.join(__dirname, "templates", templateName);
    const template = await fs.promises.readFile(templatePath, "utf-8");
    const htmlContent = replaceContent(template, creds);
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: "noobgaming7352@gmail.com", // currently hardcoded, we can replace it with receiverEmail
        subject: subject || 'Ticket Booked From BookMyShow App',
        html: htmlContent
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ........ ' + info.response);
        }
    });
}

export default sendMail;
