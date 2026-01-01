/**
 * @swagger
 * tags:
 *   name: User
 *   description: User endpoints
 */
/**
 * @swagger
 * /api/v1/user/group/{groupId}:
 *   get:
 *     summary: Get users in a group (protected)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Users list
 */
import express from "express";
import {
  getUserInGroup,
  getUserStatsInGroup,
  getUserStats,
  editAvatarImage,
} from "../controllers/user.controller.js";

import { protectedRoute } from "../middleware/auth.middleware.js";
import upload from "../lib/multer.js";

const router = express.Router();

/**
 * GET
 */
router.get("/group/:groupId", protectedRoute, getUserInGroup);
router.get("/group/:groupId/stats", protectedRoute, getUserStatsInGroup);
router.get("/me/stats", protectedRoute, getUserStats);

/**
 * PUT
 */
router.put(
  "/me/avatar",
  protectedRoute,
  upload.single("image"),
  editAvatarImage
);

export default router;
