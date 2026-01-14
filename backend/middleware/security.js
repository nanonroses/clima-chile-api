import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Configuración de Helmet para headers de seguridad
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.boostr.cl"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  },
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  }
});

// Rate limiter general
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: {
    status: 'error',
    message: 'Demasiadas solicitudes. Por favor, intenta de nuevo en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter más estricto para endpoints sensibles
export const strictLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // máximo 30 requests por minuto
  message: {
    status: 'error',
    message: 'Límite de solicitudes excedido. Espera un momento.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
