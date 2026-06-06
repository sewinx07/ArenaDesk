import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { JWTPayload, AuthUser } from '../types';
import { HTTP_CODES } from '../utils/constants';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        error: 'Authentication required. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    } as AuthUser;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(HTTP_CODES.UNAUTHORIZED).json({ success: false, error: 'Token has expired.' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(HTTP_CODES.UNAUTHORIZED).json({ success: false, error: 'Invalid token.' });
      return;
    }
    res.status(HTTP_CODES.UNAUTHORIZED).json({ success: false, error: 'Authentication failed.' });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as AuthUser | undefined;
    if (!user) {
      res.status(HTTP_CODES.UNAUTHORIZED).json({ success: false, error: 'Authentication required.' });
      return;
    }
    if (!roles.includes(user.role)) {
      res.status(HTTP_CODES.FORBIDDEN).json({
        success: false,
        error: `Access denied. Required role: ${roles.join(' or ')}`,
      });
      return;
    }
    next();
  };
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
      req.user = { id: decoded.userId, email: decoded.email, role: decoded.role } as AuthUser;
    }
  } catch {
    // Token invalid or expired - continue without user
  }
  next();
};
