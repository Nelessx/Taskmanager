# Task Manager - MERN Stack Application

A full-stack task management application built with the MERN stack (MongoDB replaced with PostgreSQL), featuring user authentication and real-time task management.

## 🚀 Features

- User authentication (Login/Register)
- Create, Read, Update, Delete tasks
- Task prioritization
- Task status tracking
- Search and filter tasks
- Responsive design
- Profile management

## 💻 Tech Stack

### Frontend

- React
- Redux Toolkit
- React Router
- CSS Modules
- Vite

### Backend

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication

## 🔑 API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Tasks

- `GET /task` - Get all tasks
- `POST /task` - Create new task
- `PATCH /task/:taskId` - Update task
- `DELETE /task/:taskId` - Delete task

### User

- `GET /user/profile` - Get user profile
- `PATCH /user/profile` - Update user profile

