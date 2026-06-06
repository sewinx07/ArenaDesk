import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import logger from '../utils/logger';
import { HTTP_CODES } from '../utils/constants';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number = HTTP_CODES.INTERNAL, errors?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      errors: err.errors,
    });
    return;
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(e.message);
    });
    res.status(HTTP_CODES.UNPROCESSABLE).json({
      success: false,
      error: 'Validation failed',
      errors,
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(HTTP_CODES.CONFLICT).json({
        success: false,
        error: 'A record with this value already exists.',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(HTTP_CODES.NOT_FOUND).json({
        success: false,
        error: 'Record not found.',
      });
      return;
    }
    if (err.code === 'P2003') {
      res.status(HTTP_CODES.BAD_REQUEST).json({
        success: false,
        error: 'Referenced record does not exist.',
      });
      return;
    }
  }

  res.status(HTTP_CODES.INTERNAL).json({
    success: false,
    error: 'Internal server error',
  });
};
