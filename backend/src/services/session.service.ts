import prisma from './prisma';
import { AppError } from '../middleware/errorHandler';
import { HTTP_CODES } from '../utils/constants';
import { calculateDuration, calculateCost } from '../utils/helpers';
import { auditService } from './audit.service';

export class SessionService {
  async startSession(data: { pcId: string; userId: string; cafeId: string }) {
    const pc = await prisma.pC.findUnique({ where: { id: data.pcId } });
    if (!pc) throw new AppError('PC not found', HTTP_CODES.NOT_FOUND);
    if (pc.status !== 'available') throw new AppError('PC is not available', HTTP_CODES.CONFLICT);

    const [session] = await prisma.$transaction([
      prisma.session.create({
        data: { pcId: data.pcId, userId: data.userId, startTime: new Date(), status: 'active' },
      }),
      prisma.pC.update({
        where: { id: data.pcId },
        data: { status: 'in_use' },
      }),
    ]);

    await auditService.log({
      userId: data.userId,
      cafeId: data.cafeId,
      action: 'session_started',
      details: { sessionId: session.id, pcId: data.pcId },
    });

    return session;
  }

  async endSession(data: { sessionId: string; userId: string; cafeId: string; paymentMethod: string }) {
    const session = await prisma.session.findUnique({
      where: { id: data.sessionId },
      include: { pc: true },
    });
    if (!session) throw new AppError('Session not found', HTTP_CODES.NOT_FOUND);
    if (session.status !== 'active') throw new AppError('Session is not active', HTTP_CODES.BAD_REQUEST);

    const endTime = new Date();
    const durationHours = calculateDuration(session.startTime, endTime);
    const totalPrice = calculateCost(durationHours, session.pc.hourlyRate);

    const [updatedSession] = await prisma.$transaction([
      prisma.session.update({
        where: { id: data.sessionId },
        data: { endTime, totalPrice, status: 'completed' },
      }),
      prisma.pC.update({
        where: { id: session.pcId },
        data: { status: 'available' },
      }),
    ]);

    await prisma.transaction.create({
      data: {
        sessionId: data.sessionId,
        userId: data.userId,
        amount: totalPrice,
        paymentMethod: data.paymentMethod,
      },
    });

    await auditService.log({
      userId: data.userId,
      cafeId: data.cafeId,
      action: 'session_ended',
      details: { sessionId: data.sessionId, totalPrice, durationHours, paymentMethod: data.paymentMethod },
    });

    return updatedSession;
  }

  async getActiveSessions(cafeId?: string) {
    const where: any = { status: 'active' };
    if (cafeId) {
      where.pc = { cafeId };
    }
    return prisma.session.findMany({
      where,
      include: {
        pc: { select: { id: true, name: true, cafeId: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async getSessionHistory(params: {
    userId?: string;
    pcId?: string;
    startDate?: Date;
    endDate?: Date;
    cafeId?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.pcId) where.pcId = params.pcId;
    if (params.startDate || params.endDate) {
      where.startTime = {};
      if (params.startDate) where.startTime.gte = params.startDate;
      if (params.endDate) where.startTime.lte = params.endDate;
    }
    if (params.cafeId) {
      where.pc = { cafeId: params.cafeId };
    }

    const [data, total] = await Promise.all([
      prisma.session.findMany({
        where,
        include: {
          pc: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
          transaction: true,
        },
        skip: params.skip || 0,
        take: params.take || 20,
        orderBy: { startTime: 'desc' },
      }),
      prisma.session.count({ where }),
    ]);

    return { data, total };
  }
}

export const sessionService = new SessionService();
