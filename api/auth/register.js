// Registro de usuarios
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import db from '../lib/db.js';
import { isValidEmail, isValidPassword, sanitizeString, setSecurityHeaders } from '../lib/security.js';

const SALT_ROUNDS = 12; // Aumentado para mayor seguridad

export default async function handler(req, res) {
  // Headers de seguridad
  setSecurityHeaders(res, req);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  }

  try {
    const { email, password, name } = req.body || {};

    // Validaciones
    if (!email || !password || !name) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, password y name son requeridos'
      });
    }

    // Validar formato de email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Formato de email inválido'
      });
    }

    // Validar contraseña segura
    if (!isValidPassword(password)) {
      return res.status(400).json({
        status: 'error',
        message: 'La contraseña debe tener 8-128 caracteres, incluir letras y números'
      });
    }

    // Sanitizar nombre
    const sanitizedName = sanitizeString(name);
    if (sanitizedName.length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'El nombre debe tener al menos 2 caracteres'
      });
    }

    const sanitizedEmail = email.toLowerCase().trim();

    // Verificar si el email ya existe
    const existingUser = await db.query(
      'SELECT 1 FROM users WHERE email = $1',
      [sanitizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        status: 'error',
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [sanitizedEmail, passwordHash, sanitizedName]
    );

    const user = result.rows[0];

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

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        user: { id: user.id, email: user.email, name: user.name },
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshExpiresAt
      }
    });
  } catch (error) {
    console.error('Error en registro:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor'
    });
  }
}
