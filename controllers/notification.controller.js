import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { sendNotificationToUser } from "../lib/socket.js";

// Tạo thông báo mới
export const createNotification = async (
  userId,
  type,
  title,
  message,
  relatedId = null,
  relatedType = null
) => {
  try {
    const notification = await Notification.create({
      UserId: userId,
      type,
      title,
      message,
      relatedId,
      relatedType,
    });

    // Gửi thông báo realtime
    sendNotificationToUser(userId, {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      relatedId: notification.relatedId,
      relatedType: notification.relatedType,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Lấy tất cả thông báo của user
export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const where = { UserId: userId };
    if (unreadOnly === "true") {
      where.isRead = false;
    }

    const offset = (page - 1) * limit;

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách thông báo",
    });
  }
};

// Đánh dấu thông báo đã đọc
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id, UserId: userId },
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: "Đã đánh dấu thông báo là đã đọc",
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đánh dấu thông báo",
    });
  }
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.update(
      { isRead: true },
      { where: { UserId: userId, isRead: false } }
    );

    res.status(200).json({
      success: true,
      message: "Đã đánh dấu tất cả thông báo là đã đọc",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đánh dấu tất cả thông báo",
    });
  }
};

// Xóa thông báo
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await Notification.destroy({
      where: { id, UserId: userId },
    });

    if (result === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa thông báo",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa thông báo",
    });
  }
};

// Lấy số lượng thông báo chưa đọc
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.count({
      where: { UserId: userId, isRead: false },
    });

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy số lượng thông báo chưa đọc",
    });
  }
};
