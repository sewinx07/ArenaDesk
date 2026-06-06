import { Router } from 'express';
import { cafeController } from '../controllers/cafe.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const createCafeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().optional(),
});

router.use(authenticate);

router.get('/', cafeController.list.bind(cafeController));
router.post('/', requireRole('owner'), validate(createCafeSchema), cafeController.create.bind(cafeController));
router.get('/:id', cafeController.getById.bind(cafeController));

export default router;
