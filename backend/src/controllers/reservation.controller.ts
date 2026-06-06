import { Request, Response, NextFunction } from 'express';
import { AuthUser } from '../types';
import { reservationService } from '../services/reservation.service';
import { HTTP_CODES } from '../utils/constants';
import { parsePagination } from '../utils/helpers';

export class ReservationController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUser;
      const reservation = await reservationService.create({
        userId: user.id,
        pcId: req.body.pcId,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });
      res.status(HTTP_CODES.CREATED).json({ success: true, data: reservation });
    } catch (error) { next(error); }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query as any);
      const result = await reservationService.list({
        userId: req.query.userId as string,
        status: req.query.status as string,
        cafeId: req.query.cafeId as string,
        date: req.query.date as string,
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

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await reservationService.updateStatus(req.params.id, req.body.status);
      res.status(HTTP_CODES.OK).json({ success: true, data: reservation });
    } catch (error) { next(error); }
  }
}

export const reservationController = new ReservationController();
