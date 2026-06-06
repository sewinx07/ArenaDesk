import { Router } from 'express';
import { tournamentController } from '../controllers/tournament.controller';
import { authenticate, requireRole } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const createTournamentSchema = z.object({
  cafeId: z.string().min(1, 'Cafe ID is required'),
  name: z.string().min(1, 'Name is required'),
  game: z.string().min(1, 'Game is required'),
});

router.use(authenticate);

router.get('/', tournamentController.list.bind(tournamentController));
router.post('/', requireRole('owner', 'staff'), validate(createTournamentSchema), tournamentController.create.bind(tournamentController));
router.post('/:id/join', tournamentController.join.bind(tournamentController));

export default router;
