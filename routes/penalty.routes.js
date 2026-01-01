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
 *     summary: Create a penalty for a user (protected, admin only)
 *     tags: [Penalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group
 *       - in: path
 *         name: foulUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user who committed the foul
 *     responses:
 *       201:
 *         description: Penalty created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Created penalty successfully
 *                 penalty:
 *                   type: object
 *       400:
 *         description: Missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only or user not assigned to task)
 *       404:
 *         description: Task not found
 *       409:
 *         description: Penalty already exists for this task
 *       500:
 *         description: Internal Server Error
 *   delete:
 *     summary: Delete a penalty (protected, admin only)
 *     tags: [Penalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the task
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group
 *       - in: path
 *         name: foulUserId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Penalty deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deleted penalty successfully
 *                 penaltyId:
 *                   type: integer
 *       400:
 *         description: Missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only or user not assigned to task)
 *       404:
 *         description: Task not found or penalty not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/penalty/me:
 *   get:
 *     summary: Get all penalties for the current user (protected)
 *     tags: [Penalty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of penalties for current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 penalties:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       Task:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                       Group:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/penalty/group/{groupId}/user/{userId}:
 *   get:
 *     summary: Get penalties for a specific user in a group (protected, group members only)
 *     tags: [Penalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of penalties for the user in the group
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 groupId:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 penalties:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       Task:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *                       Group:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           title:
 *                             type: string
 *       400:
 *         description: Missing parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (group members only)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/penalty/group/{groupId}/search:
 *   get:
 *     summary: Search penalties by title in a group (protected, admin only)
 *     tags: [Penalty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the group
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query for penalty title
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 query:
 *                   type: string
 *                 total:
 *                   type: integer
 *                 penalties:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing search query
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin only)
 *       500:
 *         description: Internal Server Error
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
