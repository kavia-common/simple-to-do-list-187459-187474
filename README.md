# Simple To Do List App

This repository contains a minimal full‑stack To Do application with:
- Frontend: React app running on http://localhost:3000
- Backend: Express API running on http://localhost:4000

## Quick Start

### Prerequisites
- Node.js LTS (v18+) and npm

### 1) Start the Backend (port 4000)
1. Open a terminal at simple-to-do-list-187459-187474/to_do_backend
2. Copy the environment template:
   cp .env.example .env
   - Defaults: PORT=4000, FRONTEND_URL=http://localhost:3000, HEALTHCHECK_PATH=/health
3. Install and start:
   npm install
   npm run dev
   - Backend: http://localhost:4000
   - Health:  http://localhost:4000/health
   - API:     http://localhost:4000/api/todos

### 2) Start the Frontend (port 3000)
1. Open a second terminal at simple-to-do-list-187459-187474/to_do_frontend
2. Copy the environment template:
   cp .env.example .env
   - Ensure REACT_APP_API_BASE=http://localhost:4000/api
3. Install and start:
   npm install
   npm start
   - Frontend: http://localhost:3000

### 3) Verify Integration
- Open http://localhost:3000 and add a task, toggle completion, edit, and delete.
- The footer shows the API base in use.

## Environment Variables

### Frontend (.env in to_do_frontend)
- REACT_APP_API_BASE: Base URL for backend API (e.g., http://localhost:4000/api). Used by src/api/todos.js.
- REACT_APP_BACKEND_URL: Optional fallback if REACT_APP_API_BASE is not set.

Optional variables provided in .env.example for consistency across environments:
- REACT_APP_FRONTEND_URL, REACT_APP_WS_URL, REACT_APP_NODE_ENV, REACT_APP_NEXT_TELEMETRY_DISABLED,
  REACT_APP_ENABLE_SOURCE_MAPS, REACT_APP_PORT, REACT_APP_TRUST_PROXY, REACT_APP_LOG_LEVEL,
  REACT_APP_HEALTHCHECK_PATH, REACT_APP_FEATURE_FLAGS, REACT_APP_EXPERIMENTS_ENABLED

Note: Only REACT_APP_API_BASE (and optionally REACT_APP_BACKEND_URL) are read by the app code.

### Backend (.env in to_do_backend)
- PORT: Port for Express (default 4000).
- FRONTEND_URL: Allowed CORS origin (default http://localhost:3000).
- HEALTHCHECK_PATH: Health endpoint path (default /health).
- TRUST_PROXY: Not used by current code, but may be set in hosting environments.
- LOG_LEVEL: Not used by current code, but may be set in hosting environments.

## Development Scripts

### Backend (to_do_backend)
- npm run dev: Start with nodemon (auto‑reload)
- npm start: Start normally

### Frontend (to_do_frontend)
- npm start: Start CRA dev server on port 3000
- npm test: Run tests in CI mode (watch disabled)
- npm run build: Build production bundle

## API Reference

Base URL: http://localhost:4000  
API Base Path: /api

- GET /api/todos
  - Summary: List all todos.
  - 200 Response:
    [
      { "id":"string", "title":"string", "completed":boolean, "createdAt":number, "updatedAt":number }
    ]

- POST /api/todos
  - Summary: Create a new todo.
  - Request (application/json): { "title": "Buy milk" }
  - 201 Response: { "id":"...", "title":"Buy milk", "completed":false, "createdAt":123, "updatedAt":123 }
  - 400 Response: { "error":"Bad Request", "message":"Title is required" }

- PUT /api/todos/:id
  - Summary: Update title and/or completed.
  - Request (application/json): { "title":"New", "completed":true } (both optional; title cannot be empty string)
  - 200 Response: Updated todo object
  - 400 Response: { "error":"Bad Request", "message":"Title cannot be empty" }
  - 404 Response: { "error":"Not Found", "message":"Todo :id not found" }

- PATCH /api/todos/:id/toggle
  - Summary: Toggle completed state.
  - 200 Response: Updated todo object
  - 404 Response: { "error":"Not Found", "message":"Todo :id not found" }

- DELETE /api/todos/:id
  - Summary: Delete a todo.
  - 200 Response: { "ok": true }
  - 404 Response: { "error":"Not Found", "message":"Todo :id not found" }

- GET /health (configurable via HEALTHCHECK_PATH)
  - Summary: Healthcheck
  - 200 Response: { "status": "ok" }

Example cURL:
- List: curl -s http://localhost:4000/api/todos
- Create: curl -s -X POST http://localhost:4000/api/todos -H "Content-Type: application/json" -d '{"title":"Test"}'
- Update: curl -s -X PUT http://localhost:4000/api/todos/<id> -H "Content-Type: application/json" -d '{"completed":true}'
- Toggle: curl -s -X PATCH http://localhost:4000/api/todos/<id>/toggle
- Delete: curl -s -X DELETE http://localhost:4000/api/todos/<id>

## Testing

### Frontend tests
- Run once in CI mode:
  npm test
  (This uses CI=true react-scripts test --watchAll=false)

### Backend tests
- None included in this template.

## Troubleshooting

- CORS errors:
  - Ensure FRONTEND_URL in to_do_backend/.env matches the frontend origin (http://localhost:3000).
  - Restart the backend after changing .env.

- Environment changes not applied (CRA):
  - After changing to_do_frontend/.env, stop and restart npm start.
  - Ensure variables are prefixed with REACT_APP_.

- Wrong URLs:
  - Verify REACT_APP_API_BASE points to http://localhost:4000/api.
  - Confirm backend PORT and HEALTHCHECK_PATH are correct.
  - Use the footer in the app to confirm current API base.

See simple-run.md for a concise run-book to start both services locally.
