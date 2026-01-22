// Login de usuarios
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../lib/db.js';
import { isValidEmail, setSecurityHeaders } from '../lib/security.js';

export default async function handler(req, res) {
  // Headers de seguridad
  setSecurityHeaders(res, req);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email y password son requeridos'
      });
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Formato de email inválido'
      });
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // Buscar usuario
    const result = await db.query(
      `SELECT id, email, password_hash, name, is_active
       FROM users WHERE email = $1`,
      [sanitizedEmail]
    );

    const user = result.rows[0];

    // Mensaje genérico para no revelar si el usuario existe
    if (!user || !user.is_active) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar último login
    await db.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generar tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, refreshTokenHash, refreshExpiresAt]
    );

    res.status(200).json({
      status: 'success',
      message: 'Login exitoso',
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresAt
      }
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
  }
}
