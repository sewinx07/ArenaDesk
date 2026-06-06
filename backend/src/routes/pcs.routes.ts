import { Router } from 'express';
import { pcController } from '../controllers/pc.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const createPcSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  cafeId: z.string().min(1, 'Cafe ID is required'),
  hourlyRate: z.number().min(0, 'Hourly rate must be non-negative'),
});

const updatePcSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(['available', 'in_use', 'reserved', 'offline']).optional(),
  hourlyRate: z.number().min(0).optional(),
});

router.use(authenticate);

router.get('/', pcController.list.bind(pcController));
router.post('/', requireRole('owner', 'staff'), validate(createPcSchema), pcController.create.bind(pcController));
router.patch('/:id', requireRole('owner', 'staff'), validate(updatePcSchema), pcController.update.bind(pcController));
router.delete('/:id', requireRole('owner'), pcController.delete.bind(pcController));

export default router;
