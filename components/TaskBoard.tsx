'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
}

export default function TaskBoard() {
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Build command dashboard', status: 'inprogress' },
    { id: '2', title: 'Setup WebSocket server', status: 'inprogress' },
    { id: '3', title: 'Deploy to Vercel', status: 'todo' },
  ]);

  const columns = [
    { id: 'todo', label: 'To Do', color: 'zinc' },
    { id: 'inprogress', label: 'In Progress', color: 'cyan' },
    { id: 'done', label: 'Done', color: 'green' },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Task Board</h2>
      <div className="space-y-4">
        {columns.map((column) => (
          <div key={column.id}>
            <h3 className={`text-sm font-semibold mb-2 text-${column.color}-400`}>
              {column.label}
            </h3>
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-zinc-800 border border-zinc-700 rounded p-3 text-sm"
                  >
                    {task.title}
                  </div>
                ))}
              {tasks.filter((task) => task.status === column.id).length === 0 && (
                <p className="text-zinc-600 text-xs italic">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
