import { Router } from 'express';
import {
  getAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmissionStatus,
  deleteAdmission,
} from '../controllers/admission.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Public route – anyone can submit an application
router.post('/', createAdmission);

// Protected routes – require authentication
router.get('/',    verifyToken, requireRole('admin'), getAdmissions);
router.get('/:id', verifyToken, requireRole('admin'), getAdmissionById);
router.put('/:id/status', verifyToken, requireRole('admin'), updateAdmissionStatus);
router.delete('/:id', verifyToken, requireRole('admin'), deleteAdmission);

export default router;
