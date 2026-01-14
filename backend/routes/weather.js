import { Router } from 'express';
import { getAllWeather, getWeatherByCode, STATIONS } from '../services/boostrApi.js';
import { validators } from '../middleware/validator.js';
import { strictLimiter } from '../middleware/security.js';

const router = Router();

// GET /api/stations - Lista de estaciones disponibles (sin rate limit estricto - datos estáticos)
router.get('/stations', (req, res) => {
  res.json({
    status: 'success',
    data: STATIONS
  });
});

// GET /api/weather - Clima de todas las estaciones (rate limit estricto - llama API externa)
router.get('/weather', strictLimiter, async (req, res) => {
  try {
    const data = await getAllWeather();
    res.json(data);
  } catch (error) {
    console.error('Error fetching all weather:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener datos del clima'
    });
  }
});

// GET /api/weather/:code - Clima de una estación específica (rate limit estricto)
router.get('/weather/:code', strictLimiter, validators.stationCode, async (req, res) => {
  const { code } = req.params;

  try {
    const data = await getWeatherByCode(code);

    if (data.status === 'error') {
      return res.status(404).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching station weather:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener datos del clima de la estación'
    });
  }
});

export default router;
