import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";

const TOKEN = "a8a54e85f0d0b962a01394b0690ce0de";

const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

const sender = {
  address: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};
const recipients = ["nothingism99@gmail.com"];

transport
  .sendMail({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
