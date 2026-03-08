import { Router } from 'express';
import {
  getAllParents,
  getParentById,
  createParent,
  updateParent,
  deleteParent,
} from '../controllers/parent.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/',    requireRole('admin', 'teacher'), getAllParents);
router.get('/:id', getParentById);
router.post('/',   requireRole('admin'), createParent);
router.put('/:id', requireRole('admin'), updateParent);
router.delete('/:id', requireRole('admin'), deleteParent);

export default router;
