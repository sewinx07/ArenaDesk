import prisma from './prisma';
import { AppError } from '../middleware/errorHandler';
import { HTTP_CODES } from '../utils/constants';

export class CafeService {
  async list(userId: string) {
    const [owned, staff] = await Promise.all([
      prisma.cafe.findMany({ where: { ownerId: userId } }),
      prisma.cafe.findMany({ where: { staff: { some: { id: userId } } } }),
    ]);
    return [...owned, ...staff];
  }

  async getById(id: string) {
    const cafe = await prisma.cafe.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        staff: { select: { id: true, name: true, email: true } },
        pcs: true,
      },
    });
    if (!cafe) throw new AppError('Cafe not found', HTTP_CODES.NOT_FOUND);
    return cafe;
  }

  async create(data: { name: string; location?: string; ownerId: string }) {
    return prisma.cafe.create({ data });
  }
}

export const cafeService = new CafeService();
