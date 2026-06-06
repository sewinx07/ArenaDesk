import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthUser } from '../types';
import { HTTP_CODES } from '../utils/constants';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(HTTP_CODES.CREATED).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(HTTP_CODES.OK).json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user as AuthUser;
      const profile = await authService.getMe(user.id);
      res.status(HTTP_CODES.OK).json({ success: true, data: profile });
    } catch (error) { next(error); }
  }
}

export const authController = new AuthController();
