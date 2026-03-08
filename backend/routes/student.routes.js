import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', requireRole('admin', 'teacher'), getAllStudents);
router.get('/:id', getStudentById);
router.post('/', requireRole('admin'), createStudent);
router.put('/:id', requireRole('admin', 'teacher'), updateStudent);
router.delete('/:id', requireRole('admin'), deleteStudent);

export default router;
