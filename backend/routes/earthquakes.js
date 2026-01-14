import { Router } from 'express';
import { getRecentEarthquakes } from '../services/boostrApi.js';

const router = Router();

// GET /api/earthquakes - Últimos 15 sismos
router.get('/', async (req, res) => {
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

// GET /api/earthquakes/recent - Alias
router.get('/recent', async (req, res) => {
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
