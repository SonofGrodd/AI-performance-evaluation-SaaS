# Fredan – AI-Powered Employee Performance Assessment Platform

A production-ready SaaS platform that helps organizations assess, track, and optimize employee performance using intelligent insights, automated feedback systems, and AI-enhanced reports.

---

## 🚀 Tech Stack

### 🧱 Frontend

| Layer         | Technology             | Purpose                                               |
|---------------|------------------------|-------------------------------------------------------|
| **Framework** | [React](https://reactjs.org/) + [Vite](https://vitejs.dev/) | Fast, modern SPA setup                              |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling for responsive design       |
| **Routing**   | [React Router v6+](https://reactrouter.com/) | Declarative routing and protected pages           |
| **State Mgt** | React Context API      | Auth and global user state management                 |
| **Auth Guard**| `ProtectedRoute.tsx`   | Role-based route protection                           |

---

### 🧠 Backend

| Layer          | Technology                      | Purpose                                               |
|----------------|----------------------------------|-------------------------------------------------------|
| **Framework**  | Express + TypeScript            | RESTful API development                              |
| **Database**   | [Supabase](https://supabase.com/) (PostgreSQL) | Managed SQL + Auth + API               |
| **Client**     | Supabase JS Client              | DB queries, auth, and admin ops                       |
| **Middleware** | Custom Auth + RBAC              | Token validation & role-based permissions             |
| **Security**   | `helmet`, `cors`, `express-rate-limit` | Hardened production server                   |
| **Docs**       | Postman + markdown              | API testing and endpoint coverage                     |
| **PDF/CSV**    | `pdfkit`, `fast-csv`            | Report export for performance reviews                 |
| **Mail**       | `nodemailer`                    | (Optional) Notifications and reminders                |
| **Admin Seed** | Supabase Admin SDK + ts-node    | Script to onboard initial admin/company               |

---

### ☁️ Deployment Stack

| Component      | Tech/Platform                    | Description                                           |
|----------------|----------------------------------|-------------------------------------------------------|
| **Frontend**   | Vercel or Netlify                | Instant deployment of Vite React frontend             |
| **Backend**    | Render / Railway / Fly.io        | Deploy Express + Supabase integration                 |
| **Database**   | Supabase                         | Hosted Postgres with Auth + Storage + RLS             |
| **Secrets**    | `.env` + `dotenv`                | Secure environment configuration                      |

---

## 🔐 Authentication & Roles

- **JWT-based Auth**: via Supabase with expiration + signature checks
- **Middleware**:
  - `authenticateUser`: verifies JWT and pulls profile
  - `requireRole(["manager"])`: route guard for specific roles
- **Roles**:
  - `employee`: Can view dashboard, insights, and submit feedback
  - `manager`: Can access team data, review submissions, and more

---

## 🎯 Core Features

- ✅ **Company & Department Onboarding**
- ✅ **Performance Reviews** (Create, Update, Delete)
- ✅ **Calendar + Clock-in/Clock-out Attendance**
- ✅ **AI Insights & Sentiment Analysis**
- ✅ **Peer Reviews & Anonymous Feedback**
- ✅ **Employee Dashboards**
- ✅ **Admin Dashboard & Analytics**
- ✅ **Report Exporting (PDF / CSV)**
- ✅ **Third-party Integration (Slack, Trello, Jira)**
- ✅ **Notification System**
- ✅ **Role-based Access Control**
- ✅ **Customizable Metrics**

---

## 🧪 Testing

- Postman collections with:
  - Auth flows
  - Employee + Manager endpoints
  - Edge cases (expired token, invalid roles, etc.)
- Scheduled payload test suite (to be run post-feature)

---

## 📂 Project Structure (Backend)

Fredan/
├── backend/ # Express API + Supabase integration
├── frontend/ # React + Tailwind client app
├── .env # Root-level environment file (optional)
├── README.md # Project overview
└── package.json # Project root metadata (if needed)