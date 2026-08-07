# Shonge Achi local development

The project has two Next.js applications. The frontend proxies same-origin
`/api/*` requests to the backend, avoiding browser CORS issues.

## Environment

Set `MONGODB_URI` in `backend/.env.local` to your MongoDB connection string.
MongoDB Atlas is recommended because capacity-safe assignment uses transactions.
A local MongoDB deployment must run as a replica set for those transactions.

`BACKEND_URL` is server-only. Keep its default value when the backend runs on
port 3001; change it when the backend is hosted elsewhere. Do not set a
`NEXT_PUBLIC_API_URL`: browsers should call the frontend's same-origin `/api`
path.

## Run locally

Use two terminals:

```bash
cd backend
npm install
npm run dev -- -p 3001
```

```bash
cd frontend
npm install
npm run dev -- -p 3000
```

Open `http://localhost:3000/admin/checkers`. Requests such as
`http://localhost:3000/api/checkers` are transparently forwarded to the backend.

Environment files containing credentials are ignored by Git and must remain
local to each application.
