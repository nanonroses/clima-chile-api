// Health check endpoint
import db from './lib/db.js';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Verificar conexión a base de datos
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
      services: {
        database: 'disconnected'
      },
      error: error.message
    });
  }
}
