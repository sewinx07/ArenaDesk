import prisma from './prisma';
import { AppError } from '../middleware/errorHandler';
import { HTTP_CODES } from '../utils/constants';

export class ReservationService {
  async create(data: { userId: string; pcId: string; startTime: string; endTime: string }) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);

    if (startTime >= endTime) {
      throw new AppError('Start time must be before end time', HTTP_CODES.BAD_REQUEST);
    }
    if (startTime < new Date()) {
      throw new AppError('Start time cannot be in the past', HTTP_CODES.BAD_REQUEST);
    }

    const pc = await prisma.pC.findUnique({ where: { id: data.pcId } });
    if (!pc) throw new AppError('PC not found', HTTP_CODES.NOT_FOUND);
    if (pc.status === 'offline') throw new AppError('PC is offline', HTTP_CODES.BAD_REQUEST);

    const conflicting = await prisma.reservation.findFirst({
      where: {
        pcId: data.pcId,
        status: { in: ['pending', 'confirmed'] },
        startTime: { lt: endTime },
        endTime: { gt: startTime },
      },
    });
    if (conflicting) {
      throw new AppError('PC already has a reservation in this time slot', HTTP_CODES.CONFLICT);
    }

    return prisma.reservation.create({
      data: { userId: data.userId, pcId: data.pcId, startTime, endTime, status: 'pending' },
    });
  }

  async list(params: { userId?: string; status?: string; cafeId?: string; date?: string; skip?: number; take?: number }) {
    const where: any = {};
    if (params.userId) where.userId = params.userId;
    if (params.status) where.status = params.status;
    if (params.cafeId) where.pc = { cafeId: params.cafeId };
    if (params.date) {
      const date = new Date(params.date);
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      where.startTime = { gte: startOfDay, lte: endOfDay };
    }

    const [data, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          pc: { select: { id: true, name: true } },
        },
        skip: params.skip || 0,
        take: params.take || 20,
        orderBy: { startTime: 'desc' },
      }),
      prisma.reservation.count({ where }),
    ]);

    return { data, total };
  }

  async updateStatus(id: string, status: string) {
    const validTransitions: Record<string, string[]> = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      cancelled: [],
      completed: [],
    };

    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) throw new AppError('Reservation not found', HTTP_CODES.NOT_FOUND);

    if (!validTransitions[reservation.status]?.includes(status)) {
      throw new AppError(`Cannot transition from ${reservation.status} to ${status}`, HTTP_CODES.BAD_REQUEST);
    }

    return prisma.reservation.update({ where: { id }, data: { status } });
  }
}

export const reservationService = new ReservationService();
