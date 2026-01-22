// Utilidades de seguridad para las funciones serverless

// Regex para validación de email (RFC 5322 simplificado)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Orígenes permitidos (configurable por env)
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://clima-chile-api.vercel.app', 'http://localhost:5173', 'http://localhost:3000'];

/**
 * Valida formato de email
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return EMAIL_REGEX.test(email);
}

/**
 * Sanitiza string para prevenir XSS
 */
export function sanitizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/[<>]/g, '') // Elimina < y >
    .substring(0, 500); // Limita longitud
}

/**
 * Valida contraseña segura
 */
export function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8) return false;
  if (password.length > 128) return false;
  // Al menos una letra y un número
  return /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

/**
 * Configura headers de seguridad
 */
export function setSecurityHeaders(res, req) {
  const origin = req.headers.origin;

  // CORS - solo orígenes permitidos
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Headers de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
}

/**
 * Valida que el request sea JSON válido
 */
export function validateJsonBody(req) {
  if (!req.body || typeof req.body !== 'object') {
    return { valid: false, error: 'Body debe ser JSON válido' };
  }
  return { valid: true };
}

export default {
  isValidEmail,
  isValidPassword,
  sanitizeString,
  setSecurityHeaders,
  validateJsonBody
};
