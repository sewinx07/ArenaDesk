import { Router } from 'express';
import { sessionController } from '../controllers/session.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const startSessionSchema = z.object({
  pcId: z.string().min(1, 'PC ID is required'),
  cafeId: z.string().min(1, 'Cafe ID is required'),
});

const endSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  cafeId: z.string().min(1, 'Cafe ID is required'),
  paymentMethod: z.enum(['cash', 'card', 'mobile']),
});

router.use(authenticate);

router.post('/start', requireRole('owner', 'staff'), validate(startSessionSchema), sessionController.startSession.bind(sessionController));
router.post('/end', requireRole('owner', 'staff'), validate(endSessionSchema), sessionController.endSession.bind(sessionController));
router.get('/active', sessionController.getActiveSessions.bind(sessionController));
router.get('/history', sessionController.getHistory.bind(sessionController));

export default router;
