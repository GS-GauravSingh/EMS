# Employee Management System (EMS)

## Project Overview

EMS is a full-stack MERN application for managing employees, authentication, authorization, attendance, and user roles in a secure and beginner-friendly way.

The platform is designed for small to medium teams that need:
- secure login and account management,
- role-based access (admin and employee),
- employee CRUD operations,
- attendance tracking (daily + history),
- maintainable code structure and clean UI.

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
- JWT (stored in httpOnly cookies)
- bcryptjs
- Nodemailer
- dotenv
- cors
- cookie-parser

## Authentication and Security

### 1) Two-Step OTP Authentication
- OTP verification is mandatory for registration.
- OTP verification is mandatory for login.
- OTP flow:
  - Step 1: submit credentials
  - Step 2: verify OTP sent to email
- OTPs are hashed before storage.
- OTPs have expiration and one-time consumption.

### 2) Forgot Password (OTP-Based)
- Users can request password reset OTP by email.
- Password reset requires:
  - email,
  - OTP,
  - new password.
- Response is generic for unknown emails to reduce account enumeration risk.

### 3) Password Security
- Password hashing is handled in Mongoose `pre("save")` hook.
- Password comparison is handled using model instance method (`comparePassword`).
- Raw passwords are never stored in MongoDB.

### 4) Session and Route Protection
- JWT token is issued after successful OTP verification.
- Token is stored in secure `httpOnly` cookie.
- Protected routes for authenticated users.
- Role-based route checks for admin-only operations.

### 5) CORS and Client Integration
- Backend supports configured client origins via env (`CLIENT_URLS`).
- Credentials-enabled cross-origin requests are supported.
- Frontend uses explicit backend URL (no dependency on dev proxy).

## Role-Based Access Control (RBAC)

### Roles
- `admin`
- `employee`

### Initial Admin Rule
- The first registered user automatically becomes admin.

### Protected First Admin Rule
- The first registered admin's role cannot be changed.

### Role Management
- Admin can list all users.
- Admin can change role of other users:
  - employee -> admin
  - admin -> employee
- First admin is locked and cannot be downgraded.

## Employee Management

### Employee CRUD
- List employees (authenticated users).
- View employee details (authenticated users).
- Create employee (admin only).
- Update employee (admin only).
- Delete employee (admin only).

### Employee Data Fields
- First name
- Last name
- Email
- Phone
- Department
- Position
- Salary
- Hire date
- Created by

## Attendance Management

### Admin Attendance Features
- Mark daily attendance for all employees.
- Attendance status options:
  - `present`
  - `absent`
- Update existing attendance for the same day.
- View daily attendance records.
- View per-employee attendance history with date filters.

### Employee Self-Attendance Features
- Employees can mark their own attendance (`present` or `absent`).
- Employees can choose date when marking attendance.
- Employees can view their own attendance history.

### Attendance Data Behavior
- One attendance record per employee per date (unique index).
- Attendance history supports date range filtering (`from`, `to`).
- Record includes who marked attendance (`markedBy`).

## Frontend UI Features

### Auth UI
- Unified auth page with mode switching:
  - Sign in
  - Register
  - Forgot password
- OTP step UI for each flow.

### App Pages
- Login / Register / Forgot Password
- Dashboard
- Employees list
- Add Employee
- Edit Employee
- Attendance
- Manage Users (roles)
- Not Found (404)

### Navigation Behavior
- Common users can access:
  - Dashboard
  - Employees
  - Attendance
- Admin users additionally access:
  - Users
  - Add Employee
  - Admin attendance controls

### UX Details
- Responsive layout
- Clear tables and forms
- Toast feedback for success/error
- Loading states with spinners

## Backend API Summary

### Health
- `GET /api/health`

### Auth
- `POST /api/auth/register/request-otp`
- `POST /api/auth/register/verify-otp`
- `POST /api/auth/login/request-otp`
- `POST /api/auth/login/verify-otp`
- `POST /api/auth/forgot-password/request-otp`
- `POST /api/auth/forgot-password/reset`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Employees
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees` (admin)
- `PUT /api/employees/:id` (admin)
- `DELETE /api/employees/:id` (admin)

### Users (Role Management)
- `GET /api/users` (admin)
- `PATCH /api/users/:id/role` (admin)

### Attendance
- `GET /api/attendance/daily` (admin)
- `POST /api/attendance/daily` (admin)
- `GET /api/attendance/history` (admin)
- `POST /api/attendance/self` (employee/admin authenticated)
- `GET /api/attendance/self/history` (employee/admin authenticated)

## Environment Configuration

### Backend `.env` keys
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CLIENT_URL`
- `CLIENT_URLS`
- `OTP_TTL_MINUTES`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

### Frontend `.env` keys
- `VITE_API_URL`

## Design and Maintenance Goals
- Keep code modular and readable.
- Follow REST and clean naming conventions.
- Use reusable frontend components.
- Keep logic beginner-friendly while implementing practical real-world patterns.
- Support future features like reporting, payroll, and audit logs with minimal restructuring.

