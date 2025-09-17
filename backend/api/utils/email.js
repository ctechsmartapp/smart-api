import nodemailer from "nodemailer";

export async function sendWelcomeEmail(toEmail, firstname) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP credentials
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"Smart App" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Welcome to SMART APP!",
    html: `<h3>Hi ${firstname},</h3>
           <p>Welcome to our platform! We're glad to have you onboard 🚀</p>`,
  };

  await transporter.sendMail(mailOptions);
}