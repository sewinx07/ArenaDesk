import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service';
import { HTTP_CODES } from '../utils/constants';
import { parsePagination } from '../utils/helpers';

export class AuditController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = parsePagination(req.query as any);
      const result = await auditService.list({
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

export const auditController = new AuditController();
