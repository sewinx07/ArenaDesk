import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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

async function seedIfEmpty() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      logger.info(`Database has ${userCount} users — skip seed`);
      return;
    }
    logger.info('Database empty — seeding...');

    const hash = await bcrypt.hash('password123', 12);

    const owner = await prisma.user.upsert({
      where: { email: 'owner@arenadesk.com' },
      update: {},
      create: { name: 'Alex Owner', email: 'owner@arenadesk.com', passwordHash: hash, role: 'owner' },
    });
    const staff1 = await prisma.user.upsert({
      where: { email: 'staff1@arenadesk.com' },
      update: {},
      create: { name: 'John Staff', email: 'staff1@arenadesk.com', passwordHash: hash, role: 'staff' },
    });
    const staff2 = await prisma.user.upsert({
      where: { email: 'staff2@arenadesk.com' },
      update: {},
      create: { name: 'Jane Staff', email: 'staff2@arenadesk.com', passwordHash: hash, role: 'staff' },
    });
    const customer1 = await prisma.user.upsert({
      where: { email: 'customer1@example.com' },
      update: {},
      create: { name: 'Bob Smith', email: 'customer1@example.com', passwordHash: hash, role: 'customer' },
    });
    const customer2 = await prisma.user.upsert({
      where: { email: 'customer2@example.com' },
      update: {},
      create: { name: 'Alice Johnson', email: 'customer2@example.com', passwordHash: hash, role: 'customer' },
    });
    const customer3 = await prisma.user.upsert({
      where: { email: 'customer3@example.com' },
      update: {},
      create: { name: 'Charlie Brown', email: 'customer3@example.com', passwordHash: hash, role: 'customer' },
    });

    const cafe = await prisma.cafe.create({
      data: { name: 'ArenaDesk Downtown', location: '123 Gaming Street', ownerId: owner.id },
    });
    await prisma.cafe.update({
      where: { id: cafe.id },
      data: { staff: { connect: [{ id: staff1.id }, { id: staff2.id }] } },
    });

    const pcs = await Promise.all([
      prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-01', hourlyRate: 5.00 } }),
      prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-02', hourlyRate: 5.00 } }),
      prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-03', hourlyRate: 5.00 } }),
      prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-04', hourlyRate: 8.00 } }),
      prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-05', hourlyRate: 8.00 } }),
      prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-06', hourlyRate: 4.00 } }),
      prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-07', hourlyRate: 4.00 } }),
      prisma.pC.create({ data: { cafeId: cafe.id, name: 'PC-08', hourlyRate: 6.00 } }),
    ]);

    const activeSessions = await Promise.all([
      prisma.session.create({ data: { pcId: pcs[0].id, userId: customer1.id, startTime: new Date(Date.now() - 30 * 60000), status: 'active' } }),
      prisma.session.create({ data: { pcId: pcs[1].id, userId: customer2.id, startTime: new Date(Date.now() - 60 * 60000), status: 'active' } }),
      prisma.session.create({ data: { pcId: pcs[3].id, userId: customer3.id, startTime: new Date(Date.now() - 15 * 60000), status: 'active' } }),
      prisma.session.create({ data: { pcId: pcs[4].id, userId: customer1.id, startTime: new Date(Date.now() - 120 * 60000), status: 'active' } }),
      prisma.session.create({ data: { pcId: pcs[5].id, userId: customer2.id, startTime: new Date(Date.now() - 45 * 60000), status: 'active' } }),
    ]);
    await Promise.all([
      prisma.pC.update({ where: { id: pcs[0].id }, data: { status: 'in_use' } }),
      prisma.pC.update({ where: { id: pcs[1].id }, data: { status: 'in_use' } }),
      prisma.pC.update({ where: { id: pcs[3].id }, data: { status: 'in_use' } }),
      prisma.pC.update({ where: { id: pcs[4].id }, data: { status: 'in_use' } }),
      prisma.pC.update({ where: { id: pcs[5].id }, data: { status: 'in_use' } }),
    ]);

    const completedSession = await prisma.session.create({
      data: { pcId: pcs[2].id, userId: customer3.id, startTime: new Date(Date.now() - 3 * 3600000), endTime: new Date(Date.now() - 2 * 3600000), totalPrice: 5.00, status: 'completed' },
    });

    const tomorrow = new Date(Date.now() + 24 * 3600000);
    await Promise.all([
      prisma.reservation.create({ data: { userId: customer1.id, pcId: pcs[6].id, startTime: new Date(tomorrow.getTime() + 10 * 3600000), endTime: new Date(tomorrow.getTime() + 12 * 3600000), status: 'confirmed' } }),
      prisma.reservation.create({ data: { userId: customer2.id, pcId: pcs[7].id, startTime: new Date(tomorrow.getTime() + 14 * 3600000), endTime: new Date(tomorrow.getTime() + 16 * 3600000), status: 'pending' } }),
      prisma.reservation.create({ data: { userId: customer3.id, pcId: pcs[2].id, startTime: new Date(tomorrow.getTime() + 18 * 3600000), endTime: new Date(tomorrow.getTime() + 20 * 3600000), status: 'confirmed' } }),
    ]);

    await prisma.transaction.create({ data: { sessionId: completedSession.id, userId: customer3.id, amount: 5.00, paymentMethod: 'cash' } });

    for (const session of activeSessions) {
      await prisma.auditLog.create({ data: { userId: session.userId, cafeId: cafe.id, action: 'session_started', details: { sessionId: session.id, pcId: session.pcId } } });
    }
    await prisma.auditLog.create({ data: { userId: customer3.id, cafeId: cafe.id, action: 'session_ended', details: { sessionId: completedSession.id, totalPrice: 5.00, durationHours: 1 } } });

    const tournament = await prisma.tournament.create({ data: { cafeId: cafe.id, name: 'Weekend Valorant Cup', game: 'Valorant', status: 'registration' } });
    const tUsers = [customer1, customer2, customer3, owner];
    for (let i = 0; i < tUsers.length; i++) {
      await prisma.tournamentParticipant.create({ data: { tournamentId: tournament.id, userId: tUsers[i].id, teamName: `Team ${i + 1}` } });
    }

    logger.info('Seed complete');
  } catch (error: any) {
    logger.error('Seed failed: ' + (error?.message || error));
    throw error;
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
