const { Resend } = require('resend');

let resend = null;

function getClient() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

async function sendUserRegistrationEmail({ to, name, courseName }) {
  const { error } = await getClient().emails.send({
    from: process.env.SMTP_FROM,
    to,
    subject: `You're enrolled — ${courseName} at LeafClutch Technology`,
    text:
      `Hi ${name},\n\n` +
      `You have been added to our system for the ${courseName} course. ` +
      `Our moderators will reach out and lead you through the next steps shortly.\n\n` +
      `— LeafClutch Technology`
  });
  if (error) throw new Error(error.message || 'Resend failed to send user confirmation.');
}

async function sendAdminNotificationEmail({ name, email, phone, courseName }) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  const { error } = await getClient().emails.send({
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
  if (error) throw new Error(error.message || 'Resend failed to send admin notification.');
}

module.exports = { sendUserRegistrationEmail, sendAdminNotificationEmail };