import { MailtrapClient } from "mailtrap";
import { TOKEN } from "./../env.js";
export const client = new MailtrapClient({
  token: TOKEN,
});
export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mailtrap Test",
};

