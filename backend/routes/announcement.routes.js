import { Router } from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcement.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAnnouncements);
router.post('/', verifyToken, requireRole('admin', 'teacher'), createAnnouncement);
router.delete('/:id', verifyToken, requireRole('admin'), deleteAnnouncement);

export default router;
