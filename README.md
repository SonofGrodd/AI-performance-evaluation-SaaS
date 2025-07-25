# Fredan – AI-Powered Employee Assessment Platform

Fredan is a scalable SaaS platform that empowers companies to measure employee performance, gather feedback, manage review cycles, and gain AI-driven insights. It features a powerful backend (FastAPI-style Express server + Supabase) and a modern frontend (React + Tailwind + Vite).

---

## 🧠 Key Features

- Custom performance metrics
- Peer & manager assessments
- Calendar, attendance & review cycles
- AI feedback analysis & insights
- Role-based dashboards
- Report exporting (CSV/PDF)
- JWT-based auth with Supabase
- 3rd-party integrations (Slack, Trello, Jira)

---

## ⚙️ Tech Stack

| Layer      | Technology                            |
|------------|----------------------------------------|
| Frontend   | React, TypeScript, Tailwind CSS, Vite  |
| Backend    | Node.js, Express, Supabase, PostgreSQL |
| Auth       | Supabase JWT, RLS, role-based control  |
| AI Layer   | OpenAI API for sentiment analysis      |
| Dev Tools  | Vite, tsx, Postman, GitHub             |
| Deployment | Vercel (frontend), Railway/Fly.io (API)|

---

## 📂 Project Structure
Fredan/
├── backend/ # Express API + Supabase integration
├── frontend/ # React + Tailwind client app
├── .env # Root-level environment file (optional)
├── README.md # Project overview
└── package.json # Project root metadata (if needed)
