import { Server } from "socket.io";

let io;
const userSockets = new Map(); // Map để lưu userId -> socketId

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Người dùng đăng ký với userId
    socket.on("register", (userId) => {
      userSockets.set(userId.toString(), socket.id);
      console.log(`User ${userId} registered with socket ${socket.id}`);
    });

    socket.on("disconnect", () => {
      // Xóa user khỏi map khi disconnect
      for (let [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Hàm gửi thông báo đến một user cụ thể
export const sendNotificationToUser = (userId, notification) => {
  const socketId = userSockets.get(userId.toString());
  if (socketId) {
    io.to(socketId).emit("notification", notification);
    console.log(`Notification sent to user ${userId}`);
    return true;
  }
  console.log(`User ${userId} is not connected`);
  return false;
};

// Hàm gửi thông báo đến nhiều users
export const sendNotificationToUsers = (userIds, notification) => {
  const sentCount = userIds.reduce((count, userId) => {
    return count + (sendNotificationToUser(userId, notification) ? 1 : 0);
  }, 0);
  console.log(`Notification sent to ${sentCount}/${userIds.length} users`);
  return sentCount;
};

// Hàm gửi thông báo đến tất cả users trong một group
export const sendNotificationToGroup = (
  groupId,
  notification,
  excludeUserId = null
) => {
  io.emit("group-notification", {
    groupId,
    notification,
    excludeUserId,
  });
};
