import { useState } from 'react';
import * as api from '../api/client';
import type { Task } from '../api/client';

const COLUMNS: { key: Task['status']; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

export default function Board({ tasks, onChange }: { tasks: Task[]; onChange: () => void }) {
  const [title, setTitle] = useState('');

  async function add() {
    if (!title.trim()) return;
    await api.createTask(title.trim(), '');
    setTitle('');
    onChange();
  }

  async function move(task: Task, status: Task['status']) {
    await api.updateTask(task.id, { status });
    onChange();
  }

  async function remove(task: Task) {
    await api.deleteTask(task.id);
    onChange();
  }

  return (
    <div>
      <div className="add-row">
        <input
          placeholder="New task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
        />
        <button onClick={add}>Add</button>
      </div>
      <div className="board">
        {COLUMNS.map((col) => (
          <div className="column" key={col.key}>
            <h3>{col.label}</h3>
            {tasks
              .filter((t) => t.status === col.key)
              .map((t) => (
                <div className="card" key={t.id}>
                  <span>{t.title}</span>
                  <div className="card-actions">
                    {COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                      <button key={c.key} onClick={() => move(t, c.key)} title={`Move to ${c.label}`}>
                        {c.label}
                      </button>
                    ))}
                    <button onClick={() => remove(t)} className="del">✕</button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
