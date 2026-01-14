import { Router } from 'express';
import { getAllHolidays, checkIfHoliday } from '../services/boostrApi.js';
import { validators } from '../middleware/validator.js';

const router = Router();

// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros dinámicos
// Express evalúa rutas en orden, y /:year capturaría "today", "upcoming", "is" si va primero

// GET /api/holidays/today - Verificar si hoy es feriado
router.get('/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await checkIfHoliday(today);
    res.json(data);
  } catch (error) {
    console.error('Error checking today holiday:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al verificar si hoy es feriado'
    });
  }
});

// GET /api/holidays/upcoming - Próximos feriados (5)
router.get('/upcoming', async (req, res) => {
  try {
    const data = await getAllHolidays();

    if (data.status === 'success' && data.data) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = data.data
        .filter(holiday => new Date(holiday.date) >= today)
        .slice(0, 5);

      res.json({
        status: 'success',
        data: upcoming
      });
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error fetching upcoming holidays:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener próximos feriados'
    });
  }
});

// GET /api/holidays/is/:date - Verificar si una fecha es feriado
router.get('/is/:date', validators.date, async (req, res) => {
  const { date } = req.params;

  try {
    const data = await checkIfHoliday(date);
    res.json(data);
  } catch (error) {
    console.error('Error checking holiday date:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al verificar la fecha'
    });
  }
});

// GET /api/holidays/:year - Feriados de un año específico
router.get('/:year', validators.year, async (req, res) => {
  const { year } = req.params;

  try {
    const data = await getAllHolidays(year);
    res.json(data);
  } catch (error) {
    console.error('Error fetching holidays by year:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener feriados del año'
    });
  }
});

// GET /api/holidays - Feriados del año actual (ruta raíz al final)
router.get('/', async (req, res) => {
  try {
    const data = await getAllHolidays();
    res.json(data);
  } catch (error) {
    console.error('Error fetching holidays:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener feriados'
    });
  }
});

export default router;
