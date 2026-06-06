import { Router } from 'express';
import { reservationController } from '../controllers/reservation.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const createReservationSchema = z.object({
  pcId: z.string().min(1, 'PC ID is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
});

const updateStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
});

router.use(authenticate);

router.get('/', reservationController.list.bind(reservationController));
router.post('/', validate(createReservationSchema), reservationController.create.bind(reservationController));
router.patch('/:id', validate(updateStatusSchema), reservationController.updateStatus.bind(reservationController));

export default router;
