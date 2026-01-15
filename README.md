# 🧹 CleanUp API – Backend Service

CleanUp API is the backend service for the **CleanUp** application — a group-based task management platform for shared living environments such as co-living spaces, student housing, and households. The system helps assign responsibilities transparently, reduce conflicts, and improve accountability through structured task management and a manual penalty mechanism.

---

## 📌 Project Information

**University:** Vietnam National University – Ho Chi Minh City – University of Technology  
**Faculty:** Computer Science & Engineering  
**Course:** Mobile Application Development  

**Supervisor:** MSc. Hoàng Lê Hải Thanh  

**Students:**
- Bùi Thanh Tùng – 2213860  
- Nguyễn Huỳnh Hải Đăng – 2210737  
- Hoàng Thiện Bách – 2210181  
- Nguyễn Văn Thành – 2320012  

---

## 🎯 Project Overview

### Problem

In shared living models, managing common tasks often faces the following challenges:
- Responsibilities are unclear
- Direct reminders may cause tension
- Personal to-do applications do not support group collaboration well
- There is no effective accountability mechanism

### Solution

**CleanUp** provides a system that:
- Manages tasks by **groups**
- Supports **Admin / Member** roles
- Displays **overdue tasks in real time**
- Allows **admins to handle penalties manually**, while the system focuses on tracking and transparency
- Supports secure authentication and real-time updates

---

## 🏗️ Tech Stack

- Platform: Node.js  
- Framework: Express.js  
- Architecture: MVC + Service Layer  
- Database: MySQL (Sequelize ORM)  
- Authentication: JWT (Access & Refresh Tokens), Google OAuth2  
- Realtime: Socket.io  
- Media Storage: Cloudinary  
- API Documentation: Swagger (OpenAPI)  
- Deployment: Render  
- CI/CD: GitHub Actions with Render Auto Deploy  

---

## ✨ Core Features

### Authentication
- Register and login with email and password
- Google OAuth login
- JWT-based authentication with access and refresh tokens
- Tokens stored in HTTP-only cookies

### Group Management
- Create groups and join via invite code or link
- Role-based permissions:
  - **Admin:** full management access
  - **Member:** view and complete tasks

### Task Management
- Create tasks with:
  - Title, description, and deadline
  - Priority levels (High / Medium / Low)
  - Assigned members
- Overdue tasks are automatically highlighted on the client side

### Manual Penalty System
- Penalties are **not generated automatically**
- Admins manually review overdue tasks and create penalty records
- Penalty history is stored for tracking and dispute handling

---

## 📄 API Documentation

Swagger UI:  
https://cleanupapi-nyxe.onrender.com/api/v1/docs/#/

---

## 🚀 Getting Started (Local Development)

### Clone repository
```bash
git clone https://github.com/Duty-Scheduler/CleanUpAPI.git
cd CleanUpAPI
````

### Install dependencies

```bash
npm install
```

### Environment configuration

Create a `.env` file in the root directory and configure the required environment variables.

### Run application

```bash
npm start
```

The server will run at:

```
http://localhost:5000
```

---

## 🔄 CI/CD & Deployment

Deployment is automated through a cloud platform with the following flow:

* Triggered on push or merge to the `main` branch
* Automatically installs dependencies and builds the project
* Deploys the latest version and restarts the service

This setup is suitable for MVP development and academic projects.

---

## 🔗 External Links

* API Documentation: [https://cleanupapi-nyxe.onrender.com/api/v1/docs/#/](https://cleanupapi-nyxe.onrender.com/api/v1/docs/#/)
* Landing Page: [https://cleanup-landingpage.onrender.com/](https://cleanup-landingpage.onrender.com/)
* Mobile App (APK): [https://drive.google.com/drive/folders/1i350nLGdWSV3AAyulqpNc8q9Fr4pV2yT](https://drive.google.com/drive/folders/1i350nLGdWSV3AAyulqpNc8q9Fr4pV2yT)
* Backend Source Code: [https://github.com/Duty-Scheduler/CleanUpAPI](https://github.com/Duty-Scheduler/CleanUpAPI)
* Mobile App Source Code: [https://github.com/Duty-Scheduler/CleanUp_FE](https://github.com/Duty-Scheduler/CleanUp_FE)
* Project Poster: [https://www.canva.com/design/DAG9pt69jJ8/sZgMI5rT3Lmx4TeULK6FHw/edit](https://www.canva.com/design/DAG9pt69jJ8/sZgMI5rT3Lmx4TeULK6FHw/edit)


