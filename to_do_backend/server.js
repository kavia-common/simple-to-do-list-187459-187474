import express from 'express';
import dotenv from 'dotenv';
import { createCorsMiddleware } from './src/middleware/cors.js';
import todosRouter from './src/routes/todos.js';

/**
 * Entry point for To Do Backend.
 * Loads env, configures CORS, JSON parsing, healthcheck, routes, 404 and error handlers.
 * Env:
 *  - PORT: server port (default 4000)
 *  - HEALTHCHECK_PATH: health endpoint path (default /health)
 *  - FRONTEND_URL: allowed CORS origin (default http://localhost:3000)
 */

dotenv.config();

const app = express();

// Config
const PORT = Number(process.env.PORT) || 4000;
const HEALTHCHECK_PATH = process.env.HEALTHCHECK_PATH || '/health';

// Middleware
app.use(createCorsMiddleware());
app.use(express.json());

// Health endpoint
app.get(HEALTHCHECK_PATH, (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/api/todos', todosRouter);

// 404 handler
app.use((req, res, _next) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.originalUrl
  });
});

// Generic error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const payload = {
    error: err.name || 'Error',
    message: err.message || 'Internal Server Error'
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
});

// Start
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[to_do_backend] listening on port ${PORT}`);
});
