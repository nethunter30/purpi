import nodemailer from "nodemailer";

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
  replyTo?: string;
}

export async function sendMail({
  to,
  subject,
  html,
  fromName,
  replyTo,
}: SendMailOptions) {
  const host = process.env.MAIL_HOST;
  const port = parseInt(process.env.MAIL_PORT || "587");
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;
  const defaultFromName = process.env.MAIL_FROM || "Enteropia";
  const displayFromName = fromName || defaultFromName;

  if (!host || !user || !pass) {
    console.warn("SMTP configuration not found.");
    return {
      success: false,
      error: "SMTP configuration missing",
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"${displayFromName}" <${user}>`,
      to,
      subject,
      html,
      replyTo,
    });

    console.log("Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error(error);

    return {
      success: false,
      error: error.message,
    };
  }
}
