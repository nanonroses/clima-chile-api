import express from 'express';
import cors from 'cors';

// Middleware de seguridad
import { securityHeaders, generalLimiter } from './middleware/security.js';

// Rutas
import weatherRoutes from './routes/weather.js';
import earthquakesRoutes from './routes/earthquakes.js';
import holidaysRoutes from './routes/holidays.js';
import indicatorsRoutes from './routes/indicators.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ============ MIDDLEWARE ============

// Seguridad: Headers HTTP
app.use(securityHeaders);

// CORS configurado - usa ALLOWED_ORIGINS en producción
// SEGURIDAD: Siempre define un origen por defecto seguro
const DEFAULT_PRODUCTION_ORIGINS = 'https://prueba-api-scl.vercel.app';
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.ALLOWED_ORIGINS || DEFAULT_PRODUCTION_ORIGINS).split(',').filter(Boolean)
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET'],
  allowedHeaders: ['Content-Type']
}));

// Rate limiting
app.use(generalLimiter);

// Body parser
app.use(express.json());

// ============ RUTAS ============

// Weather routes (incluye /stations y /weather)
app.use('/api', weatherRoutes);

// Earthquakes routes
app.use('/api/earthquakes', earthquakesRoutes);

// Holidays routes
app.use('/api/holidays', holidaysRoutes);

// Indicators routes
app.use('/api/indicators', indicatorsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      weather: 'active',
      earthquakes: 'active',
      holidays: 'active',
      indicators: 'active'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado'
  });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
});

// ============ SERVIDOR ============

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║     🌤️  CLIMA CHILE API v2.0.0                            ║
║     Servidor corriendo en http://localhost:${PORT}          ║
╠═══════════════════════════════════════════════════════════╣
║  📡 Endpoints disponibles:                                ║
║                                                           ║
║  CLIMA                                                    ║
║    GET /api/stations        - Lista de estaciones         ║
║    GET /api/weather         - Clima de todas las estaciones║
║    GET /api/weather/:code   - Clima de estación específica ║
║                                                           ║
║  SISMOS                                                   ║
║    GET /api/earthquakes     - Últimos 15 sismos           ║
║    GET /api/earthquakes/recent - Alias de sismos          ║
║                                                           ║
║  FERIADOS                                                 ║
║    GET /api/holidays        - Feriados del año            ║
║    GET /api/holidays/today  - Es hoy feriado?             ║
║    GET /api/holidays/upcoming - Próximos 5 feriados       ║
║    GET /api/holidays/:year  - Feriados de un año          ║
║                                                           ║
║  INDICADORES ECONÓMICOS                                   ║
║    GET /api/indicators      - Todos los indicadores       ║
║    GET /api/indicators/:type - Indicador específico       ║
║                                                           ║
║  SISTEMA                                                  ║
║    GET /api/health          - Estado del servidor         ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

export default app;
