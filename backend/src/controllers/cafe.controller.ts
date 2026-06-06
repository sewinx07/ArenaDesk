import { Request, Response, NextFunction } from 'express';
import { AuthUser } from '../types';
import { cafeService } from '../services/cafe.service';
import { HTTP_CODES } from '../utils/constants';

export class CafeController {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUser;
      const cafes = await cafeService.list(user.id);
      res.status(HTTP_CODES.OK).json({ success: true, data: cafes });
    } catch (error) { next(error); }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUser;
      const cafe = await cafeService.create({ ...req.body, ownerId: user.id });
      res.status(HTTP_CODES.CREATED).json({ success: true, data: cafe });
    } catch (error) { next(error); }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const cafe = await cafeService.getById(req.params.id);
      res.status(HTTP_CODES.OK).json({ success: true, data: cafe });
    } catch (error) { next(error); }
  }
}

export const cafeController = new CafeController();
