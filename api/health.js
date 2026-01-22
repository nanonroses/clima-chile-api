// Health check endpoint
import db from './lib/db.js';
import { setSecurityHeaders } from './lib/security.js';

export default async function handler(req, res) {
  setSecurityHeaders(res, req);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  }

  try {
    await db.query('SELECT 1');

    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      services: {
        weather: 'active',
        earthquakes: 'active',
        holidays: 'active',
        indicators: 'active',
        auth: 'active',
        database: 'connected'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      services: { database: 'disconnected' }
    });
  }
}
