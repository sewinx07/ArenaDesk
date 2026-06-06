import prisma from './prisma';
import { AppError } from '../middleware/errorHandler';
import { HTTP_CODES } from '../utils/constants';

export class PcService {
  async list(cafeId?: string, status?: string) {
    const where: any = {};
    if (cafeId) where.cafeId = cafeId;
    if (status) where.status = status;
    return prisma.pC.findMany({ where, orderBy: { name: 'asc' } });
  }

  async create(data: { name: string; cafeId: string; hourlyRate: number }) {
    const cafe = await prisma.cafe.findUnique({ where: { id: data.cafeId } });
    if (!cafe) throw new AppError('Cafe not found', HTTP_CODES.NOT_FOUND);
    return prisma.pC.create({ data });
  }

  async update(id: string, data: { name?: string; status?: string; hourlyRate?: number }) {
    const pc = await prisma.pC.findUnique({ where: { id } });
    if (!pc) throw new AppError('PC not found', HTTP_CODES.NOT_FOUND);
    return prisma.pC.update({ where: { id }, data });
  }

  async delete(id: string) {
    const pc = await prisma.pC.findUnique({ where: { id } });
    if (!pc) throw new AppError('PC not found', HTTP_CODES.NOT_FOUND);
    const activeSession = await prisma.session.findFirst({ where: { pcId: id, status: 'active' } });
    if (activeSession) throw new AppError('Cannot delete PC with active session', HTTP_CODES.CONFLICT);
    return prisma.pC.delete({ where: { id } });
  }
}

export const pcService = new PcService();
