'use client';

import { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  createdAt?: number;
  startedAt?: number;
  doneAt?: number;
}

interface TasksResponse {
  columns: {
    todo: Task[];
    inprogress: Task[];
    done: Task[];
  };
  updatedAt?: number;
}

function fmt(ts?: number) {
  if (!ts) return null;
  const d = new Date(ts);
  return d.toLocaleString([], {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function TaskBoard() {
  const [tasks, setTasks] = useState<TasksResponse['columns']>({
    todo: [],
    inprogress: [],
    done: []
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/tasks', { cache: 'no-store' });
        const data: TasksResponse = await res.json();
        setTasks(data.columns || { todo: [], inprogress: [], done: [] });
      } catch {
        // ignore
      }
    };

    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    { id: 'todo' as const, label: 'To do', stamp: 'createdAt' as const },
    { id: 'inprogress' as const, label: 'In progress', stamp: 'startedAt' as const },
    { id: 'done' as const, label: 'Done', stamp: 'doneAt' as const },
  ];

  const badge = (id: string) => {
    if (id === 'inprogress') return 'bg-blue-500/10 text-blue-200 border-blue-500/20';
    if (id === 'done') return 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20';
    return 'bg-white/[0.04] text-zinc-200 border-white/10';
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Task board</h2>
          <p className="text-xs text-zinc-400">What we’re doing right now</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-6">
          {columns.map((col) => (
            <div key={col.id}>
              <div className="flex items-center justify-between px-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-medium border rounded-full px-2 py-0.5 ${badge(col.id)}`}>
                    {col.label}
                  </span>
                  <span className="text-[11px] text-zinc-500">{tasks[col.id].length}</span>
                </div>
              </div>

              <div className="space-y-2">
                {tasks[col.id].map((t) => (
                  <div
                    key={t.id}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="text-sm text-zinc-200">{t.title}</div>
                    <div className="mt-1 text-[11px] text-zinc-500">
                      {col.id === 'todo' && (fmt(t.createdAt) ? `Created • ${fmt(t.createdAt)}` : 'Created • —')}
                      {col.id === 'inprogress' && (fmt(t.startedAt) ? `Started • ${fmt(t.startedAt)}` : 'Started • —')}
                      {col.id === 'done' && (fmt(t.doneAt) ? `Done • ${fmt(t.doneAt)}` : 'Done • —')}
                    </div>
                  </div>
                ))}
                {tasks[col.id].length === 0 && (
                  <div className="px-2 text-xs text-zinc-500 italic">No tasks</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
