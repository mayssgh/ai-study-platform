# AiStudy Backend Schema Design

## Database: PostgreSQL (Supabase)

This document defines the relational structure of the AiStudy platform.

The system has two roles:
- Admin
- Student

---

# 1. USERS TABLE

Purpose:
Stores all authenticated users (admin + students).

Columns:

- id (uuid, primary key)
- full_name (text, not null)
- email (text, unique, not null)
- role (text, not null, default = 'student')
- created_at (timestamp with time zone, default now())

Constraints:
- email must be unique
- role must be either 'admin' or 'student'

Relationship:
- One user can create many courses (if admin)
- One user can enroll in many courses

---

# 2. COURSES TABLE

Purpose:
Stores courses created by admins.

Columns:

- id (uuid, primary key)
- title (text, not null)
- description (text)
- created_by (uuid, foreign key references users(id))
- created_at (timestamp with time zone, default now())

Relationships:
- Many courses belong to one admin (users)
- One course can have many enrollments

---

# 3. ENROLLMENTS TABLE

Purpose:
Links students to courses.

Columns:

- id (uuid, primary key)
- user_id (uuid, foreign key references users(id))
- course_id (uuid, foreign key references courses(id))
- progress (integer, default 0)
- status (text, default 'active')
- enrolled_at (timestamp with time zone, default now())

Constraints:
- progress must be between 0 and 100
- status must be either 'active' or 'completed'

Relationships:
- Many enrollments belong to one user
- Many enrollments belong to one course

---

# 4. ROLE SYSTEM

Admin:
- Can create courses
- Can edit courses
- Can delete courses
- Can view users
- Can view enrollments

Student:
- Can view courses
- Can enroll in courses
- Can update progress
- Cannot create or delete courses

---

# 5. SECURITY PLAN (To Be Implemented in Supabase)

- Row Level Security (RLS) enabled on all tables
- Students can only view their own enrollments
- Admins can view all data
- Only admins can insert into courses
