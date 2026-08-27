# Shonge Achi

Elderly wellbeing monitoring platform.

## Project Structure

```
ShongeAchi/
├── backend/   → Next.js API routes + MongoDB
└── frontend/  → Next.js + Tailwind CSS + NextAuth
```

## Setup Instructions

### 1. Backend

```bash
cd backend
npm install
```

Create `backend/.env.local`:
```
MONGODB_URI=mongodb+srv://abirraihanshafat_db_user:mongoDBShongeAchi@shonge-achi.cvjyaoh.mongodb.net/shongeachi
```

Run backend:
```bash
npm run dev -- -p 1078
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```
BACKEND_URL=http://localhost:1078
NEXT_PUBLIC_BACKEND_URL=http://localhost:1078
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=shongeachi-secret-key-2026
GOOGLE_CLIENT_ID=GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=GOOGLE_CLIENT_SECRET
```

Add images to `frontend/public/`:
- `logo.png` — Shonge Achi logo
- `hero-bg.jpg` — Hero background image

Run frontend:
```bash
npm run dev -- -p 3000
```

## Pages

- `/` — Home page
- `/about` — About page
- `/pricing` — Pricing page
- `/signin` — Sign in page
- `/signup` — Create account page
- `/become-a-checker` — Become a checker page
- `/register-elder` — Register elder (requires login)

## Backend APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/elders | Create elder profile |
| GET | /api/elders?familyMemberId= | Get all elders |
| GET | /api/elders/:id | Get single elder |
| PUT | /api/elders/:id | Update elder |
| PUT | /api/elders/:id/schedule | Update visit schedule |
| DELETE | /api/elders/:id | Delete elder |
| POST | /api/wellbeing/:id/visits | Add visit log |
| GET | /api/wellbeing/:id/visits | Get visit history |
| GET | /api/wellbeing/:id/concern-score | Get concern score |
| GET | /api/wellbeing/:id/concern-breakdown | Get concern breakdown |
| GET | /api/wellbeing/:id/summary | Get AI summary |
