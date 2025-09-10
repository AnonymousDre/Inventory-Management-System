# Inventory Management System (IMS)

React frontend with Supabase authentication, Express backend, and Azure PostgreSQL.

## Project Structure

```
ims/
  src/                  # React app
  backend/              # Express API + Azure PostgreSQL
  public/
  package.json          # Frontend package.json
  backend/server.js     # Backend entry
```

## Prerequisites

- Node.js 18+
- Supabase project (URL + anon key)
- Azure PostgreSQL connection string

## Frontend (React + Supabase Auth)

### 1) Install dependencies

PowerShell:
```
cd ims
npm install
```

Ensure `@supabase/supabase-js` is installed. If not:
```
npm install @supabase/supabase-js
```

### 2) Configure Supabase client

File: `src/supabaseClient.js`

Set your Supabase URL and anon key:
```
const supabaseUrl = "https://YOUR-PROJECT.supabase.co";
const supabaseKey = "YOUR-ANON-KEY";
```

This app uses:
- Email/password sign in: `supabase.auth.signInWithPassword`
- GitHub OAuth: `supabase.auth.signInWithOAuth({ provider: 'github' })`
- Session handling in `App.js` via `getSession()` and `onAuthStateChange()`

### 3) Start frontend dev server

PowerShell (from `ims` folder):
```
npm start
```

App will be available at `http://localhost:3000`.

## Backend (Express + Azure PostgreSQL + Supabase JWT verification)

### 1) Environment variables

Create `ims/backend/.env` with:
```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR-ANON-KEY
AZURE_DATABASE_URL=postgresql://username:password@host:port/database
PORT=4000
```

### 2) Install backend dependencies

PowerShell:
```
cd ims/backend
npm install
```

### 3) Start backend

Development (auto-reload):
```
npm run dev
```

Production:
```
npm start
```

Server runs on `http://localhost:4000`.

### 4) How Supabase auth is used by backend

- Frontend sends API requests with header `Authorization: Bearer <JWT>`
- Backend middleware validates token against Supabase:
  - File: `backend/server.js`, function: `verifySupabaseToken`
  - Calls `GET ${SUPABASE_URL}/auth/v1/user` with `Authorization: Bearer <JWT>` and `apikey: SUPABASE_ANON_KEY`
  - On success attaches `req.user` and continues; on failure returns `401`

Protected routes include:
- `GET /api/inventory`
- `POST /api/inventory`
- `GET /api/categories`

Public route:
- `GET /api/test` (checks DB connectivity)

## Connecting Frontend to Backend

If calling backend from the frontend, include the Supabase JWT:
```
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

fetch('http://localhost:4000/api/inventory', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## PowerShell Tips

- Avoid using `&&` to chain commands. Run them on separate lines instead:
```
cd ims
npm start
```

## Common Issues

- Missing `@supabase/supabase-js`:
  - Run `npm install @supabase/supabase-js` inside `ims`
- 401 Unauthorized from backend:
  - Ensure frontend includes `Authorization: Bearer <JWT>`
  - Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` in backend `.env`
- Database connection errors:
  - Verify `AZURE_DATABASE_URL` and SSL settings

## Scripts

Frontend (from `ims`):
- `npm start` – start React dev server
- `npm run build` – production build

Backend (from `ims/backend`):
- `npm run dev` – start with nodemon
- `npm start` – start production server

## License

Private project.
