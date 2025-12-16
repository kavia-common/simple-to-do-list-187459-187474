const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  '';

/**
 * Build full URL from path with env-configured base.
 * @param {string} path
 */
function url(path) {
  const base = API_BASE?.replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${base}/${p}`;
}

/**
 * Handle fetch response: throw on !ok, parse json when possible.
 * @param {Response} res
 */
async function handle(res) {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.message || `Request failed: ${res.status}`);
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
