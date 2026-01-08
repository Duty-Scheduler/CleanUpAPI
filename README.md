# 🧹 CleanUp API – Backend Service

Backend API cho ứng dụng **CleanUp** – nền tảng quản lý công việc chung theo nhóm (co-living, sinh viên, hộ gia đình), giúp phân công nhiệm vụ minh bạch, giảm xung đột và nâng cao trách nhiệm thông qua cơ chế quản lý và phạt thủ công.

---

## 📌 Project Information

**Trường:** Đại học Quốc gia TP.HCM – Trường Đại học Bách Khoa
**Khoa:** Khoa học & Kỹ thuật Máy tính
**Môn học:** Phát triển ứng dụng trên thiết bị di động

**GVHD:** ThS. Hoàng Lê Hải Thanh

**Sinh viên thực hiện:**

* Bùi Thanh Tùng – 2213860
* Nguyễn Huỳnh Hải Đăng – 2210737
* Hoàng Thiện Bách – 2210181
* Nguyễn Văn Thành – 2320012

---

## 🎯 Project Overview

### Problem

Trong mô hình sống chung (co-living), việc quản lý công việc chung thường gặp các vấn đề:

* Không rõ ai chịu trách nhiệm
* Nhắc nhở trực tiếp gây căng thẳng
* Ứng dụng to-do cá nhân không hỗ trợ tốt làm việc nhóm
* Thiếu cơ chế ràng buộc trách nhiệm

### Solution

**CleanUp** cung cấp một hệ thống:

* Quản lý công việc theo **nhóm**
* Phân quyền **Admin / Member**
* Hiển thị **task quá hạn theo thời gian thực**
* **Admin xử lý phạt thủ công**, hệ thống chỉ đóng vai trò ghi nhận & hiển thị
* Hỗ trợ xác thực an toàn và realtime

---

## 🏗️ Tech Stack

* **Platform:** Node.js
* **Framework:** Express.js
* **Architecture:** MVC + Service Layer
* **Database:** MySQL (Sequelize ORM)
* **Authentication:** JWT (Access + Refresh Token), OAuth2 (Google)
* **Realtime:** Socket.io
* **Media Storage:** Cloudinary
* **API Docs:** Swagger (OpenAPI)
* **Deployment:** Render
* **CI/CD:** GitHub Actions + Render Auto Deploy

---

## ✨ Core Features

### 🔐 Authentication

* Đăng ký / đăng nhập bằng Email & Password
* OAuth2 Google
* JWT Access Token (15 phút) & Refresh Token (7 ngày)
* Token lưu trong HTTP-only Cookie

### 👥 Group Management

* Tạo nhóm, tham gia nhóm bằng Invite Code / Link
* Phân quyền:

  * **Admin:** toàn quyền quản lý
  * **Member:** xem & thực hiện task

### ✅ Task Management

* Tạo task với:

  * Title, Description, Deadline
  * Priority (High / Medium / Low)
  * Người được giao
* FE tự động hiển thị **Overdue** nếu quá hạn

### 💸 Penalty System (Manual)

* Hệ thống **không tự động tạo phạt**
* Admin đánh giá task quá hạn và **tạo phiếu phạt thủ công**
* Lưu lịch sử phạt để theo dõi & khiếu nại

---

## 📐 System Architecture (High-level)

```
Mobile App (React Native)
        |
        | REST API / WebSocket
        |
Backend API (Node.js + Express)
        |
        | Sequelize ORM
        |
     MySQL Database
```

External Services:

* Cloudinary (Image Upload)
* Google OAuth
* Render (Deployment)

---

## 📄 API Documentation

Swagger UI:
👉 [https://cleanupapi-nyxe.onrender.com/api/v1/docs/#/](https://cleanupapi-nyxe.onrender.com/api/v1/docs/#/)

---

## 🚀 Getting Started (Local Development)

### 1️⃣ Clone repository

```bash
git clone https://github.com/Duty-Scheduler/CleanUpAPI.git
cd CleanUpAPI
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

Tạo file `.env` ở thư mục root với nội dung mẫu sau:

```env
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=cleanup_db
DB_USERNAME=root
DB_PASSWORD=your_password
DB_SSL=false

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth Google
GOOGLE_CLIENT_ID=your_google_client_id
```

### 4️⃣ Run application

```bash
npm start
```

Server sẽ chạy tại:

```
http://localhost:5000
```

---

## 🔄 CI/CD & Deployment

### CI/CD Flow (Render)

* **Trigger:** Push / merge vào branch `main`
* **CI:**

  * Pull source code
  * Install dependencies
  * Build project
* **CD:**

  * Deploy version mới
  * Restart service tự động

Render đóng vai trò **CI/CD all-in-one**, phù hợp cho MVP và project học thuật.

---

## 🔗 External Links

* 📘 API Docs: [https://cleanupapi-nyxe.onrender.com/api/v1/docs/#/](https://cleanupapi-nyxe.onrender.com/api/v1/docs/#/)
* 🌐 Landing Page: [https://cleanup-landingpage.onrender.com/](https://cleanup-landingpage.onrender.com/)
* 📱 Mobile App Download:
  [https://drive.google.com/drive/folders/1i350nLGdWSV3AAyulqpNc8q9Fr4pV2yT](https://drive.google.com/drive/folders/1i350nLGdWSV3AAyulqpNc8q9Fr4pV2yT)
* 🧠 Backend Source Code:
  [https://github.com/Duty-Scheduler/CleanUpAPI](https://github.com/Duty-Scheduler/CleanUpAPI)
* 🎨 Mobile App Source Code:
  [https://github.com/Duty-Scheduler/CleanUp_FE](https://github.com/Duty-Scheduler/CleanUp_FE)
* 🖼️ Poster:
  [https://www.canva.com/design/DAG9pt69jJ8/sZgMI5rT3Lmx4TeULK6FHw/edit](https://www.canva.com/design/DAG9pt69jJ8/sZgMI5rT3Lmx4TeULK6FHw/edit)


