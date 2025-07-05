# Chattrix – Backend 💬🛠️  
**A Real-Time Chat & Social Platform Backend using Node.js, Express, MongoDB, and Stream Chat API**

---

## 🚀 Overview

This is the **backend** of **Chattrix**, a real-time chat and social networking application. It handles secure authentication, user onboarding, friend request logic, and integration with the **Stream Chat API** for messaging features.

> ⚠️ Note: This repo only includes the **backend logic**. The frontend exists in the `../frontend/` folder but is currently not included or documented as it's under revision.

---

## 🧱 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** + Mongoose
- **JWT** Authentication
- **bcrypt.js** (password hashing)
- **Stream Chat API**
- CORS, cookie-parser, dotenv

---

## 🔐 Features

- ✅ Secure signup, login, logout using **JWT** and **HTTP-only cookies**
- ✅ User onboarding with bio, language preferences, and profile image
- ✅ Friend system (send, accept, view friend requests)
- ✅ Stream Chat API integration:
  - Token generation
  - User synchronization (upsert)
- ✅ Middleware for authentication protection
- ✅ Modular folder structure with clean route/controller separation

---

## 📁 Project Structure

```bash
chattrix/
├── backend/
│   ├── controllers/
│   │   ├── auth-controller.js
│   │   ├── chat-controller.js
│   │   └── user-controller.js
│   ├── models/
│   │   ├── Users.js
│   │   └── FriendRequest.js
│   ├── routes/
│   │   ├── auth-route.js
│   │   ├── chat-route.js
│   │   └── user-route.js
│   ├── middleware/
│   │   └── auth-middleware.js
│   ├── database/
│   │   ├── db.js
│   │   └── stream.js
│   ├── server.js
│   └── .env (not included)
└── frontend/ (not documented)
```
---

🌐 API Endpoints

🔐 Auth Routes
POST   /api/auth/signup          → Register user  
POST   /api/auth/login           → Login user  
POST   /api/auth/logout          → Logout user  
POST   /api/auth/onboarding      → Onboard profile  
GET    /api/auth/me              → Get current user  

👥 User Routes
GET    /api/users/                       → Get recommended users  
GET    /api/users/friends                → Get friend list  
POST   /api/users/friend-request/:id     → Send friend request  
PUT    /api/users/friend-request/:id/accept → Accept friend request  
GET    /api/users/friend-requests        → Incoming/accepted requests  
GET    /api/users/outgoing-friend-requests → Sent requests  
