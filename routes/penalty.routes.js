import express from 'express';
import {
  createPenalty,
  getPenaltyByUserIdAndGroupId,
  getMyPenalty,
  searchPenaltyByTitle
} from '../controllers/penalty.controller.js';

import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post(
  '/:taskId/:groupId/:foulUserId',
  protectedRoute,
  createPenalty
);

router.get(
  '/me',
  protectedRoute,
  getMyPenalty
);

router.get(
  '/group/:groupId/user/:userId',
  protectedRoute,
  getPenaltyByUserIdAndGroupId
);

router.get(
  '/group/:groupId/search',
  protectedRoute,
  searchPenaltyByTitle
);

export default router;
