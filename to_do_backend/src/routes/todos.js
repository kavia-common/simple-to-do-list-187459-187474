import { Router } from 'express';
import { list, create, update, remove } from '../store/memoryStore.js';

const router = Router();

/**
 * Routes for todos.
 * Base path is mounted at /api/todos in server.js
 * Endpoints:
 *  - GET    /           -> list todos
 *  - POST   /           -> create todo { title }
 *  - PUT    /:id        -> update todo { title?, completed? }
 *  - PATCH  /:id/toggle -> toggles completed
 *  - DELETE /:id        -> delete todo
 */

// GET /api/todos
router.get('/', (_req, res) => {
  return res.json(list());
});

// POST /api/todos
router.post('/', (req, res) => {
  const title = req.body?.title;
  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: 'Bad Request', message: 'Title is required' });
  }
  const created = create({ title });
  return res.status(201).json(created);
});

// PUT /api/todos/:id
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const payload = {
    title: req.body?.title,
    completed: req.body?.completed
  };
  if (payload.title !== undefined && !String(payload.title).trim()) {
    return res.status(400).json({ error: 'Bad Request', message: 'Title cannot be empty' });
  }
  const updated = update(id, payload);
  if (!updated) {
    return res.status(404).json({ error: 'Not Found', message: `Todo ${id} not found` });
  }
  return res.json(updated);
});

// PATCH /api/todos/:id/toggle
router.patch('/:id/toggle', (req, res) => {
  const id = req.params.id;
  // Determine current and toggle
  const current = list().find(t => t.id === id);
  if (!current) {
    return res.status(404).json({ error: 'Not Found', message: `Todo ${id} not found` });
  }
  const updated = update(id, { completed: !current.completed });
  return res.json(updated);
});

// DELETE /api/todos/:id
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const ok = remove(id);
  if (!ok) {
    return res.status(404).json({ error: 'Not Found', message: `Todo ${id} not found` });
  }
  return res.json({ ok: true });
});

export default router;
