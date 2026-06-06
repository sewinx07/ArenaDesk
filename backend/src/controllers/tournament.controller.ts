import { Request, Response, NextFunction } from 'express';
import { tournamentService } from '../services/tournament.service';
import { AuthUser } from '../types';
import { HTTP_CODES } from '../utils/constants';
import { parsePagination } from '../utils/helpers';

export class TournamentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const tournament = await tournamentService.create(req.body);
      res.status(HTTP_CODES.CREATED).json({ success: true, data: tournament });
    } catch (error) { next(error); }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query as any);
      const result = await tournamentService.list({
        cafeId: req.query.cafeId as string,
        status: req.query.status as string,
        skip: (page - 1) * limit,
        take: limit,
      });
      res.status(HTTP_CODES.OK).json({
        success: true,
        data: result.data,
        meta: { page, limit, total: result.total, totalPages: Math.ceil(result.total / limit) },
      });
    } catch (error) { next(error); }
  }

  async join(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUser;
      const participant = await tournamentService.join(req.params.id, user.id, req.body.teamName);
      res.status(HTTP_CODES.CREATED).json({ success: true, data: participant });
    } catch (error) { next(error); }
  }
}

export const tournamentController = new TournamentController();
