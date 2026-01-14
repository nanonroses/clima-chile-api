# Clima Chile API

Aplicación web fullstack para consultar información en tiempo real de Chile: clima, sismos, feriados e indicadores económicos.

## Características

- **Clima en tiempo real** - Datos meteorológicos de 26 estaciones a lo largo de Chile
- **Sismos recientes** - Últimos movimientos telúricos registrados
- **Feriados** - Calendario de feriados chilenos
- **Indicadores económicos** - UF, dólar, euro y más

## Demo

[https://prueba-api-scl.vercel.app](https://prueba-api-scl.vercel.app)

## Tecnologías

### Frontend
- React 18
- Vite
- CSS con animaciones según el clima

### Backend
- Node.js
- Express.js
- Helmet (seguridad)
- Rate limiting

## Instalación

### Requisitos
- Node.js 18+
- npm

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/PRUEBA_API_SCL.git
cd PRUEBA_API_SCL
```

### Backend

```bash
cd backend
npm install
npm run dev
```

El servidor correrá en `http://localhost:3001`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## API Endpoints

### Clima
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/stations` | Lista de estaciones meteorológicas |
| GET | `/api/weather` | Clima de todas las estaciones |
| GET | `/api/weather/:code` | Clima de una estación específica |

### Sismos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/earthquakes` | Últimos 15 sismos |
| GET | `/api/earthquakes/recent` | Alias de sismos recientes |

### Feriados
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/holidays` | Feriados del año actual |
| GET | `/api/holidays/today` | Verifica si hoy es feriado |
| GET | `/api/holidays/upcoming` | Próximos 5 feriados |
| GET | `/api/holidays/:year` | Feriados de un año específico |

### Indicadores Económicos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/indicators` | Todos los indicadores |
| GET | `/api/indicators/:type` | Indicador específico (uf, dolar, euro, etc.) |

### Sistema
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor |

## Estaciones Meteorológicas

La aplicación incluye datos de 26 estaciones a lo largo de Chile:

- Arica, Iquique, Antofagasta, Calama
- La Serena, Santiago, Viña del Mar
- Rancagua, Talca, Chillán, Concepción
- Temuco, Valdivia, Osorno, Puerto Montt
- Coyhaique, Punta Arenas
- Isla de Pascua, Isla Robinson Crusoe
- Base Antártica

## Scripts Disponibles

### Frontend
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run test         # Ejecutar tests
npm run test:e2e     # Tests end-to-end con Playwright
```

### Backend
```bash
npm run dev          # Servidor de desarrollo con hot reload
npm start            # Servidor de producción
npm run test         # Ejecutar tests
npm run test:coverage # Tests con cobertura
```

## Seguridad

- Headers HTTP seguros con Helmet
- Rate limiting para prevenir abuso
- CORS configurado por ambiente
- Validación de entrada con express-validator

## Fuente de Datos

Los datos son proporcionados por [Boostr API](https://boostr.cl).

## Licencia

MIT
