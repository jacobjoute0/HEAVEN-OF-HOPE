import { Router } from 'express';
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from '../controllers/teacher.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', requireRole('admin'), getAllTeachers);
router.get('/:id', requireRole('admin'), getTeacherById);
router.post('/', requireRole('admin'), createTeacher);
router.put('/:id', requireRole('admin'), updateTeacher);
router.delete('/:id', requireRole('admin'), deleteTeacher);

export default router;
