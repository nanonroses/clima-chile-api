import { Router } from 'express';
import { getAllIndicators, getIndicatorByType, getIndicatorHistory } from '../services/boostrApi.js';
import { validators } from '../middleware/validator.js';

const router = Router();

// GET /api/indicators - Todos los indicadores actuales
router.get('/', async (req, res) => {
  try {
    const data = await getAllIndicators();
    res.json(data);
  } catch (error) {
    console.error('Error fetching indicators:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener indicadores económicos'
    });
  }
});

// GET /api/indicators/:type - Indicador específico
router.get('/:type', validators.indicatorType, async (req, res) => {
  const { type } = req.params;

  try {
    const data = await getIndicatorByType(type);
    res.json(data);
  } catch (error) {
    console.error('Error fetching indicator:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener indicador'
    });
  }
});

// GET /api/indicators/:type/:year - Historial de indicador por año
router.get('/:type/:year', [...validators.indicatorType.slice(0, -1), ...validators.year], async (req, res) => {
  const { type, year } = req.params;

  try {
    const data = await getIndicatorHistory(type, year);
    res.json(data);
  } catch (error) {
    console.error('Error fetching indicator history:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener historial del indicador'
    });
  }
});

export default router;
