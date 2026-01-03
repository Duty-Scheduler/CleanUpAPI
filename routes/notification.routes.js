import express from "express";
import {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controllers/notification.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management API
 */

/**
 * @swagger
 * /api/v1/notification:
 *   get:
 *     summary: Get list of notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of notifications per page
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         description: Get unread notifications only
 *     responses:
 *       200:
 *         description: Successfully retrieved notification list
 *       401:
 *         description: Unauthorized
 */
router.get("/", protectedRoute, getAllNotifications);

/**
 * @swagger
 * /api/v1/notification/unread-count:
 *   get:
 *     summary: Get unread notifications count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved count
 *       401:
 *         description: Unauthorized
 */
router.get("/unread-count", protectedRoute, getUnreadCount);

/**
 * @swagger
 * /api/v1/notification/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Successfully marked as read
 *       404:
 *         description: Notification not found
 */
router.put("/:id/read", protectedRoute, markAsRead);

/**
 * @swagger
 * /api/v1/notification/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully marked all as read
 */
router.put("/read-all", protectedRoute, markAllAsRead);

/**
 * @swagger
 * /api/v1/notification/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Notification not found
 */
router.delete("/:id", protectedRoute, deleteNotification);

export default router;
