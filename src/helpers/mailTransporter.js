import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // or the port number provided by your SMTP provider
  secure: false, // Set it to true if you are using a secure connection (TLS/SSL)
  auth: {
    user: "booking@qxlabai.com",
    pass: "hmsxxmcihkxjiarp",
  },
});
