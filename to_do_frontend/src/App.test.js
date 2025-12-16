import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
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
    return res(ctx.json({ id: '3', title: body.title, completed: false }));
  }),
  rest.put(`${API}/todos/:id`, async (req, res, ctx) => {
    const id = req.params.id;
    const body = await req.json();
    const t =
      fixtures.todos.find((x) => x.id === id) ||
      { id, title: body.title || 'X', completed: !!body.completed };
    return res(ctx.json({ ...t, ...body }));
  }),
  rest.delete(`${API}/todos/:id`, (_req, res, ctx) => {
    return res(ctx.json({ ok: true }));
  }),
  // Add an error simulation for add with non-JSON body to ensure robust parsing
  rest.post(`${API}/todos?error=plain`, async (_req, res, ctx) => {
    return res(ctx.status(400), ctx.text('Bad Request: Title is required'));
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
  // Be explicit by querying within the tasks list
  const list = screen.getByRole('list', { name: /tasks list/i });
  await within(list).findByText(/^New Task$/);

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

  // Use a role-based selector for the edit textbox inside the Edit task form
  const editTextbox = screen.getByRole('textbox', { name: /edit task/i });
  fireEvent.change(editTextbox, { target: { value: 'First task (edited)' } });

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  await screen.findByText(/First task \(edited\)/i);
});

test('handles add error with non-JSON body gracefully', async () => {
  // Override handler for this test to simulate plain-text error response
  server.use(
    rest.post(`${API}/todos`, (_req, res, ctx) => {
      return res(ctx.status(400), ctx.text('Bad Request: Title is required'));
    })
  );

  render(<App />);

  // Ensure initial load
  expect(await screen.findByText(/First task/i)).toBeInTheDocument();

  const input = screen.getByLabelText(/Task title/i);
  fireEvent.change(input, { target: { value: ' ' } }); // will be trimmed to empty and guarded
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));

  // Because empty input is guarded, try with a non-empty title but backend still errors
  fireEvent.change(input, { target: { value: 'New Task' } });
  fireEvent.click(screen.getByRole('button', { name: /add task/i }));

  // UI should render an error alert without crashing
  await waitFor(() => {
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
