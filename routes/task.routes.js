import express from 'express';
import {
  getAllTaskInGroup,
  getMyTasks,
  createTask,
  updateTask,
  deleteTask,
  uploadProof
} from '../controllers/task.controller.js';

import {protectedRoute} from '../middleware/auth.middleware.js';
import upload from '../lib/multer.js';

const router = express.Router();

/**
 * GET
 */
router.get('/group/:groupId', protectedRoute, getAllTaskInGroup);
router.get('/me', protectedRoute, getMyTasks);

/**
 * POST
 */
router.post('/group/:groupId', protectedRoute, createTask);
router.post(
  '/:taskId/proof',
  protectedRoute,
  upload.single('image'),
  uploadProof
);

/**
 * PUT
 */
router.put('/:taskId', protectedRoute, updateTask);

/**
 * DELETE
 */
router.delete('/:taskId', protectedRoute, deleteTask);

export default router;
