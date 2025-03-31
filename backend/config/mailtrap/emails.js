import { client } from "./mailTrap.config.js";
import { sender } from "./mailTrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE } from "./email.template.js";
export const sendVerificationEmail = async (email, verificationCode, next) => {
  const recipients = [
    {
      email,
    },
  ];
  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      subject: "verifiy your email",
      html: `${VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      )}`,
      category: "email verification",
    });

    console.log("email sent successfully", response);
  } catch (error) {
    console.error("Error sending email:", error);
    next(error);
  }
};

export const sendWelcomeEmail = async (email, name, next) => {
  const recipients = [
    {
      email,
    },
  ];
  try {
    const response = await client.send({
      from: sender,
      to: recipients,
      template_uuid: "be8c308b-ec97-4e0a-9410-3bd9a244b645",
      template_variables: {
        company_info_name: `auth company `,
      },
    });

    console.log("welcome email sent successfully", response);
  } catch (error) {
    console.error("Error sending email:", error);
    next(error);
  }
};
