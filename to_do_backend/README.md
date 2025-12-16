# To Do Backend (Express)

A minimal Express API with an in-memory store for a Simple To Do app. Provides CRUD endpoints, CORS configured via environment, and a healthcheck.

## Features

- In-memory storage for todos (resets on restart)
- REST API:
  - GET    /api/todos
  - POST   /api/todos           body: { title }
  - PUT    /api/todos/:id       body: { title?, completed? }
  - PATCH  /api/todos/:id/toggle
  - DELETE /api/todos/:id
- CORS allowed origin via FRONTEND_URL (default http://localhost:3000)
- Health endpoint GET /health -> { "status": "ok" }
- JSON error responses for 404 and generic errors
- Env config via .env with sane defaults

## Quick Start

1) Copy environment template and adjust values:
   cp .env.example .env

   Important:
   - FRONTEND_URL should match your frontend origin (e.g., http://localhost:3000)
   - PORT defaults to 4000
   - HEALTHCHECK_PATH defaults to /health

2) Install dependencies:
   npm install

3) Start in dev (auto-reload):
   npm run dev

   Or start normally:
   npm start

Backend will listen on http://localhost:4000 by default.

## Environment

- PORT: Port to run the server on (default 4000)
- HEALTHCHECK_PATH: Path for health endpoint (default /health)
- FRONTEND_URL: Allowed CORS origin (default http://localhost:3000)

See .env.example for a template.

## Notes

- Data is not persisted. Restarting the server resets todos.
- Aligns with the frontend client which calls:
  - GET {API_BASE}/todos
  - POST {API_BASE}/todos
  - PUT {API_BASE}/todos/:id
  - DELETE {API_BASE}/todos/:id

Set REACT_APP_API_BASE (frontend) to http://localhost:4000/api for local development.
