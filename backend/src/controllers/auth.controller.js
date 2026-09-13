const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { isValidGmail, isValidPhone, isStrongPassword, normalizePhone, formatPhone } = require('../utils/validators');

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: formatPhone(user.phone) };
}

async function signup(req, res) {
  const { name, email, phone, password } = req.body || {};

  if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required.' });
  if (!isValidGmail(email)) return res.status(400).json({ message: 'Enter a valid Gmail address.' });
  if (!isValidPhone(phone)) return res.status(400).json({ message: 'Phone number must be 10 digits.' });
  if (!isStrongPassword(password)) {
    return res.status(400).json({
      message: 'Password needs 8+ characters, an uppercase and lowercase letter, a number and a symbol.'
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = normalizePhone(phone);

  const existing = await pool.query('SELECT id FROM users WHERE email = $1 OR phone = $2', [cleanEmail, cleanPhone]);
  if (existing.rows.length) {
    return res.status(409).json({ message: 'An account with that email or phone already exists.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const inserted = await pool.query(
    'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name.trim(), cleanEmail, cleanPhone, hashed]
  );

  const user = inserted.rows[0];
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
  const user = rows[0];
  if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid email or password.' });

  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
}

module.exports = { signup, login };
