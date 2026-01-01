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
 *   description: API quản lý thông báo
 */

/**
 * @swagger
 * /api/v1/notification:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng thông báo mỗi trang
 *       - in: query
 *         name: unreadOnly
 *         schema:
 *           type: boolean
 *         description: Chỉ lấy thông báo chưa đọc
 *     responses:
 *       200:
 *         description: Lấy danh sách thông báo thành công
 *       401:
 *         description: Chưa xác thực
 */
router.get("/", protectedRoute, getAllNotifications);

/**
 * @swagger
 * /api/v1/notification/unread-count:
 *   get:
 *     summary: Lấy số lượng thông báo chưa đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy số lượng thành công
 *       401:
 *         description: Chưa xác thực
 */
router.get("/unread-count", protectedRoute, getUnreadCount);

/**
 * @swagger
 * /api/v1/notification/{id}/read:
 *   put:
 *     summary: Đánh dấu thông báo đã đọc
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
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Đánh dấu thành công
 *       404:
 *         description: Không tìm thấy thông báo
 */
router.put("/:id/read", protectedRoute, markAsRead);

/**
 * @swagger
 * /api/v1/notification/read-all:
 *   put:
 *     summary: Đánh dấu tất cả thông báo đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đánh dấu tất cả thành công
 */
router.put("/read-all", protectedRoute, markAllAsRead);

/**
 * @swagger
 * /api/v1/notification/{id}:
 *   delete:
 *     summary: Xóa thông báo
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
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy thông báo
 */
router.delete("/:id", protectedRoute, deleteNotification);

export default router;
