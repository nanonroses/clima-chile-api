# Clima Chile API

API y aplicación web para consultar información en tiempo real de Chile: clima, sismos, feriados e indicadores económicos.

## Demo

**[https://clima-chile-api.vercel.app](https://clima-chile-api.vercel.app)**

## Arquitectura

```
Cliente → Vercel (CDN + Serverless) → Supabase (PostgreSQL)
                    ↓
              API Boostr (externa)
```

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | React 18 + Vite |
| **Backend** | Vercel Serverless Functions (Node.js) |
| **Base de datos** | Supabase (PostgreSQL) |
| **Autenticación** | JWT + Refresh Tokens |
| **Cache** | PostgreSQL (persistente) |
| **Deploy** | Vercel (automático desde GitHub) |

## Características

- **Clima en tiempo real** - 26 estaciones meteorológicas de Chile
- **Sismos recientes** - Últimos movimientos telúricos
- **Feriados** - Calendario de feriados chilenos
- **Indicadores económicos** - UF, dólar, euro, UTM y más
- **Autenticación** - Registro y login con JWT
- **Cache inteligente** - Reduce llamadas a API externa

## API Endpoints

### Clima
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/weather` | Lista de estaciones meteorológicas |
| GET | `/api/weather/:code` | Clima de una estación (ej: SCFA) |

### Sismos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/earthquakes` | Últimos sismos registrados |

### Feriados
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/holidays` | Feriados del año actual |
| GET | `/api/holidays?year=2025` | Feriados de un año específico |

### Indicadores Económicos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/indicators` | Todos los indicadores |
| GET | `/api/indicators?type=uf` | Indicador específico |

**Tipos válidos:** `uf`, `dolar`, `euro`, `utm`, `ipc`, `ivp`, `imacec`, `tpm`, `libra`, `peso_arg`, `real`

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Sistema
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor y servicios |

## Instalación Local

### Requisitos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (gratis)

### 1. Clonar repositorio

```bash
git clone https://github.com/nanonroses/clima-chile-api.git
cd clima-chile-api
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Edita `backend/.env` con tus credenciales de Supabase:

```env
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
JWT_SECRET=tu-clave-secreta-de-32-caracteres-minimo
JWT_EXPIRES_IN=15m
```

### 3. Instalar dependencias

```bash
# Backend (desarrollo local)
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Ejecutar

```bash
# Backend (puerto 3001)
cd backend && npm run dev

# Frontend (puerto 5173)
cd frontend && npm run dev
```

## Deploy en Vercel

El proyecto está configurado para deploy automático:

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
3. Deploy automático con cada push a `main`

## Base de Datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `users` | Usuarios registrados |
| `refresh_tokens` | Tokens de refresco JWT |
| `cache_entries` | Caché persistente de API |
| `query_history` | Historial de consultas |
| `user_preferences` | Preferencias de usuario |
| `favorite_cities` | Ciudades favoritas |

### TTL del Caché

| Endpoint | TTL |
|----------|-----|
| Clima por estación | 5 minutos |
| Lista de estaciones | 30 minutos |
| Sismos | 2 minutos |
| Feriados | 24 horas |
| Indicadores | 1 hora |

## Seguridad

- **SQL Injection** - Queries parametrizadas
- **XSS** - Sanitización de inputs
- **CORS** - Whitelist de orígenes
- **Headers** - X-Frame-Options, CSP, X-Content-Type-Options
- **Passwords** - bcrypt con 12 salt rounds
- **Tokens** - SHA-256 hash antes de almacenar

## Fuente de Datos

Datos proporcionados por [Boostr API](https://boostr.cl).

## Licencia

MIT
