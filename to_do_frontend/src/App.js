import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { useTodos } from './hooks/useTodos';

/**
 * App Shell: provides theme toggle and layout container.
 * Renders ToDo UI powered by useTodos hook.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const {
    todos, loading, error, stats,
    addTodo, toggleCompleted, editTitle, removeTodo, refresh
  } = useTodos();

  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const editingValue = useMemo(() => {
    const t = todos.find(t => t.id === editingId);
    return t ? t.title : '';
  }, [editingId, todos]);

  const submitNew = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    await addTodo(input.trim());
    setInput('');
  };

  return (
    <div className="App">
      <main className="container" role="main" aria-label="To Do application">
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div className="header">
          <div className="logo" aria-hidden>✓</div>
          <div>
            <h1 className="title">Simple To Do</h1>
            <p className="subtitle">Add, complete, edit, and remove your tasks.</p>
          </div>
        </div>

        <form className="inputBar" onSubmit={submitNew} aria-label="Add new task">
          <label htmlFor="newTask" className="sr-only">New Task</label>
          <input
            id="newTask"
            className="input"
            type="text"
            placeholder="What do you need to get done?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Task title"
          />
          <button className="btn" type="submit" aria-label="Add task">Add</button>
        </form>

        <div className="toolbar">
          <div className="stats" aria-live="polite">
            {loading ? 'Loading tasks…' : `${stats.completed}/${stats.total} completed • ${stats.active} remaining`}
          </div>
          <div>
            <button className="btn secondary" type="button" onClick={refresh}>Refresh</button>
          </div>
        </div>

        {error && (
          <div role="alert" style={{ color: 'var(--error)', marginBottom: 8, fontSize: 13 }}>
            {error?.message || 'Something went wrong'}
          </div>
        )}

        <ul className="list" aria-label="Tasks list">
          {todos.map((t) => {
            const isEditing = editingId === t.id;
            return (
              <li key={t.id} className={`item ${t.completed ? 'completed' : ''}`}>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={!!t.completed}
                  onChange={() => toggleCompleted(t.id)}
                  aria-label={`Mark "${t.title}" as ${t.completed ? 'incomplete' : 'complete'}`}
                />
                <div className="titleWrap">
                  {isEditing ? (
                    <EditInline
                      value={editingValue}
                      onCancel={() => setEditingId(null)}
                      onSave={async (val) => {
                        await editTitle(t.id, val);
                        setEditingId(null);
                      }}
                    />
                  ) : (
                    <p className={`itemTitle ${t.completed ? 'strike' : ''}`}>{t.title}</p>
                  )}
                </div>
                <div className="actions">
                  {!isEditing && (
                    <button
                      className="btn secondary"
                      onClick={() => setEditingId(t.id)}
                      aria-label={`Edit "${t.title}"`}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn danger"
                    onClick={() => removeTodo(t.id)}
                    aria-label={`Delete "${t.title}"`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
          {!loading && todos.length === 0 && (
            <li className="item" aria-live="polite">No tasks yet — add your first task above.</li>
          )}
        </ul>

        <div className="footer">
          <span>API: {process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || 'not set'}</span>
          <span>Theme: {theme}</span>
        </div>
      </main>
    </div>
  );
}

function EditInline({ value, onSave, onCancel }) {
  const [val, setVal] = useState(value || '');

  useEffect(() => {
    setVal(value || '');
  }, [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!val.trim()) return;
        onSave(val.trim());
      }}
      style={{ width: '100%' }}
      aria-label="Edit task"
    >
      <label htmlFor="editTask" className="sr-only">Edit Task</label>
      <input
        id="editTask"
        className="editInput"
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        autoFocus
      />
      <div className="actions" style={{ marginTop: 8 }}>
        <button type="submit" className="btn">Save</button>
        <button type="button" className="btn secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default App;
