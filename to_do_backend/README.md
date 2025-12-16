# To Do Backend (Express)

A minimal Express API with an in-memory store for a Simple To Do app. Provides CRUD endpoints, CORS configured via environment, and a healthcheck.

## Features

- In-memory storage for todos (resets on restart)
- REST API under /api:
  - GET    /api/todos
  - POST   /api/todos
  - PUT    /api/todos/:id
  - PATCH  /api/todos/:id/toggle
  - DELETE /api/todos/:id
- CORS allowed origin via FRONTEND_URL (default http://localhost:3000)
- Health endpoint GET /health -> { "status": "ok" }
- JSON error responses for 404 and generic errors
- Env config via .env with sane defaults

## Endpoints and Payloads

Base URL: http://localhost:4000 (configurable via PORT)  
API Base Path: /api

1) GET /api/todos
- Summary: List all todos.
- Response 200: [
  { "id": "string", "title": "string", "completed": boolean, "createdAt": number, "updatedAt": number }
]

2) POST /api/todos
- Summary: Create a new todo.
- Request body (JSON): { "title": "string" }
- Responses:
  - 201: { "id": "string", "title": "string", "completed": false, "createdAt": number, "updatedAt": number }
  - 400: { "error": "Bad Request", "message": "Title is required" }

3) PUT /api/todos/:id
- Summary: Update title and/or completed state.
- Request body (JSON): { "title"?: "string", "completed"?: boolean }
- Responses:
  - 200: { "id": "string", "title": "string", "completed": boolean, "createdAt": number, "updatedAt": number }
  - 400: { "error": "Bad Request", "message": "Title cannot be empty" }
  - 404: { "error": "Not Found", "message": "Todo :id not found" }

4) PATCH /api/todos/:id/toggle
- Summary: Toggle the completed state of a todo.
- Responses:
  - 200: { "id": "string", "title": "string", "completed": boolean, "createdAt": number, "updatedAt": number }
  - 404: { "error": "Not Found", "message": "Todo :id not found" }

5) DELETE /api/todos/:id
- Summary: Delete a todo by id.
- Responses:
  - 200: { "ok": true }
  - 404: { "error": "Not Found", "message": "Todo :id not found" }

6) GET /health (or custom path via HEALTHCHECK_PATH)
- Summary: Healthcheck endpoint.
- Response 200: { "status": "ok" }

## CORS and Integration

- CORS allowed origin is controlled by FRONTEND_URL. It must match the browser origin of the frontend.
  - Default FRONTEND_URL: http://localhost:3000
- The included React frontend uses REACT_APP_API_BASE to construct requests:
  - For local development set REACT_APP_API_BASE=http://localhost:4000/api
- With defaults:
  - Backend listens on PORT=4000
  - API base path is /api
  - Frontend runs at http://localhost:3000

Quick integration steps with the included frontend:
1) Backend .env:
   - PORT=4000
   - FRONTEND_URL=http://localhost:3000
   - HEALTHCHECK_PATH=/health
2) Frontend .env:
   - REACT_APP_API_BASE=http://localhost:4000/api
3) Start backend then frontend. Requests will be sent to:
   - GET/POST/PUT/DELETE: {REACT_APP_API_BASE}/todos
   - Toggle (if used directly): {REACT_APP_API_BASE}/todos/:id/toggle

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
- Frontend client calls:
  - GET {REACT_APP_API_BASE}/todos
  - POST {REACT_APP_API_BASE}/todos
  - PUT {REACT_APP_API_BASE}/todos/:id
  - DELETE {REACT_APP_API_BASE}/todos/:id
  - PATCH {REACT_APP_API_BASE}/todos/:id/toggle (supported by backend)
