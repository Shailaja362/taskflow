import { useEffect, useState } from 'react';
import * as api from './api/client';
import type { Task } from './api/client';
import Board from './components/Board';
import Login from './components/Login';

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');

  async function refresh() {
    try {
      setTasks(await api.getTasks());
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    if (token) refresh();
  }, [token]);

  function handleAuthed(t: string) {
    localStorage.setItem('token', t);
    setToken(t);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setTasks([]);
  }

  if (!token) return <Login onAuthed={handleAuthed} />;

  return (
    <div className="app">
      <header>
        <h1>TaskFlow</h1>
        <button onClick={logout}>Log out</button>
      </header>
      {error && <p className="error">{error}</p>}
      <Board tasks={tasks} onChange={refresh} />
    </div>
  );
}
