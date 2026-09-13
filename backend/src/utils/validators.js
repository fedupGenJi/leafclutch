const GMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?@gmail\.com$/;
const PHONE_REGEX = /^\d{10}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

function isValidGmail(email) {
  return typeof email === 'string' && GMAIL_REGEX.test(email.trim().toLowerCase());
}

function normalizePhone(phone) {
  return typeof phone === 'string' ? phone.replace(/[^0-9]/g, '') : '';
}

function isValidPhone(phone) {
  return PHONE_REGEX.test(normalizePhone(phone));
}

function isStrongPassword(password) {
  return typeof password === 'string' && PASSWORD_REGEX.test(password);
}

function formatPhone(phone) {
  const digits = normalizePhone(phone);
  return digits.length === 10 ? `${digits.slice(0, 3)}-${digits.slice(3)}` : digits;
}

module.exports = { isValidGmail, isValidPhone, isStrongPassword, normalizePhone, formatPhone };
