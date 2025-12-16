const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  '';

/**
 * Build full URL from path with env-configured base.
 * @param {string} path
 */
function url(path) {
  const base = (API_BASE || '').replace(/\/*$/, '');
  const p = String(path || '').replace(/^\/*/, '');
  return `${base}/${p}`;
}

/**
 * Handle fetch response: throw on !ok, parse json when possible.
 * @param {Response} res
 */
async function handle(res) {
  // Read text first; some endpoints may return empty or plain text bodies.
  const text = await res.text();

  let data = null;
  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch (_e) {
      // Preserve raw text when JSON parse fails for better error context.
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      (typeof data === 'string' ? data : '') ||
      (data && data.raw) ||
      `Request failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// PUBLIC_INTERFACE
export async function listTodos() {
  /** List all todos. Returns [{id, title, completed}] */
  const res = await fetch(url('/todos'), {
    headers: { 'Content-Type': 'application/json' },
  });
  return handle(res);
}

// PUBLIC_INTERFACE
export async function createTodo(payload) {
  /** Create a new todo. payload: { title } */
  const res = await fetch(url('/todos'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

// PUBLIC_INTERFACE
export async function updateTodo(id, payload) {
  /** Update a todo by id. payload: { title?, completed? } */
  const res = await fetch(url(`/todos/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  /** Delete a todo by id */
  const res = await fetch(url(`/todos/${id}`), {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  return handle(res);
}
