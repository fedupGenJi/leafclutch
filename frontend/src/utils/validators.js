export const GMAIL_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?@gmail\.com$/;

export const PASSWORD_RULES = [
  { key: 'length', label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { key: 'lower', label: 'One lowercase letter', test: (v) => /[a-z]/.test(v) },
  { key: 'number', label: 'One number', test: (v) => /\d/.test(v) },
  { key: 'symbol', label: 'One symbol', test: (v) => /[^A-Za-z0-9]/.test(v) }
];

export function isValidGmail(value) {
  return GMAIL_REGEX.test(value.trim().toLowerCase());
}

export function isStrongPassword(value) {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

export function formatPhoneInput(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

export function phoneDigits(formatted) {
  return formatted.replace(/\D/g, '');
}

export function isValidPhoneDigits(digits) {
  return /^\d{10}$/.test(digits);
}
