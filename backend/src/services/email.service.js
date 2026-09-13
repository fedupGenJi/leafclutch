const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 587;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

async function sendUserRegistrationEmail({ to, name, courseName }) {
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `You're enrolled — ${courseName} at LeafTech Technology`,
    text:
      `Hi ${name},\n\n` +
      `You have been added to our system for the ${courseName} course. ` +
      `Our moderators will reach out and lead you through the next steps shortly.\n\n` +
      `— LeafTech Technology`
  });
}

async function sendAdminNotificationEmail({ name, email, phone, courseName }) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to: adminEmail,
    subject: `New paid registration — ${courseName}`,
    text:
      `A new course registration was just completed.\n\n` +
      `Name: ${name}\n` +
      `Phone: +977 ${phone}\n` +
      `Email: ${email}\n` +
      `Course: ${courseName}`
  });
}

module.exports = { sendUserRegistrationEmail, sendAdminNotificationEmail };