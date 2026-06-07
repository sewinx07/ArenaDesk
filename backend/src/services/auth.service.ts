import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma';
import config from '../config';
import { AppError } from '../middleware/errorHandler';
import { HTTP_CODES } from '../utils/constants';
import { JWTPayload } from '../types';

export class AuthService {
  async register(data: { name: string; email: string; password: string; role?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError('Email already registered', HTTP_CODES.CONFLICT);
    }

    const passwordHash = await bcrypt.hash(data.password, config.bcryptSaltRounds);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role || 'customer',
      },
    });

    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', HTTP_CODES.UNAUTHORIZED);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid email or password', HTTP_CODES.UNAUTHORIZED);
    }

    let cafeId: string | null = null;
    if (user.role === 'owner') {
      const cafe = await prisma.cafe.findFirst({ where: { ownerId: user.id }, select: { id: true } });
      cafeId = cafe?.id || null;
    } else if (user.role === 'staff') {
      const cafe = await prisma.cafe.findFirst({ where: { staff: { some: { id: user.id } } }, select: { id: true } });
      cafeId = cafe?.id || null;
    }

    return this.generateTokens(user, cafeId);
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    if (!user) throw new AppError('User not found', HTTP_CODES.NOT_FOUND);
    return user;
  }

  private generateTokens(user: any, cafeId?: string | null) {
    const payload: JWTPayload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret || config.jwtSecret, { expiresIn: config.jwtRefreshExpiresIn } as jwt.SignOptions);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, cafeId: cafeId || null },
    };
  }
}

export const authService = new AuthService();
