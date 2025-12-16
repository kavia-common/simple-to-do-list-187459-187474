# To Do Frontend (React)

A simple and user-friendly To Do app built with React. Users can add, edit, delete, and mark tasks as complete.

## Quick Start

1) Copy environment template and adjust values:
   cp .env.example .env
   - Ensure REACT_APP_API_BASE points to your backend (e.g., http://localhost:4000)

2) Install dependencies:
   npm install

3) Start the app:
   npm start
   - App: http://localhost:3000

4) Run tests (CI mode):
   npm test

## Environment

Important variables (see .env.example):
- REACT_APP_API_BASE: Base URL for backend API (used by API client)
- REACT_APP_BACKEND_URL: Fallback base URL for API
- Other optional variables used for consistency across environments

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

- Backend is expected to expose REST endpoints:
  GET /todos
  POST /todos body: { title }
  PUT /todos/:id body: { title?, completed? }
  DELETE /todos/:id
