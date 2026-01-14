import { Router } from 'express';
import { getRecentEarthquakes } from '../services/boostrApi.js';
import { strictLimiter } from '../middleware/security.js';

const router = Router();

// GET /api/earthquakes - Últimos 15 sismos (rate limit estricto - llama API externa)
router.get('/', strictLimiter, async (req, res) => {
  try {
    const data = await getRecentEarthquakes();
    res.json(data);
  } catch (error) {
    console.error('Error fetching earthquakes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener datos de sismos'
    });
  }
});

// GET /api/earthquakes/recent - Alias (rate limit estricto)
router.get('/recent', strictLimiter, async (req, res) => {
  try {
    const data = await getRecentEarthquakes();
    res.json(data);
  } catch (error) {
    console.error('Error fetching recent earthquakes:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener datos de sismos recientes'
    });
  }
});

export default router;
