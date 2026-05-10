# Employee Management System (EMS)

## What This Project Is About

This project is a full-stack Employee Management System built with the MERN stack.  
It helps organizations manage employee data with secure authentication, role-based access control, and a clean dashboard-style interface.

The application supports:
- Secure user authentication with email OTP verification
- Admin and employee role separation
- Employee data management (create, read, update, delete)
- User role management by admins

It is designed to be beginner-friendly, modular, and easy to maintain.

## Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Context API
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication (httpOnly cookie-based)
- bcryptjs
- Nodemailer
- dotenv
- cors
- cookie-parser

## Core Features

### 1) Authentication and Authorization
- Two-step authentication for both registration and login
  - Step 1: Submit credentials
  - Step 2: Verify email OTP
- JWT-based session handling with secure httpOnly cookies
- Protected routes for authenticated users
- Role-based access control (Admin / Employee)

### 2) OTP Authentication Flow
- OTP required for:
  - Registration
  - Login
- OTP expiry support
- OTP verification with secure hash comparison
- Optional SMTP email delivery via Nodemailer
- Development fallback: OTP logs in backend console if SMTP is not configured

### 3) Password Security
- Passwords are hashed in Mongoose pre-save hooks (model-level hashing)
- Password comparison is handled through model instance methods
- Raw passwords are never stored in the database

### 4) Employee Management
- View all employees (authenticated users)
- View single employee details
- Add new employee (admin only)
- Edit employee details (admin only)
- Delete employee (admin only)
- Structured employee data:
  - Name
  - Email
  - Phone
  - Department
  - Position
  - Salary
  - Hire date

### 5) User Role Management
- Admin-only user listing
- Admin can change any other user role:
  - Employee -> Admin
  - Admin -> Employee
- Special protection for the first registered user:
  - First user automatically becomes admin
  - First admin role cannot be changed

### 6) Dashboard and UI
- Clean, responsive dashboard layout
- Login/Register page with two-step OTP UI
- Employee listing table and forms
- Admin user management page
- Toast notifications for success/error feedback
- 404 Not Found page

### 7) API Structure
- RESTful API design
- Auth endpoints for OTP request/verification and session handling
- Employee endpoints for CRUD
- User endpoints for role management
- Health endpoint for server status

## Project Goals
- Keep architecture simple and understandable
- Follow clean code and maintainable folder structure
- Demonstrate real-world authentication and RBAC patterns
- Provide a practical starter project for MERN learners

