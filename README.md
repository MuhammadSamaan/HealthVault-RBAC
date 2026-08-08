# HealthVault — RBAC Portal
### Secure Role-Based Access Control System
### Made by Muhammad Samaan


---

## SCREENSHOTS

## CMO
## Login Page
https://raw.githubusercontent.com/MuhammadSamaan/HealthVault-RBAC/refs/heads/main/Output%20Images/01-login.png

## CMO Dashboard
https://github.com/MuhammadSamaan/HealthVault-RBAC/blob/main/Output%20Images/02-cmo-dashboard.png
![CMO Dashboard](screenshots/02-cmo-dashboard.png) |

## Staff Management 
https://github.com/MuhammadSamaan/HealthVault-RBAC/blob/main/Output%20Images/03-staff-management.png

## Admin Dashboard 
https://github.com/MuhammadSamaan/HealthVault-RBAC/blob/main/Output%20Images/04-admin-dashboard.png

## Doctor Dashboard  
https://github.com/MuhammadSamaan/HealthVault-

## Nurse Dashboard 
https://github.com/MuhammadSamaan/HealthVault-RBAC/blob/main/Output%20Images/06-nurse-dashboard.png

## Reception Dashboard 
https://github.com/MuhammadSamaan/HealthVault-RBAC/blob/main/Output%20Images/07-reception-dashboard.png

---

## TECH STACK

**Backend:** Node.js, Express, JWT (HMAC-SHA256), bcrypt, express-rate-limit
**Frontend:** React 18, React Router, Axios
**Data:** File-based JSON storage (no external database required)

---

## LOGIN CREDENTIALS

| Full Name           | Username         | Password        | Role                  |
|---------------------|------------------|-----------------|-----------------------|
| Dr. Maryam Sheikh   | maryam.sheikh    | Maryam@2026!    | Chief Medical Officer |
| Ahmed Karimi        | ahmed.karimi     | Ahmed#Hosp26    | Administrator         |
| Dr. Zainab Raza     | zainab.raza      | Zainab$Doc26    | Doctor                |
| Fatima Noor         | fatima.noor      | Fatima*Nur26    | Nurse                 |
| Usman Malik         | usman.malik      | Usman@Rec26     | Receptionist          |

---

## RUN LOCALLY

### First Time Only:
```
Terminal 1 (Backend):   cd backend && npm install && node server.js
Terminal 2 (Frontend):  cd frontend && npm install && npm start
```

### Every Time After:
```
Terminal 1: cd backend && node server.js
Terminal 2: cd frontend && npm start
```
Browser opens at: http://localhost:3000

### Environment Variables (Backend)
Copy `backend/.env.example` to `backend/.env` and set:
```
JWT_SECRET=your-own-long-random-secret
PORT=5000
```
If `.env` is not created, the app falls back to a default secret — fine for local testing, **not for production**.

### Environment Variables (Frontend)
By default the frontend calls `http://localhost:5000/api`. To point it at a deployed backend, create `frontend/.env`:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

## DEPLOYMENT

This project is deployment-ready for free hosting:

| Layer    | Recommended Host  | Notes                                   |
|----------|--------------------|------------------------------------------|
| Backend  | Render (free tier)| Auto-configured via `render.yaml`         |
| Frontend | Vercel (free tier)| Auto-detects React, zero config needed    |


---

## PAGES & WHO CAN ACCESS THEM

| Page             | CMO | Admin | Doctor | Nurse | Receptionist |
|------------------|-----|-------|--------|-------|--------------|
| Dashboard        | ✓   | ✓     | ✓      | ✓     | ✓            |
| Appointments     | ✓   | ✓     | ✓      | View  | ✓            |
| Announcements    | ✓   | ✓     | Read   | Read  | Read         |
| Medical Reports  | ✓   | ✓     | ✓      | ✗     | ✗            |
| Staff Management | ✓   | ✓     | ✗      | ✗     | ✗            |
| Audit Log        | ✓   | ✗     | ✗      | ✗     | ✗            |

---

## WHO CAN DO WHAT

**Book Appointments:** CMO, Admin, Doctor, Receptionist
**View Appointments:** All roles
**Post Announcements:** CMO, Admin only
**Delete Announcements:** CMO, Admin only
**Register New Staff:** CMO, Admin
**Change Roles:** CMO only
**Unlock Accounts:** CMO only
**View Audit Log:** CMO only

---

## SECURITY FEATURES
- bcrypt password hashing (cost=10) with unique salt per user
- JWT tokens signed with HMAC-SHA256, 2 hour TTL
- Account lockout after 5 failed attempts (15 min auto-unlock)
- Session expiry popup warning at 5 min, redirect at expiry
- Token revocation on logout (server-side blacklist)
- Tampered token detection and rejection
- Input sanitization on all requests (XSS prevention)
- Security headers on every response
- Rate limiting: 30 login attempts per 15 min per IP
- Persistent audit log saved to audit_logs.json
- Fully responsive: mobile, tablet, desktop
