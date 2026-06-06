# ArenaDesk OS

[![CI](https://github.com/YOUR_USER/ArenaDeskOS/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USER/ArenaDeskOS/actions/workflows/ci.yml)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000?logo=vercel)](https://arenadesk.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-Commercial-red)](LICENSE)

**The Operating System for Gaming Cafés & Esports Venues**

A production-ready SaaS platform for managing gaming cafés, esports arenas, and LAN centers. Built with Next.js, Node.js, Electron, and Flutter.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Web Dashboard  │     │  Desktop Client  │     │  Mobile App     │
│  (Next.js)      │     │  (Electron)      │     │  (Flutter)      │
│  Port 3000      │     │  Runs on each PC │     │  iOS + Android  │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                        │
         └───────────┬───────────┴────────────┬────────────┘
                     │                        │
            ┌────────▼────────┐      ┌────────▼────────┐
            │  REST API       │      │  WebSocket      │
            │  (Express)      │◄────►│  (Socket.io)    │
            │  Port 3001      │      │  Port 3002      │
            └────────┬────────┘      └─────────────────┘
                     │
            ┌────────▼────────┐
            │  PostgreSQL     │
            │  + Redis        │
            └─────────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Web Dashboard | Next.js 14, TypeScript, Tailwind CSS, Recharts |
| Backend API | Node.js, Express, TypeScript, Prisma |
| Database | PostgreSQL with Redis caching |
| Desktop Client | Electron, React, Socket.io |
| Mobile App | Flutter, Provider, WebSocket |
| Real-time | Socket.io (WebSocket) |
| Auth | JWT, bcrypt, NextAuth.js |
| Hosting | Docker, Vercel/AWS |

## Database Schema

9 core models: `User`, `Cafe`, `PC`, `Session`, `Reservation`, `Transaction`, `Tournament`, `TournamentParticipant`, `AuditLog`

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- Flutter SDK 3.x (for mobile)
- PostgreSQL 16 (via Docker)

### Development Setup

```bash
# 1. Start infrastructure
docker-compose up -d postgres redis

# 2. Backend
cd backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev          # → http://localhost:3001

# 3. Frontend (in another terminal)
cd frontend
npm install
npm run dev          # → http://localhost:3000

# 4. Desktop Client (in another terminal)
cd desktop-client
npm install
npm run dev

# 5. Mobile App (in another terminal)
cd mobile-app
flutter pub get
flutter run
```

### Vercel Deployment (Frontend)

The frontend is configured for one-click deploy on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USER/ArenaDeskOS&root=frontend)

### Required Environment Variables (Vercel)

| Variable | Description |
|----------|-------------|
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g., `https://arenadesk.vercel.app`) |
| `NEXTAUTH_SECRET` | Random string for session encryption (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_API_URL` | Your deployed backend API URL |

## Free Backend Deployment (2 Options)

### Option 1: Render (Free Node.js) + Neon (Free PostgreSQL)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/YOUR_USER/ArenaDeskOS)

**Steps:**

1. **Create a free [Neon](https://neon.tech) PostgreSQL database:**
   - Sign up → Create project → Copy the connection string
   - It gives 0.5 GB free, auto-suspends when idle

2. **Deploy the backend on [Render](https://render.com):**
   - Sign up (no credit card needed)
   - Dashboard → **New +** → **Web Service**
   - Connect your GitHub repo → select `ArenaDeskOS`
   - Set **Root Directory** to `backend`
   - Set **Build Command**: `npm install && npx prisma generate && npm run build`
   - Set **Start Command**: `npm start`
   - Add these environment variables:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Your Neon connection string |
| `JWT_SECRET` | `openssl rand -base64 32` output |
| `JWT_EXPIRES_IN` | `7d` |
| `JWT_REFRESH_EXPIRES_IN` | `30d` |
| `BCRYPT_SALT_ROUNDS` | `12` |
| `CORS_ORIGIN` | Your Vercel URL |

3. **Run Prisma migrations:**
   - In Render dashboard → your service → **Shell**
   - Run: `npx prisma db push`

4. **Seed the database:**
   - In the same shell: `npx prisma db seed`

5. **Update your Vercel env var:**
   - Set `NEXT_PUBLIC_API_URL` to `https://your-service.onrender.com/api`

### Option 2: Railway (All-in-One)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/YOUR_USER/ArenaDeskOS)

1. Sign up at [Railway](https://railway.app) (no credit card)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repo, set root directory to `backend`
4. Add a **PostgreSQL** plugin
5. Add environment variables (same as table above)
6. After deploy, run: `npx prisma db push && npx prisma db seed`
7. Update your Vercel `NEXT_PUBLIC_API_URL`

### Docker Production Deploy

```bash
docker-compose up -d
```

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → JWT |
| GET | `/api/auth/me` | Get current user |

### PCs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/pcs` | List PCs |
| POST | `/api/pcs` | Create PC |
| PATCH | `/api/pcs/:id` | Update PC |
| DELETE | `/api/pcs/:id` | Delete PC |

### Sessions
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/sessions/start` | Start session |
| POST | `/api/sessions/end` | End session |
| GET | `/api/sessions/active` | Active sessions |
| GET | `/api/sessions/history` | Session history |

### Reservations
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/reservations` | Create reservation |
| GET | `/api/reservations` | List reservations |
| PATCH | `/api/reservations/:id` | Update status |

### Tournaments
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/tournaments` | Create tournament |
| GET | `/api/tournaments` | List tournaments |
| POST | `/api/tournaments/:id/join` | Join tournament |

### Cafes
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cafes` | List user's cafes |
| POST | `/api/cafes` | Create cafe |
| GET | `/api/cafes/:id` | Cafe details |

### Audit Logs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/audit-logs` | List audit logs |

## WebSocket Events

### Client → Server
- `heartbeat` - PC heartbeat every 5s `{ pcId, timestamp }`

### Server → Client
- `session_started` - New session started
- `session_updated` - Session updated
- `session_ended` - Session ended
- `pc_status_changed` - PC status changed
- `reservation_created` - New reservation

## Security

- JWT authentication with role-based access (owner/staff/customer)
- bcrypt password hashing
- Rate limiting (100 req/min per IP)
- Helmet security headers
- CORS configured for all client origins
- Audit logs for all critical actions (sessions, payments, admin)
- Desktop client auto-locks on disconnect (heartbeat failure)

## Desktop Client Security

- PC auto-locks if heartbeat fails 3 consecutive times (15 seconds)
- Full-screen lock overlay prevents unauthorized access
- Kiosk mode prevents Alt+F4 / task manager close
- Idle auto-lock after 5 minutes
- Heartbeat sent every 5 seconds to backend

## Pricing (Subscription SaaS)

| Plan | Price | Features |
|------|-------|----------|
| Starter | $15/month | Up to 10 PCs, basic analytics |
| Pro | $35/month | Up to 50 PCs, reservations, loyalty |
| Enterprise | $99/month | Unlimited PCs, multi-cafe, AI analytics |

## Project Structure

```
ArenaDeskOS/
├── backend/            - Node.js + Express + Prisma API
├── frontend/           - Next.js web dashboard (Vercel-ready)
│   ├── vercel.json     - Vercel deployment config
│   └── .env.example    - Environment variable template
├── desktop-client/     - Electron PC control app
├── mobile-app/         - Flutter owner dashboard
├── migrations/         - SQL migration scripts
├── .github/workflows/  - GitHub Actions CI
├── docker-compose.yml
├── vercel.json         - Root Vercel config (monorepo)
└── README.md
```

## License

Commercial software. All rights reserved.
