# Workify : Employee Management System

A comprehensive web-based solution to manage employee workloads, salary payments, and HR operations. This platform supports multiple user roles (Admin, HR, Employee) with tailored features for efficient task and payroll management.

---

---

## Live Demo

[Live Demo](https://employee-management-62d65.web.app/)

---

---

## Admin Details

#### 1. Admin Email :

- admin@gmail.com

#### 2. Admin Pass :

- Admin1212$

---

## Features

### 1. Authentication with Role-Based Access

- Users can register and log in using email/password or social login (Google/GitHub).
- Roles: Employee, HR, and Admin.
- Roles are stored in the database for secure access control.

### 2. Responsive Design

- Fully responsive for mobile, tablet, and desktop views.
- Modern and user-friendly UI.

### 3. Protected Routes with Persistent Login

- Access to private routes is restricted to logged-in users.
- User sessions persist even after refreshing the page.

### 4. Employee Dashboard

- `/work-sheet`:
  - Form to log daily tasks, hours worked, and dates.
  - Employees can view, edit, and delete their tasks.
- `/payment-history`:
  - Displays salary history with pagination or infinite scrolling.

### 5. HR Dashboard

- `/employee-list`:
  - List of employees with options to verify users, pay salaries (modal-based), and view detailed progress.
- `/progress`:
  - Tracks employee work records with filtering by employee and month.

### 6. Admin Dashboard

- `/all-employee-list`:
  - Manage employees and HRs:
    - Fire employees.
    - Promote employees to HR.
    - Adjust salaries (only increments allowed).
  - Toggle between table and card grid views for data display.
- `/payroll`:
  - Manage salary approvals.
  - Prevent duplicate payments for the same month/year.

### 7. Profile Picture Upload

- Employees upload profile pictures during registration.
- Uses ImgBB for secure image uploads (URL uploads are not allowed).

### 8. CRUD Notifications

- Toasts and SweetAlerts are used for success and error messages during authentication and CRUD operations.

### 9. TanStack Query Integration

- All GET requests are implemented using TanStack Query for efficient data fetching and cache management.

### 10. Enhanced Admin Controls

- Admins can:
  - Toggle between table and card grid views for displaying employee data.
  - Prevent duplicate salary payments for the same month/year.
