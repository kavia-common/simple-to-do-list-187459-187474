# To Do Frontend (React)

A simple and user-friendly To Do app built with React. Users can add, edit, delete, and mark tasks as complete.

## Quick Start

1) Copy environment template and adjust values:
   cp .env.example .env
   - Ensure REACT_APP_API_BASE points to your backend API base (local default: http://localhost:4000/api)

2) Install dependencies:
   npm install

3) Start the app:
   npm start
   - App: http://localhost:3000

4) Run tests (CI mode):
   npm test

## Environment

Important variables (see .env.example):
- REACT_APP_API_BASE: Base URL for backend API (used by API client). For local dev: http://localhost:4000/api
- REACT_APP_BACKEND_URL: Fallback base URL for API (optional)
- Other optional variables used for consistency across environments

## Integration

- This frontend expects a backend available at REACT_APP_API_BASE.
- When running the included Express backend locally with defaults:
  - Backend: http://localhost:4000 with API at /api
  - Frontend: http://localhost:3000
- Set REACT_APP_API_BASE=http://localhost:4000/api in your .env to connect.
- The backend must allow CORS from FRONTEND_URL (http://localhost:3000 by default).

See ../../simple-run.md for a quick guide to run both services together.

## Architecture

- src/api/todos.js: API client for CRUD operations
- src/hooks/useTodos.js: State management with optimistic updates
- src/App.js: UI composition and accessibility
- src/App.css: Modern styling with light/dark theme support
- src/App.test.js: Integration-style tests using MSW + Testing Library

## Accessibility

- Proper labels, aria-live regions, and keyboard-friendly forms
- Inline editing supports submit/cancel with buttons and Enter key

## Notes

- Backend is expected to expose REST endpoints under /api/todos:
  GET /todos
  POST /todos body: { title }
  PUT /todos/:id body: { title?, completed? }
  DELETE /todos/:id
