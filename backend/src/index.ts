import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import config from './config';
import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/auth';
import prisma from './services/prisma';

import authRoutes from './routes/auth.routes';
import pcRoutes from './routes/pcs.routes';
import sessionRoutes from './routes/sessions.routes';
import reservationRoutes from './routes/reservations.routes';
import tournamentRoutes from './routes/tournaments.routes';
import cafeRoutes from './routes/cafes.routes';
import auditRoutes from './routes/audit.routes';

dotenv.config();

async function runMigrations() {
  logger.info('Running database migrations...');
  try {
    execSync('npx prisma db push --accept-data-loss 2>&1', { stdio: 'pipe', cwd: __dirname + '/../..', timeout: 60000 });
    logger.info('Migrations complete');
  } catch (error: any) {
    const msg = error.stderr?.toString() || error.stdout?.toString() || error.message;
    logger.error('Migration failed: ' + msg);
    throw new Error('Database migration failed: ' + msg);
  }
}

async function seedIfEmpty() {
  try {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      logger.info('Database empty — seeding...');
      execSync('npx prisma db seed 2>&1', { stdio: 'pipe', cwd: __dirname + '/../..', timeout: 30000 });
      logger.info('Seed complete');
    } else {
      logger.info(`Database has ${userCount} users — skip seed`);
    }
  } catch (error: any) {
    const msg = error.stderr?.toString() || error.stdout?.toString() || error.message;
    logger.error('Seed failed: ' + msg);
    throw new Error('Database seed failed: ' + msg);
  }
}

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: config.corsOrigin, methods: ['GET', 'POST'], credentials: true },
});

app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.get('/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime(), environment: config.nodeEnv } });
});

app.use('/api/auth', authRoutes);
app.use('/api/pcs', authenticate, pcRoutes);
app.use('/api/sessions', authenticate, sessionRoutes);
app.use('/api/reservations', authenticate, reservationRoutes);
app.use('/api/tournaments', authenticate, tournamentRoutes);
app.use('/api/cafes', authenticate, cafeRoutes);
app.use('/api/audit-logs', authenticate, auditRoutes);

app.use(errorHandler);

io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token as string;
  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      (socket as any).user = decoded;
    } catch { /* auth optional for socket */ }
  }
  next();
});

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-user', (userId: string) => {
    socket.join(`user:${userId}`);
  });

  socket.on('leave-user', (userId: string) => {
    socket.leave(`user:${userId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

async function connectWithRetry(retries = 5, delay = 3000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      logger.info('Database connected successfully');
      return;
    } catch (error: any) {
      const isLast = i === retries - 1;
      logger.error(`DB connection attempt ${i + 1}/${retries} failed: ${error?.message || error}`);
      if (isLast) throw error;
      logger.info(`Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function startServer() {
  try {
    await connectWithRetry();

    await runMigrations();
    await seedIfEmpty();

    httpServer.listen(config.port, () => {
      logger.info(`${config.appName} server running on port ${config.port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  io.close(() => logger.info('Socket.IO server closed'));
  httpServer.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info('Database disconnected');
    } catch (error) {
      logger.error('Error disconnecting database:', error);
    }
    logger.info('Server closed');
    process.exit(0);
  });
  setTimeout(() => { logger.error('Forced shutdown after timeout'); process.exit(1); }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
