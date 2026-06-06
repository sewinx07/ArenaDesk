import { Request, Response, NextFunction } from 'express';
import { AuthUser } from '../types';
import { sessionService } from '../services/session.service';
import { HTTP_CODES } from '../utils/constants';
import { parsePagination, parseDateRange } from '../utils/helpers';

export class SessionController {
  async startSession(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUser;
      const session = await sessionService.startSession({
        pcId: req.body.pcId,
        userId: user.id,
        cafeId: req.body.cafeId,
      });
      res.status(HTTP_CODES.CREATED).json({ success: true, data: session });
    } catch (error) { next(error); }
  }

  async endSession(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUser;
      const session = await sessionService.endSession({
        sessionId: req.body.sessionId,
        userId: user.id,
        cafeId: req.body.cafeId,
        paymentMethod: req.body.paymentMethod,
      });
      res.status(HTTP_CODES.OK).json({ success: true, data: session });
    } catch (error) { next(error); }
  }

  async getActiveSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await sessionService.getActiveSessions(req.query.cafeId as string);
      res.status(HTTP_CODES.OK).json({ success: true, data: sessions });
    } catch (error) { next(error); }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query as any);
      const dateRange = parseDateRange(req.query as any);
      const result = await sessionService.getSessionHistory({
        userId: req.query.userId as string,
        pcId: req.query.pcId as string,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        cafeId: req.query.cafeId as string,
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
}

export const sessionController = new SessionController();
