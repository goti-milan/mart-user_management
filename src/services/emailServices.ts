import fs from 'fs';
import path from 'path';
import { EMAIL_PASS, EMAIL_USER } from '../config';
import nodemailer from "nodemailer";

// Load the password reset email template once
const resetEmailTemplate = fs.readFileSync(
  path.join(__dirname, '../templates/password-reset-email.html'),
  'utf8'
);

export const sendEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  try {
    // Send the email
    await transporter.sendMail({
      to: email,
      subject: 'Password Reset Request',
      html: resetEmailTemplate.replace('{{resetLink}}', resetLink),
    });
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw new Error('Failed to send password reset email');
  }
};
