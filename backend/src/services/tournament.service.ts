import prisma from './prisma';
import { AppError } from '../middleware/errorHandler';
import { HTTP_CODES } from '../utils/constants';

export class TournamentService {
  async list(params: { cafeId?: string; status?: string; skip?: number; take?: number }) {
    const where: any = {};
    if (params.cafeId) where.cafeId = params.cafeId;
    if (params.status) where.status = params.status;

    const [data, total] = await Promise.all([
      prisma.tournament.findMany({
        where,
        include: { _count: { select: { participants: true } } },
        skip: params.skip || 0,
        take: params.take || 20,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.tournament.count({ where }),
    ]);
    return { data, total };
  }

  async create(data: { cafeId: string; name: string; game: string }) {
    const cafe = await prisma.cafe.findUnique({ where: { id: data.cafeId } });
    if (!cafe) throw new AppError('Cafe not found', HTTP_CODES.NOT_FOUND);
    return prisma.tournament.create({ data: { cafeId: data.cafeId, name: data.name, game: data.game } });
  }

  async join(tournamentId: string, userId: string, teamName?: string) {
    const tournament = await prisma.tournament.findUnique({ where: { id: tournamentId } });
    if (!tournament) throw new AppError('Tournament not found', HTTP_CODES.NOT_FOUND);
    if (tournament.status !== 'registration') {
      throw new AppError('Tournament is not accepting registrations', HTTP_CODES.BAD_REQUEST);
    }

    const existing = await prisma.tournamentParticipant.findFirst({
      where: { tournamentId, userId },
    });
    if (existing) throw new AppError('Already registered for this tournament', HTTP_CODES.CONFLICT);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError('User not found', HTTP_CODES.NOT_FOUND);

    return prisma.tournamentParticipant.create({
      data: { tournamentId, userId, teamName },
    });
  }
}

export const tournamentService = new TournamentService();
