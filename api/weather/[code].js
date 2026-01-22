// Proxy para clima por estación
import db from '../lib/db.js';

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'error', message: 'Método no permitido' });
  }

  const { code } = req.query;

  if (!code || !/^[A-Za-z0-9]{4}$/.test(code)) {
    return res.status(400).json({
      status: 'error',
      message: 'Código de estación inválido (debe ser 4 caracteres alfanuméricos)'
    });
  }

  const cacheKey = `weather:${code.toUpperCase()}`;

  try {
    // Intentar obtener de caché
    const cached = await db.query(
      `UPDATE cache_entries SET hit_count = hit_count + 1
       WHERE cache_key = $1 AND expires_at > CURRENT_TIMESTAMP
       RETURNING data`,
      [cacheKey]
    );

    if (cached.rows.length > 0) {
      return res.status(200).json(cached.rows[0].data);
    }

    // Obtener de API externa
    const response = await fetch(`https://api.boostr.cl/weather/${code}.json`);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Guardar en caché
    const expiresAt = new Date(Date.now() + CACHE_TTL);
    await db.query(
      `INSERT INTO cache_entries (cache_key, data, data_type, expires_at, hit_count)
       VALUES ($1, $2, $3, $4, 0)
       ON CONFLICT (cache_key) DO UPDATE SET
         data = EXCLUDED.data,
         expires_at = EXCLUDED.expires_at,
         hit_count = 0,
         updated_at = CURRENT_TIMESTAMP`,
      [cacheKey, JSON.stringify(data), 'weather', expiresAt]
    );

    res.status(200).json(data);
  } catch (error) {
    console.error('Error weather:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener datos del clima' });
  }
}
