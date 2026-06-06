import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      requestId?: string;
    }
  }
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user: AuthUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: { page: number; limit: number; total: number; totalPages: number };
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
