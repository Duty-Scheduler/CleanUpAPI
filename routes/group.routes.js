/**
 * @swagger
 * tags:
 *   name: Group
 *   description: Group management
 */

/**
 * @swagger
 * /api/v1/group:
 *   post:
 *     summary: Create a new group (protected)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Group title
 *               description:
 *                 type: string
 *                 description: Group description
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 group:
 *                   type: object
 *                   description: Created group object
 *                 isAdmin:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing title or description
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/group/joined:
 *   get:
 *     summary: Get all groups that the user has joined (protected)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of joined groups
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groups:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       UserGroupTask:
 *                         type: object
 *                         properties:
 *                           isAdmin:
 *                             type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/group/{groupId}/leave:
 *   delete:
 *     summary: Leave a group (protected)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group to leave
 *     responses:
 *       200:
 *         description: Leave group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leave group successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/group/{groupId}:
 *   delete:
 *     summary: Delete a group (protected, admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group to delete
 *     responses:
 *       200:
 *         description: Group deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Group deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/group/{groupId}/invite:
 *   post:
 *     summary: Create invite token for a group (protected, admin only)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the group
 *     responses:
 *       201:
 *         description: Invite token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inviteToken:
 *                   type: string
 *                 message:
 *                   type: string
 *                   example: Invite Code Created Successfully Expires in 7d
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/v1/group/join:
 *   post:
 *     summary: Join a group using invite token (protected)
 *     tags: [Group]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - groupId
 *               - inviteToken
 *             properties:
 *               groupId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the group to join
 *               inviteToken:
 *                 type: string
 *                 description: Invite token for the group
 *     responses:
 *       200:
 *         description: Join group successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Join group successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (invalid invite token)
 *       404:
 *         description: Group not found
 *       500:
 *         description: Internal Server Error
 */
import express from "express";
import {
  createGroup,
  getJoinedGroup,
  leaveGroup,
  deleteGroup,
  createInviteToken,
  joinGroup,
} from "../controllers/group.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectedRoute, createGroup);
router.post("/:groupId/invite", protectedRoute, createInviteToken);
router.post("/join", protectedRoute, joinGroup);
router.get("/joined", protectedRoute, getJoinedGroup);
router.delete("/:groupId/leave", protectedRoute, leaveGroup);
router.delete("/:groupId", protectedRoute, deleteGroup);

export default router;
