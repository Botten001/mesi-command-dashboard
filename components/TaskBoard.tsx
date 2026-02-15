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

type FilterType = 'all' | 'todo' | 'inprogress' | 'done';

export default function TaskBoard() {
  const [tasks, setTasks] = useState<TasksResponse['columns']>({
    todo: [],
    inprogress: [],
    done: []
  });
  const [filter, setFilter] = useState<FilterType>('all');

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

  const getColorClasses = (status: string) => {
    switch (status) {
      case 'todo':
        return 'border-amber-500/30 bg-amber-500/5';
      case 'inprogress':
        return 'border-blue-500/30 bg-blue-500/5';
      case 'done':
        return 'border-emerald-500/30 bg-emerald-500/5';
      default:
        return 'border-white/10 bg-white/[0.03]';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return 'border-amber-500/30 text-amber-300';
      case 'inprogress':
        return 'border-blue-500/30 text-blue-300';
      case 'done':
        return 'border-emerald-500/30 text-emerald-300';
      default:
        return 'border-white/10 text-zinc-300';
    }
  };

  const getFilteredTasks = () => {
    if (filter === 'all') {
      return [
        ...tasks.todo.map(t => ({ ...t, status: 'todo' as const })),
        ...tasks.inprogress.map(t => ({ ...t, status: 'inprogress' as const })),
        ...tasks.done.map(t => ({ ...t, status: 'done' as const })),
      ];
    }
    return tasks[filter].map(t => ({ ...t, status: filter }));
  };

  const filteredTasks = getFilteredTasks();

  const filters: { id: FilterType; label: string; count: number; color: string }[] = [
    { id: 'all', label: 'All', count: tasks.todo.length + tasks.inprogress.length + tasks.done.length, color: 'bg-zinc-500' },
    { id: 'todo', label: 'To do', count: tasks.todo.length, color: 'bg-amber-500' },
    { id: 'inprogress', label: 'In progress', count: tasks.inprogress.length, color: 'bg-blue-500' },
    { id: 'done', label: 'Done', count: tasks.done.length, color: 'bg-emerald-500' },
  ];

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex-shrink-0">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-zinc-100">Task board</h2>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 px-3 sm:px-4 py-2 border-b border-white/10 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={
              "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap " +
              (filter === f.id
                ? "bg-zinc-800 text-white border border-white/10"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50")
            }
          >
            <span className={`w-1.5 h-1.5 rounded-full ${f.color}`}></span>
            <span>{f.label}</span>
            <span className="text-zinc-500">({f.count})</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {filteredTasks.length === 0 ? (
          <p className="text-zinc-500 text-xs sm:text-sm text-center py-8">No tasks</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`rounded-lg border p-3 sm:p-4 ${getColorClasses(task.status)} hover:bg-white/[0.06] transition-all`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${getStatusBadge(task.status)}`}>
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
