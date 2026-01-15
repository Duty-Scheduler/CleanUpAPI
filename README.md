# 🧹 CleanUp API – Backend Service

**CleanUp API** is the backend service for the **CleanUp** application – a group-based task management platform designed for shared living environments (students, co-living spaces, households).  
The system aims to improve transparency, accountability, and reduce conflicts through clear task assignment and a manual penalty mechanism.

---

## 📌 Project Information

**University:** Vietnam National University – Ho Chi Minh City  
**Institution:** Ho Chi Minh City University of Technology  
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

### Problem Statement

In shared living environments, managing common tasks often leads to issues such as:
- Unclear responsibility
- Direct reminders causing tension
- Personal to-do apps not suitable for group collaboration
- Lack of accountability mechanisms

### Proposed Solution

**CleanUp** provides a group-oriented task management system that:
- Organizes tasks by **groups**
- Supports **role-based permissions**
- Clearly tracks overdue tasks
- Allows **manual penalty handling by group administrators**
- Focuses on transparency rather than automatic punishment

---

## ✨ Core Features

### 🔐 Authentication
- User registration and login via email/password
- Google OAuth login
- Token-based authentication with access & refresh tokens
- Secure session handling using HTTP-only cookies

### 👥 Group Management
- Create and join groups using invite codes or links
- Role system:
  - **Admin:** full management permissions
  - **Member:** view and complete assigned tasks

### ✅ Task Management
- Create tasks with:
  - Title, description, deadline
  - Priority levels
  - Assigned members
- Overdue tasks are clearly marked based on time conditions

### 💸 Manual Penalty System
- Penalties are **not generated automatically**
- Admins manually evaluate overdue tasks
- Penalty records are stored for tracking and review

---

## 📐 System Architecture (High-level)

