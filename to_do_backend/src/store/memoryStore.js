import { v4 as uuidv4 } from 'uuid';

/**
 * Simple in-memory store for todos.
 * This is not persistent and will reset on server restart.
 * Each todo: { id: string, title: string, completed: boolean, createdAt: number, updatedAt: number }
 */

const state = {
  todos: []
};

// Seed with a couple of examples for convenience (optional)
state.todos.push(
  { id: uuidv4(), title: 'First task', completed: false, createdAt: Date.now(), updatedAt: Date.now() },
  { id: uuidv4(), title: 'Second task', completed: true, createdAt: Date.now(), updatedAt: Date.now() }
);

// PUBLIC_INTERFACE
export function list() {
  /** Return a shallow copy of all todos */
  return [...state.todos];
}

// PUBLIC_INTERFACE
export function create({ title }) {
  /** Create a todo with given title. */
  const t = {
    id: uuidv4(),
    title: String(title || '').trim(),
    completed: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  state.todos.unshift(t);
  return t;
}

// PUBLIC_INTERFACE
export function update(id, { title, completed }) {
  /** Update an existing todo by id with provided fields. Returns updated or null if not found. */
  const idx = state.todos.findIndex(t => t.id === id);
  if (idx === -1) return null;
  const next = {
    ...state.todos[idx],
    ...(title !== undefined ? { title: String(title).trim() } : {}),
    ...(completed !== undefined ? { completed: !!completed } : {}),
    updatedAt: Date.now()
  };
  state.todos[idx] = next;
  return next;
}

// PUBLIC_INTERFACE
export function remove(id) {
  /** Remove a todo by id. Returns true if removed, false otherwise. */
  const lenBefore = state.todos.length;
  const next = state.todos.filter(t => t.id !== id);
  state.todos = next;
  return next.length !== lenBefore;
}
