# Hệ thống Thông báo Realtime với Socket.IO

## Tổng quan

Hệ thống thông báo realtime đã được tích hợp vào API CleanUp, cho phép gửi thông báo tức thì đến người dùng khi có các sự kiện quan trọng.

## Các file đã tạo/cập nhật

### 1. Models

- **models/notification.model.js**: Model cho bảng Notifications
  - Các loại thông báo: TASK_ASSIGNED, TASK_COMPLETED, TASK_OVERDUE, PENALTY_RECEIVED, GROUP_INVITE, TASK_REMINDER
  - Các trạng thái: đã đọc/chưa đọc

### 2. Library

- **lib/socket.js**: Quản lý Socket.IO
  - `initializeSocket()`: Khởi tạo Socket.IO server
  - `sendNotificationToUser()`: Gửi thông báo đến 1 user
  - `sendNotificationToUsers()`: Gửi thông báo đến nhiều users
  - `sendNotificationToGroup()`: Gửi thông báo đến cả group

### 3. Controllers

- **controllers/notification.controller.js**: Xử lý logic thông báo
  - `createNotification()`: Tạo và gửi thông báo
  - `getAllNotifications()`: Lấy danh sách thông báo (có phân trang)
  - `markAsRead()`: Đánh dấu đã đọc
  - `markAllAsRead()`: Đánh dấu tất cả đã đọc
  - `deleteNotification()`: Xóa thông báo
  - `getUnreadCount()`: Đếm thông báo chưa đọc

### 4. Routes

- **routes/notification.routes.js**: Định nghĩa các endpoints API
  - `GET /api/v1/notification` - Lấy danh sách thông báo
  - `GET /api/v1/notification/unread-count` - Đếm thông báo chưa đọc
  - `PUT /api/v1/notification/:id/read` - Đánh dấu đã đọc
  - `PUT /api/v1/notification/read-all` - Đánh dấu tất cả đã đọc
  - `DELETE /api/v1/notification/:id` - Xóa thông báo

### 5. Tích hợp vào các Controller hiện có

- **task.controller.js**: Gửi thông báo khi:
  - Tạo task mới → Gửi cho users được assign
  - Task hoàn thành → Gửi cho users liên quan
- **penalty.controller.js**: Gửi thông báo khi:
  - Tạo penalty → Gửi cho user bị phạt

### 6. Server

- **index.js**: Đã tích hợp Socket.IO vào HTTP server

### 7. Demo Client

- **notification-demo.html**: Trang web demo để test thông báo realtime

## Cách sử dụng

### 1. Khởi động server

\`\`\`bash
npm start
\`\`\`

Server sẽ chạy tại port đã cấu hình (mặc định: 3000)

### 2. Test với Demo Client

1. Mở file `notification-demo.html` trong trình duyệt
2. Nhập Server URL (vd: http://localhost:3000)
3. Nhập User ID của bạn
4. Click "Kết nối"
5. Thông báo sẽ hiển thị realtime khi có sự kiện

### 3. Sử dụng trong Mobile App

#### Kết nối Socket.IO

**React Native:**
\`\`\`javascript
import io from 'socket.io-client';

const socket = io('http://your-server:3000');

// Đăng ký user
socket.emit('register', userId);

// Lắng nghe thông báo
socket.on('notification', (notification) => {
console.log('New notification:', notification);
// Hiển thị thông báo cho user
showNotification(notification);
});
\`\`\`

**Flutter:**
\`\`\`dart
import 'package:socket_io_client/socket_io_client.dart' as IO;

IO.Socket socket = IO.io('http://your-server:3000', <String, dynamic>{
'transports': ['websocket'],
'autoConnect': true,
});

socket.on('connect', (\_) {
print('Connected');
socket.emit('register', userId);
});

socket.on('notification', (data) {
print('New notification: $data');
// Hiển thị thông báo
});
\`\`\`

#### Các API Endpoints

**Lấy danh sách thông báo:**
\`\`\`
GET /api/v1/notification?page=1&limit=20&unreadOnly=true
Headers: Authorization: Bearer <token>
\`\`\`

**Đếm thông báo chưa đọc:**
\`\`\`
GET /api/v1/notification/unread-count
Headers: Authorization: Bearer <token>
\`\`\`

**Đánh dấu đã đọc:**
\`\`\`
PUT /api/v1/notification/:id/read
Headers: Authorization: Bearer <token>
\`\`\`

**Đánh dấu tất cả đã đọc:**
\`\`\`
PUT /api/v1/notification/read-all
Headers: Authorization: Bearer <token>
\`\`\`

**Xóa thông báo:**
\`\`\`
DELETE /api/v1/notification/:id
Headers: Authorization: Bearer <token>
\`\`\`

## Các loại thông báo

- **TASK_ASSIGNED**: Task được gán cho user
- **TASK_COMPLETED**: Task đã hoàn thành
- **TASK_OVERDUE**: Task quá hạn
- **PENALTY_RECEIVED**: Nhận phạt
- **GROUP_INVITE**: Được mời vào group
- **TASK_REMINDER**: Nhắc nhở task

## Cấu trúc dữ liệu Notification

\`\`\`javascript
{
id: 1,
UserId: 5,
type: "TASK_ASSIGNED",
title: "Task mới được gán",
message: "Bạn được gán task: Dọn dẹp phòng khách",
relatedId: 10, // ID của task/penalty/group
relatedType: "TASK", // TASK, PENALTY, GROUP
isRead: false,
createdAt: "2026-01-01T10:00:00.000Z"
}
\`\`\`

## Lưu ý quan trọng

1. **Socket.IO đã được cài đặt** trong package.json
2. **Cần chạy migration** để tạo bảng Notifications:
   \`\`\`bash
   # Server sẽ tự động sync model khi khởi động (nếu alter: true)
   \`\`\`
3. **Client phải đăng ký userId** sau khi kết nối để nhận thông báo
4. **Thông báo được lưu vào database** và gửi realtime qua Socket.IO
5. **Nếu user offline**, thông báo vẫn được lưu và có thể lấy qua API

## Mở rộng

Để thêm thông báo cho sự kiện mới, gọi hàm `createNotification()`:

\`\`\`javascript
import { createNotification } from './controllers/notification.controller.js';

// Ví dụ: Gửi thông báo khi có comment mới
await createNotification(
userId,
'TASK_COMMENT', // type
'Bình luận mới', // title
'Có người bình luận về task của bạn', // message
taskId, // relatedId
'TASK' // relatedType
);
\`\`\`

## Test

1. Mở notification-demo.html trong trình duyệt
2. Kết nối với User ID khác nhau trong nhiều tab
3. Tạo task mới hoặc penalty qua API
4. Quan sát thông báo realtime trong các tab
