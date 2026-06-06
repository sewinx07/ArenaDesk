import prisma from './prisma';

export class AuditService {
  async log(data: { userId: string; cafeId?: string; action: string; details?: any }) {
    return prisma.auditLog.create({ data });
  }

  async list(params: { cafeId?: string; skip?: number; take?: number }) {
    const where: any = {};
    if (params.cafeId) where.cafeId = params.cafeId;

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: { user: { select: { id: true, name: true } } },
        skip: params.skip || 0,
        take: params.take || 50,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);
    return { data, total };
  }
}

export const auditService = new AuditService();
