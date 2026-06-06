import { Request, Response, NextFunction } from 'express';
import { pcService } from '../services/pc.service';
import { HTTP_CODES } from '../utils/constants';

export class PcController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const pcs = await pcService.list(req.query.cafeId as string, req.query.status as string);
      res.status(HTTP_CODES.OK).json({ success: true, data: pcs });
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const pc = await pcService.create(req.body);
      res.status(HTTP_CODES.CREATED).json({ success: true, data: pc });
    } catch (error) { next(error); }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const pc = await pcService.update(req.params.id, req.body);
      res.status(HTTP_CODES.OK).json({ success: true, data: pc });
    } catch (error) { next(error); }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await pcService.delete(req.params.id);
      res.status(HTTP_CODES.NO_CONTENT).send();
    } catch (error) { next(error); }
  }
}

export const pcController = new PcController();
