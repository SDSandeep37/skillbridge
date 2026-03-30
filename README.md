# SkillBridge

Full-stack realtime collaboration and mentorship platform (Next.js frontend + Express/Postgres backend).

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Frontend Setup (skillbridge)](#frontend-setup-skillbridge)
5. [Backend Setup (skillbridge_backend)](#backend-setup-skillbridge_backend)
6. [API Reference](#api-reference)
7. [Socket Events](#socket-events)
8. [Database Schema](#database-schema)
9. [Environment variables](#environment-variables)
10. [Future improvements](#future-improvements)

---

## Project Overview

SkillBridge is a learning platform that connects mentors and students for live pair programming, chat, and session management.

- Students can register, view their sessions, join active mentor-created sessions.
- Mentors can register, create sessions, end sessions, and review student list.
- Live code editor sync and chat messaging are backed by Socket.io.
- Persistent storage for users/sessions/chat/code snapshots is in PostgreSQL.

## Tech Stack

- Frontend: Next.js (App Router), React, Tailwind CSS (or custom CSS)
- Backend: Node.js, Express, Socket.io, PostgreSQL, bcrypt, JWT
- Database: PostgreSQL
- Deployment: Vercel for frontend, any Node hosting for backend

## Features

- Signup/login with role-based `mentor` and `student`
- JWT auth using cookies
- Mentor-only session creation
- Student session join flow
- Real-time code collaboration and text chat
- Session status tracking (`active`, `ended`)
- CRUD-like API for session and code data

## Frontend Setup (skillbridge)

1. Open terminal: `cd skillbridge`
2. Install dependencies: `npm install`
3. Start app: `npm run dev`
4. Open `http://localhost:3000`

## Backend Setup (skillbridge_backend)

1. Open terminal: `cd skillbridge_backend`
2. Install dependencies: `npm install`
3. Create `.env` with required vars (see below)
4. Start backend: `npm start`
5. Server runs on `http://localhost:5000`

Database initialization is automatic: `db.js` runs table creation on startup.

## API Reference

All backend routes are path prefixed with `/api`.

### User Routes

- `POST /api/users` - register
  - body: `{ name, email, password, role }`
  - role: `mentor` or `student`

- `POST /api/users/login` - login
  - body: `{ email, password }`

- `POST /api/users/login-check` - verify JWT and fetch user
  - private

- `GET /api/users/students` - mentor-only list of students
  - private

- `POST /api/users/logout` - logout (destroy token cookie)
  - private

### Session Routes

- `POST /api/sessions` - mentor creates session
  - body: `{ student, topic }`

- `GET /api/sessions/student` - student session list

- `GET /api/sessions/mentor` - mentor session list

- `PUT /api/sessions/join-session/:id` - student joins session

- `PUT /api/sessions/end-session/:id` - mentor ends session

### Code Snapshot Routes

- `GET /api/codesnap/:sessionId` - load code snapshot by session

### Chat Routes

- `GET /api/chat/:sessionId` - load message history for session

## Socket Events

Socket.io room key: `sessionId`

- `join-session`: client sends `sessionId`; server sends `load-code` with persisted code
- `code-change`: client sends `{ sessionId, code }`; server updates DB and broadcasts `code-update`
- `cursor-move`: client sends `{ sessionId, name, lineNumber, column, senderId }`; server broadcasts `cursor-update`
- `send-message`: client sends `{ sessionId, message, sender_id }`; server saves and broadcasts `receive-message`

WebRTC relay events (optional):

- `video-offer`
- `video-answer`
- `ice-candidate`

## Database Schema

`db.js` creates these tables if absent:

- `users`: id, name, email, password, role(`mentor` / `student`), timestamps
- `sessions`: id, mentor_id, student_id, topic, status(`active` / `ended`), student_joined, timestamps
- `messages`: id, session_id, sender_id, message, timestamps
- `code_snapshots`: id, session_id, content, timestamps

## Environment variables

`skillbridge_backend/.env` should include:

- `DATABASE_URL=postgres://<user>:<pass>@<host>:<port>/<db>`
- `JWT_SECRET=<strong-secret>`
- `JWT_EXPIRE=1` (hours; optional)
- `NODE_ENV=development`

## Future improvements

- Add request validation libraries (`Joi`, `Yup`)
- Add logging + centralized error handling
- Add tests for routes/controllers/models
- Add Swagger / OpenAPI docs
- 2FA and email verification
- support for persistent WebRTC rooms / video record

---

## Quick troubleshooting

- CORS: `skillbridge_backend/index.js` allows frontend origins.
- JWT cookie is `httpOnly`; debug with API calls or inspect browser devtools network headers.
- Make sure `JWT_SECRET` is consistent in backend and `.env`.

---

Enjoy building SkillBridge!
