# Employee Management System - MERN Stack Project

## Project Overview

Build a simple Employee Management System using the MERN Stack.

### Features
- Employee CRUD Operations
- User Authentication
- JWT Authorization
- Role-Based Access Control (Admin / Employee)
- Dashboard UI
- Protected Routes
- MongoDB Database Integration
- RESTful APIs

---

# Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Context API
- Tailwind CSS
- React Hot Toast

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- cors
- cookie-parser

---

# Root Folder Structure

```bash
employee-management-system/
│
├── frontend/
│
├── backend/
│
└── PROJECT_GUIDE.md
```

# Frontend Folder Structure

```bash
frontend/
│
├── public/
│
├── src/
│   │
│   ├── api/
│   │   └── axios.js
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── context/
│   │   └── AuthContext.js
│   │
│   ├── helpers/
│   │   └── env.js
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Employees.jsx
│   │   ├── AddEmployee.jsx
│   │   ├── EditEmployee.jsx
│   │   └── NotFound.jsx
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── services/
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── vite.config.js
```

```bash
# Backend Folder Structure

backend/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── jwt.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── employee.controller.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── employee.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── employee.routes.js
│   │
│   ├── services/
│   │
│   ├── utils/
│   │
│   ├── helpers/
│   │   └── env.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── package.json
└── .gitignore
```

# Frontend Guidelines

- Use functional components only
- Use React hooks
- Create reusable components
- Use Axios instance
- Handle loading and error states properly
- Keep UI responsive

# Final Notes
- Keep the UI simple and clean.
- Focus on clean code structure.
- Follow REST API conventions.
- Use proper naming conventions.
- Keep the project beginner-friendly and maintainable.
- Use ES Modules syntax (import/export) everywhere.