const { pool } = require('../db');
const { findCourse } = require('../data/courses');
const khalti = require('../services/khalti.service');
const { sendUserRegistrationEmail, sendAdminNotificationEmail } = require('../services/email.service');

async function initiateKhaltiPayment(req, res) {
  const { course: slug, price } = req.body || {};

  const course = findCourse(slug);
  if (!course) {
    return res.status(400).json({ message: 'Unknown course.' });
  }

  const amount = Number(price);
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid price.' });
  }

  const { rows } = await pool.query('SELECT id, name, email, phone FROM users WHERE id = $1', [req.userId]);
  const user = rows[0];
  if (!user) {
    return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }

  const purchaseOrderId = `${course.slug}-${user.id}-${Date.now()}`;

  try {
    const khaltiRes = await khalti.initiatePayment({
      amountRupees: amount,
      purchaseOrderId,
      purchaseOrderName: course.name,
      customerInfo: {
        name: user.name,
        email: user.email,
        phone: user.phone.replace('-', '') // stored as "981-2345678"; Khalti wants digits only
      }
    });

    if (!khaltiRes.pidx || !khaltiRes.payment_url) {
      console.error('[khalti] unexpected initiate response:', khaltiRes);
      return res.status(502).json({ message: 'Payment gateway did not return a payment link.' });
    }

    await pool.query(
      'INSERT INTO khalti_temp (user_id, pidx, course, amount, status) VALUES ($1, $2, $3, $4, $5)',
      [user.id, khaltiRes.pidx, course.slug, Math.round(amount * 100), 'pending']
    );

    res.json({ payment_url: khaltiRes.payment_url, pidx: khaltiRes.pidx });
  } catch (err) {
    console.error('[khalti] initiate failed:', err.response?.data || err.message);
    res.status(502).json({ message: 'Could not initiate payment. Please try again.' });
  }
}

async function verifyKhaltiPayment(req, res) {
  const { pidx } = req.body || {};
  if (!pidx) {
    return res.status(400).json({ success: false, message: 'Missing pidx.' });
  }

  const { rows } = await pool.query(
    'SELECT * FROM khalti_temp WHERE pidx = $1 AND user_id = $2',
    [pidx, req.userId]
  );
  const attempt = rows[0];
  if (!attempt) {
    return res.status(404).json({ success: false, message: 'Invalid or expired payment link.' });
  }

  let status;
  try {
    const lookup = await khalti.lookupPayment(pidx);
    status = lookup.status;
  } catch (err) {
    console.error('[khalti] lookup failed:', err.response?.data || err.message);
    return res.status(502).json({ success: false, message: 'Could not confirm payment status with Khalti.' });
  }

  await pool.query('UPDATE khalti_temp SET status = $1 WHERE pidx = $2', [status, pidx]);

  const course = findCourse(attempt.course);
  const courseName = course ? course.name : attempt.course;

  if (status !== 'Completed') {
    const message =
      status === 'User canceled' ? 'Payment was canceled.' : `Payment status: ${status}.`;
    return res.json({ success: false, status, course: courseName, message });
  }

  const { rows: userRows } = await pool.query('SELECT * FROM users WHERE id = $1', [attempt.user_id]);
  const user = userRows[0];

  try {
    await pool.query(
      `INSERT INTO registrations (user_id, course, pidx) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, course) DO NOTHING`,
      [user.id, attempt.course, pidx]
    );
  } catch (err) {
    console.error('[db] failed to record registration:', err.message);
  }

  try {
    await sendUserRegistrationEmail({ to: user.email, name: user.name, courseName });
  } catch (err) {
    console.error('[email] failed to send user confirmation:', err.message);
  }

  try {
    await sendAdminNotificationEmail({ name: user.name, email: user.email, phone: user.phone, courseName });
  } catch (err) {
    console.error('[email] failed to send admin notification:', err.message);
  }

  res.json({ success: true, status, course: courseName, message: 'Payment verified and registration recorded.' });
}

module.exports = { initiateKhaltiPayment, verifyKhaltiPayment };