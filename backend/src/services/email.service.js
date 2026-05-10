import nodemailer from "nodemailer";
import { env } from "../helpers/env.js";

let transporter;

function getTransporter() {
  if (transporter) return transporter;

  if (env.smtpHost && env.smtpPort && env.smtpUser && env.smtpPass) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: Number(env.smtpPort),
      secure: Number(env.smtpPort) === 465,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });
  }

  return transporter;
}

export async function sendOtpEmail({ to, otp, purpose }) {
  const subject = purpose === "register" ? "Your EMS registration OTP" : "Your EMS login OTP";
  const text = `Your OTP is ${otp}. It expires in ${env.otpTtlMinutes} minutes.`;

  const smtp = getTransporter();
  if (!smtp) {
    console.log(`[DEV OTP] ${purpose.toUpperCase()} ${to}: ${otp}`);
    return;
  }

  await smtp.sendMail({
    from: env.smtpFrom,
    to,
    subject,
    text,
  });
}
