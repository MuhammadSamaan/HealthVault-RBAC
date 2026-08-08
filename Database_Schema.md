# Database Schema — Crescent Medical Center RBAC
**System:** Crescent Medical Center Staff Portal  
**Author:** Muhammad Samaan  
**Date:** June 2026

---

## Overview

The current implementation uses an **in-memory data store** (JavaScript objects in `db.js`) with a persistent audit log written to `audit_logs.json`. The schema below represents both the current structure and the equivalent relational database design that would be used in a production SQL deployment.

---

## Entity-Relationship Diagram

```
┌─────────────────────────────┐
│           ROLES             │
├─────────────────────────────┤
│ PK  role_name  VARCHAR(20)  │◄────────────────────────┐
│     label      VARCHAR(50)  │                         │
│     rank       INTEGER      │                         │
└─────────────────────────────┘                         │
              │ 1                                        │
              │                                         │
              │ N                                        │
┌─────────────▼───────────────┐      ┌──────────────────┴──────────┐
│           USERS             │      │       ROLE_PERMISSIONS       │
├─────────────────────────────┤      ├─────────────────────────────┤
│ PK  id             VARCHAR  │      │ PK  id          INTEGER      │
│     username       VARCHAR  │      │ FK  role_name   VARCHAR(20)  │
│     email          VARCHAR  │      │ FK  permission  VARCHAR(50)  │
│     password_hash  VARCHAR  │      └─────────────────────────────┘
│ FK  role           VARCHAR──┼──────►       PERMISSIONS            │
│     full_name      VARCHAR  │      ├─────────────────────────────┤
│     designation    VARCHAR  │      │ PK  name    VARCHAR(50)      │
│     department     VARCHAR  │      │     label   VARCHAR(100)     │
│     phone          VARCHAR  │      └─────────────────────────────┘
│     locked         BOOLEAN  │
│     failed_attempts INTEGER │
│     lock_until    DATETIME  │
│     created_at    DATETIME  │
│     last_login    DATETIME  │
└─────────────┬───────────────┘
              │ 1
              │
              │ N
┌─────────────▼───────────────┐
│         AUDIT_LOGS          │
├─────────────────────────────┤
│ PK  id          VARCHAR     │
│     timestamp   DATETIME    │
│     event       VARCHAR(50) │
│ FK  user_id     VARCHAR     │
│     username    VARCHAR     │
│     ip          VARCHAR(45) │
│     details     TEXT        │
│     outcome     VARCHAR(20) │
└─────────────────────────────┘

┌─────────────────────────────┐      ┌─────────────────────────────┐
│        APPOINTMENTS         │      │       ANNOUNCEMENTS          │
├─────────────────────────────┤      ├─────────────────────────────┤
│ PK  id           VARCHAR    │      │ PK  id           VARCHAR     │
│     patient_name VARCHAR    │      │     title         VARCHAR    │
│     patient_age  VARCHAR    │      │     body          TEXT       │
│     doctor       VARCHAR    │      │     tag           VARCHAR    │
│     department   VARCHAR    │      │     priority      VARCHAR    │
│     date         DATE       │      │     author        VARCHAR    │
│     time         TIME       │      │     author_role   VARCHAR    │
│     type         VARCHAR    │      │     created_at    DATETIME   │
│     notes        TEXT       │      └─────────────────────────────┘
│     status       VARCHAR    │
│     created_by   VARCHAR    │
│     created_by_role VARCHAR │
│     created_at   DATETIME   │
└─────────────────────────────┘
```

---

## Table Definitions

### Table 1: `users`
Stores all staff accounts. Passwords are never stored in plaintext.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(10) | PRIMARY KEY | Unique user identifier (auto-increment string) |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Login username (e.g., `maryam.sheikh`) |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE | Staff email address |
| `password_hash` | VARCHAR(60) | NOT NULL | bcrypt hash of password (cost=10) |
| `role` | VARCHAR(20) | NOT NULL, FK → roles | Assigned role name |
| `full_name` | VARCHAR(100) | NOT NULL | Display name |
| `designation` | VARCHAR(100) | NOT NULL | Job title (e.g., Senior Cardiologist) |
| `department` | VARCHAR(100) | NOT NULL | Hospital department |
| `phone` | VARCHAR(20) | NULLABLE | Contact number |
| `locked` | BOOLEAN | DEFAULT FALSE | Whether account is locked |
| `failed_attempts` | INTEGER | DEFAULT 0 | Consecutive failed login count |
| `lock_until` | DATETIME | NULLABLE | Auto-unlock timestamp (NULL if not locked) |
| `created_at` | DATETIME | NOT NULL | Account creation timestamp |
| `last_login` | DATETIME | NULLABLE | Timestamp of last successful login |

**Seeded Users:**
| id | username | role | full_name |
|----|----------|------|-----------|
| 1 | maryam.sheikh | cmo | Dr. Maryam Sheikh |
| 2 | ahmed.karimi | admin | Ahmed Karimi |
| 3 | zainab.raza | doctor | Dr. Zainab Raza |
| 4 | fatima.noor | nurse | Fatima Noor |
| 5 | usman.malik | receptionist | Usman Malik |

---

### Table 2: `roles`
Defines the five system roles and their hierarchy rank.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `role_name` | VARCHAR(20) | PRIMARY KEY | Role identifier string |
| `label` | VARCHAR(50) | NOT NULL | Human-readable label |
| `rank` | INTEGER | NOT NULL | Hierarchy level (0 = lowest, 4 = highest) |

**Data:**
| role_name | label | rank |
|-----------|-------|------|
| receptionist | Receptionist | 0 |
| nurse | Nurse | 1 |
| doctor | Doctor | 2 |
| admin | Administrator | 3 |
| cmo | Chief Medical Officer | 4 |

---

### Table 3: `permissions`
Master list of all permission tokens in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `name` | VARCHAR(50) | PRIMARY KEY | Permission token string |
| `label` | VARCHAR(100) | NOT NULL | Human-readable description |

**Data (26 permissions):**
| name | label |
|------|-------|
| dashboard:read | View dashboard |
| users:read | View staff list |
| users:create | Register new staff |
| users:delete | Remove staff accounts |
| roles:assign | Change user roles |
| account:unlock | Unlock locked accounts |
| patients:read | View patient records |
| patients:manage | Edit patient records |
| patients:register | Register new patients |
| medical_records:read | View medical records |
| medical_records:manage | Edit medical records |
| reports:read | View medical reports |
| reports:create | Submit medical reports |
| reports:manage | Delete/edit any report |
| finance:read | View financial data |
| wards:read | View ward status |
| wards:manage | Manage ward assignments |
| wards:update | Update ward notes |
| appointments:read | View appointments |
| appointments:manage | Book/edit/cancel appointments |
| audit:read | View audit log |
| announcements:read | View announcements |
| announcements:manage | Post/delete announcements |
| profile:read | View own profile |
| profile:update | Edit own profile |

---

### Table 4: `role_permissions`
Junction table mapping roles to their allowed permissions (many-to-many).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Row identifier |
| `role_name` | VARCHAR(20) | NOT NULL, FK → roles | Role identifier |
| `permission` | VARCHAR(50) | NOT NULL, FK → permissions | Permission token |

**Unique constraint:** `(role_name, permission)` — no duplicate assignments.

---

### Table 5: `audit_logs`
Tamper-resistant log of all authentication and authorization events. Persisted to `audit_logs.json`.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(30) | PRIMARY KEY | Unique log ID (`log_<timestamp>_<random>`) |
| `timestamp` | DATETIME | NOT NULL | ISO 8601 event timestamp |
| `event` | VARCHAR(50) | NOT NULL | Event type (see list below) |
| `user_id` | VARCHAR(10) | NULLABLE, FK → users | ID of user involved |
| `username` | VARCHAR(50) | NOT NULL | Username string at time of event |
| `ip` | VARCHAR(45) | NOT NULL | Client IP address (IPv4/IPv6) |
| `details` | TEXT | NOT NULL | Human-readable event description |
| `outcome` | VARCHAR(20) | NOT NULL | SUCCESS / FAILED / BLOCKED / DENIED / INFO |

**Logged Event Types:**
| Event | Outcome | Trigger |
|-------|---------|---------|
| LOGIN_SUCCESS | SUCCESS | Correct credentials, token issued |
| LOGIN_FAILED | FAILED | Wrong password |
| LOGIN_BLOCKED | BLOCKED | Account already locked |
| ACCOUNT_LOCKED | BLOCKED | 5th failed attempt reached |
| ACCOUNT_UNLOCKED | SUCCESS | CMO manually unlocks account |
| LOGOUT | SUCCESS | User signs out, token revoked |
| ACCESS_DENIED | DENIED | Role lacks required permission |
| USER_REGISTERED | SUCCESS | New staff account created |
| USER_DELETED | SUCCESS | Staff account removed |
| ROLE_CHANGED | SUCCESS | User role reassigned |
| APPOINTMENT_CREATED | SUCCESS | New appointment booked |
| APPOINTMENT_UPDATED | SUCCESS | Appointment status changed |
| APPOINTMENT_CANCELLED | SUCCESS | Appointment deleted |
| ANNOUNCEMENT_CREATED | SUCCESS | New announcement posted |
| ANNOUNCEMENT_DELETED | SUCCESS | Announcement removed |

---

### Table 6: `appointments`
Stores patient appointment records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(20) | PRIMARY KEY | Auto-generated ID (e.g., `apt_001`) |
| `patient_name` | VARCHAR(100) | NOT NULL | Patient's full name |
| `patient_age` | VARCHAR(5) | NULLABLE | Patient age |
| `doctor` | VARCHAR(100) | NOT NULL | Assigned doctor name |
| `department` | VARCHAR(100) | NOT NULL | Hospital department |
| `date` | DATE | NOT NULL | Appointment date |
| `time` | TIME | NOT NULL | Appointment time |
| `type` | VARCHAR(50) | NOT NULL | Type: Consultation / Follow-up / Surgery / ECG |
| `notes` | TEXT | NULLABLE | Clinical notes |
| `status` | VARCHAR(20) | DEFAULT 'Confirmed' | Confirmed / Pending / Cancelled |
| `created_by` | VARCHAR(100) | NOT NULL | Name of staff who booked |
| `created_by_role` | VARCHAR(20) | NOT NULL | Role of staff who booked |
| `created_at` | DATETIME | NOT NULL | Creation timestamp |

---

### Table 7: `announcements`
Stores hospital-wide announcements posted by CMO or Admin.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(20) | PRIMARY KEY | Auto-generated ID (e.g., `ann_001`) |
| `title` | VARCHAR(200) | NOT NULL | Announcement headline |
| `body` | TEXT | NOT NULL | Full announcement text |
| `tag` | VARCHAR(50) | DEFAULT 'General' | Category tag: Facility / Meeting / Protocol / General |
| `priority` | VARCHAR(20) | DEFAULT 'normal' | urgent / high / normal |
| `author` | VARCHAR(100) | NOT NULL | Name of posting staff member |
| `author_role` | VARCHAR(20) | NOT NULL | Role of posting staff member |
| `created_at` | DATETIME | NOT NULL | Post timestamp |

---

## Notes on Production SQL Implementation

In a production deployment, the schema above would be implemented in **PostgreSQL** using an ORM such as **Prisma** or **Sequelize**. Key considerations:

- All queries would use **parameterized statements** to prevent SQL injection.
- `password_hash` column would have `SELECT` restricted to the authentication service only.
- Audit logs table would be **append-only** (no UPDATE or DELETE permissions granted to the app user).
- Foreign key constraints and indexes would be enforced at the database level.
- The `audit_logs` table would use a separate database connection with write-only access from the application.

---
*Schema prepared as part of CLO 3 / GA4 deliverable — Information Security, June 2026.*
