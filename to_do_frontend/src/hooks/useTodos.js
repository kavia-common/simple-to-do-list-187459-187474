import { useCallback, useEffect, useMemo, useState } from 'react';
import { listTodos, createTodo, updateTodo, deleteTodo } from '../api/todos';

// PUBLIC_INTERFACE
export function useTodos() {
  /**
   * Hook to manage todos: fetch, add, toggle complete, edit title, and delete.
   * Exposes state and handlers; uses optimistic updates with rollback on error.
   */
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTodo = useCallback(async (title) => {
    if (!title || !title.trim()) return;
    const optimistic = {
      id: `tmp-${Date.now()}`,
      title: title.trim(),
      completed: false,
      _optimistic: true,
    };
    setTodos((prev) => [optimistic, ...prev]);
    try {
      const created = await createTodo({ title: optimistic.title });
      setTodos((prev) =>
        prev.map((t) => (t.id === optimistic.id ? created : t))
      );
    } catch (e) {
      setTodos((prev) => prev.filter((t) => t.id !== optimistic.id));
      setError(e);
    }
  }, []);

  const toggleCompleted = useCallback(async (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    try {
      const target = todos.find((t) => t.id === id);
      await updateTodo(id, { completed: !target?.completed });
    } catch (e) {
      // rollback
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
      setError(e);
    }
  }, [todos]);

  const editTitle = useCallback(async (id, title) => {
    const nextTitle = String(title || '').trim();
    if (!nextTitle) return;
    const prevTodos = todos;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: nextTitle } : t))
    );
    try {
      await updateTodo(id, { title: nextTitle });
    } catch (e) {
      setTodos(prevTodos); // rollback to exact previous state
      setError(e);
    }
  }, [todos]);

  const removeTodo = useCallback(async (id) => {
    const prevTodos = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTodo(id);
    } catch (e) {
      setTodos(prevTodos); // rollback
      setError(e);
    }
  }, [todos]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    return { total, active, completed };
  }, [todos]);

  return {
    todos,
    loading,
    error,
    stats,
    refresh,
    addTodo,
    toggleCompleted,
    editTitle,
    removeTodo,
  };
}
