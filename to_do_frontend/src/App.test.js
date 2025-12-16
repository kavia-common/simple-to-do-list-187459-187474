import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const API = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';

const fixtures = {
  todos: [
    { id: '1', title: 'First task', completed: false },
    { id: '2', title: 'Second task', completed: true },
  ],
};

const server = setupServer(
  rest.get(`${API}/todos`, (_req, res, ctx) => res(ctx.json(fixtures.todos))),
  rest.post(`${API}/todos`, async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.json({ id: '3', title: body.title, completed: false })
    );
  }),
  rest.put(`${API}/todos/:id`, async (req, res, ctx) => {
    const id = req.params.id;
    const body = await req.json();
    const t =
      fixtures.todos.find((x) => x.id === id) || { id, title: body.title || 'X', completed: !!body.completed };
    return res(ctx.json({ ...t, ...body }));
  }),
  rest.delete(`${API}/todos/:id`, (req, res, ctx) => {
    return res(ctx.json({ ok: true }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('displays list and stats, allows adding a new task', async () => {
  render(<App />);

  // Initial load
  expect(await screen.findByText(/First task/i)).toBeInTheDocument();
  expect(screen.getByText(/Second task/i)).toBeInTheDocument();

  // Add new task
  const input = screen.getByLabelText(/Task title/i);
  fireEvent.change(input, { target: { value: 'New Task' } });
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));

  // Optimistic add then replacement from server
  await screen.findByText(/New Task/i);

  // Stats displayed
  await waitFor(() => {
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });
});

test('toggle complete and delete task', async () => {
  render(<App />);
  const first = await screen.findByText(/First task/i);

  // Toggle complete for "First task"
  const checkbox = first.closest('li').querySelector('input[type="checkbox"]');
  fireEvent.click(checkbox);

  // Delete a task
  const second = screen.getByText(/Second task/i);
  const deleteBtn = second.closest('li').querySelector('button[aria-label^="Delete"]');
  fireEvent.click(deleteBtn);

  // Ensure still renders and allows refresh
  fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
  expect(await screen.findByText(/First task/i)).toBeInTheDocument();
});

test('edit a task inline and save', async () => {
  render(<App />);
  const first = await screen.findByText(/First task/i);
  const editBtn = first.closest('li').querySelector('button[aria-label^="Edit"]');
  fireEvent.click(editBtn);

  const editField = screen.getByLabelText(/Edit Task/i);
  fireEvent.change(editField, { target: { value: 'First task (edited)' } });

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  await screen.findByText(/First task \(edited\)/i);
});
