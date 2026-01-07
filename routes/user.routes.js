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
 *     summary: Get all users in a group (protected)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group (UUID)
 *     responses:
 *       200:
 *         description: List of users in the group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groupId:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       email:
 *                         type: string
 *                       name:
 *                         type: string
 *                       lastname:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       UserGroupTask:
 *                         type: object
 *                         properties:
 *                           isAdmin:
 *                             type: boolean
 *                           penalty_status:
 *                             type: boolean
*                 length:
*                    type: integer
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/user/group/{groupId}/stats:
 *   get:
 *     summary: Get statistics for all users in a group (protected)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group (UUID)
 *     responses:
 *       200:
 *         description: User statistics in the group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   totalTasks:
 *                     type: string
 *                     format: uuid
 *                     description: Total number of tasks assigned to user
 *                   completedTasks:
 *                     type: integer
 *                     description: Number of completed tasks
 *                   penaltyCount:
 *                     type: integer
 *                     description: Number of penalties received
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/user/me/stats:
 *   get:
 *     summary: Get statistics for the current user (protected)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 totalTasks:
 *                   type: integer
 *                   description: Total number of tasks assigned to user
 *                 completedTasks:
 *                   type: integer
 *                   description: Number of completed tasks
 *                 penaltyCount:
 *                   type: integer
 *                   description: Number of penalties received
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/user/me/avatar:
 *   put:
 *     summary: Update user avatar (protected)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar updated successfully
 *                 user:
 *                   type: object
 *                   description: Updated user object without password
 *       400:
 *         description: No image file provided
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
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
