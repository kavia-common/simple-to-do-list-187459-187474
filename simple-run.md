# Simple Run Guide (Local)

This guide shows how to run the frontend (React) and backend (Express) together on your machine.

## Prerequisites
- Node.js LTS (v18+) and npm

## 1) Backend (Express)
1. Open a terminal at simple-to-do-list-187459-187474/to_do_backend
2. Copy env template:
   cp .env.example .env
   - Defaults: PORT=4000, FRONTEND_URL=http://localhost:3000
3. Install and start:
   npm install
   npm run dev
   - Backend: http://localhost:4000
   - Health:  http://localhost:4000/health
   - API:     http://localhost:4000/api/todos

## 2) Frontend (React)
1. Open a second terminal at simple-to-do-list-187459-187474/to_do_frontend
2. Copy env template:
   cp .env.example .env
   - Ensure REACT_APP_API_BASE=http://localhost:4000/api
3. Install and start:
   npm install
   npm start
   - App: http://localhost:3000

## 3) Verify Integration
- Open http://localhost:3000 in your browser.
- Add a task, toggle completion, edit, and delete.
- The footer in the app shows the API base in use.

## Troubleshooting
- CORS: Make sure FRONTEND_URL in backend .env matches the frontend origin (http://localhost:3000).
- Ports: If 3000 or 4000 are busy, change REACT_APP_API_BASE/PORT accordingly.
- Environment: After changing .env, stop and restart the respective service.
