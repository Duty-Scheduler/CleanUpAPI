/**
 * @swagger
 * tags:
 *   name: Penalty
 *   description: Penalty endpoints
 */
/**
 * @swagger
 * /api/v1/penalty/{taskId}/{groupId}/{foulUserId}:
 *   post:
 *     summary: Create a penalty for a user (protected)
 *     tags: [Penalty]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *       - in: path
 *         name: foulUserId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Penalty created
 */
import express from "express";
import {
  createPenalty,
  getPenaltyByUserIdAndGroupId,
  getMyPenalty,
  searchPenaltyByTitle,
  deletePenalty,
} from "../controllers/penalty.controller.js";

import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:taskId/:groupId/:foulUserId", protectedRoute, createPenalty);

router.delete("/:taskId/:groupId/:foulUserId", protectedRoute, deletePenalty);

router.get("/me", protectedRoute, getMyPenalty);

router.get(
  "/group/:groupId/user/:userId",
  protectedRoute,
  getPenaltyByUserIdAndGroupId
);

router.get("/group/:groupId/search", protectedRoute, searchPenaltyByTitle);

export default router;
