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
    { id: 'todo' as const, label: 'To do', stamp: 'createdAt' as const, color: 'amber' },
    { id: 'inprogress' as const, label: 'In progress', stamp: 'startedAt' as const, color: 'blue' },
    { id: 'done' as const, label: 'Done', stamp: 'doneAt' as const, color: 'emerald' },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'amber':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'blue':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'emerald':
        return 'border-emerald-500/30 bg-emerald-500/5';
      default:
        return 'border-white/10 bg-white/[0.03]';
    }
  };

  const allTasks = [
    ...tasks.todo.map(t => ({ ...t, status: 'todo' as const, color: 'amber' })),
    ...tasks.inprogress.map(t => ({ ...t, status: 'inprogress' as const, color: 'blue' })),
    ...tasks.done.map(t => ({ ...t, status: 'done' as const, color: 'emerald' })),
  ];

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex-shrink-0">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-zinc-100">Task board</h2>
          <p className="text-[10px] sm:text-xs text-zinc-400 hidden sm:block">
            {tasks.todo.length} todo · {tasks.inprogress.length} in progress · {tasks.done.length} done
          </p>
        </div>
        <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500/50"></span>
            <span className="text-zinc-400">{tasks.todo.length}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
            <span className="text-zinc-400">{tasks.inprogress.length}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500/50"></span>
            <span className="text-zinc-400">{tasks.done.length}</span>
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {allTasks.length === 0 ? (
          <p className="text-zinc-500 text-xs sm:text-sm text-center py-8">No tasks yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {allTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-lg border p-3 sm:p-4 ${getColorClasses(task.color)} hover:bg-white/[0.06] transition-all`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                    task.status === 'todo' ? 'border-amber-500/30 text-amber-300' :
                    task.status === 'inprogress' ? 'border-blue-500/30 text-blue-300' :
                    'border-emerald-500/30 text-emerald-300'
                  }`}>
                    {task.status === 'todo' ? 'To do' : task.status === 'inprogress' ? 'In progress' : 'Done'}
                  </span>
                </div>
                
                <h3 className="text-xs sm:text-sm font-medium text-zinc-200 leading-snug mb-2 line-clamp-2">
                  {task.title}
                </h3>
                
                <div className="text-[9px] sm:text-[10px] text-zinc-500">
                  {task.status === 'todo' && (fmt(task.createdAt) ? `Created ${fmt(task.createdAt)?.split(',')[0]}` : 'Created —')}
                  {task.status === 'inprogress' && (fmt(task.startedAt) ? `Started ${fmt(task.startedAt)?.split(',')[0]}` : 'Started —')}
                  {task.status === 'done' && (fmt(task.doneAt) ? `Done ${fmt(task.doneAt)?.split(',')[0]}` : 'Done —')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
