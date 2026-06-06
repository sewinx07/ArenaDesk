import { Router } from 'express';
import { auditController } from '../controllers/audit.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.use(requireRole('owner', 'staff'));

router.get('/', auditController.list.bind(auditController));

export default router;
