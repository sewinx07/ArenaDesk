import prisma from './prisma';
import { AppError } from '../middleware/errorHandler';
import { HTTP_CODES } from '../utils/constants';
import { calculateCost } from '../utils/helpers';

export class BillingService {
  calculateCost(session: { totalPrice?: number | null }, hours: number, hourlyRate: number): number {
    if (session.totalPrice) return session.totalPrice;
    return calculateCost(hours, hourlyRate);
  }

  async createTransaction(data: {
    sessionId: string;
    amount: number;
    paymentMethod: string;
    userId: string;
  }) {
    const session = await prisma.session.findUnique({ where: { id: data.sessionId } });
    if (!session) throw new AppError('Session not found', HTTP_CODES.NOT_FOUND);

    return prisma.transaction.create({
      data: {
        sessionId: data.sessionId,
        userId: data.userId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
      },
    });
  }

  async getRevenueByDateRange(startDate: Date, endDate: Date, cafeId?: string) {
    const where: any = { createdAt: { gte: startDate, lte: endDate } };
    if (cafeId) {
      where.session = { pc: { cafeId } };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: { session: { include: { pc: true } } },
    });

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    return { total: Math.round(total * 100) / 100, count: transactions.length, transactions };
  }

  async getOutstandingBalance(cafeId?: string) {
    const where: any = {
      endTime: { not: null },
      totalPrice: { not: null },
      transaction: null,
    };
    if (cafeId) {
      where.pc = { cafeId };
    }

    const unpaidSessions = await prisma.session.findMany({
      where,
      include: { pc: true, user: { select: { id: true, name: true } } },
    });

    const totalOutstanding = unpaidSessions.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    return {
      totalOutstanding: Math.round(totalOutstanding * 100) / 100,
      count: unpaidSessions.length,
      sessions: unpaidSessions,
    };
  }

  applyDiscount(amount: number, discountPercent: number): number {
    const discounted = amount * (1 - discountPercent / 100);
    return Math.round(discounted * 100) / 100;
  }
}

export const billingService = new BillingService();
