'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'inprogress' | 'done';
}

export default function TaskBoard() {
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Build command dashboard', status: 'done' },
    { id: '2', title: 'Setup WebSocket server', status: 'done' },
    { id: '3', title: 'Deploy to Vercel', status: 'done' },
    { id: '4', title: 'Polish UI design', status: 'inprogress' },
  ]);

  const columns = [
    { id: 'todo', label: 'To Do', gradient: 'from-zinc-700 to-zinc-800' },
    { id: 'inprogress', label: 'In Progress', gradient: 'from-cyan-600 to-blue-600' },
    { id: 'done', label: 'Done', gradient: 'from-green-600 to-emerald-600' },
  ];

  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur border border-zinc-800 rounded-lg p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        Task Board
      </h2>
      <div className="space-y-4 overflow-y-auto flex-1 pr-2">
        {columns.map((column) => (
          <div key={column.id}>
            <div className={`bg-gradient-to-r ${column.gradient} text-white text-sm font-semibold mb-2 px-3 py-1 rounded`}>
              {column.label}
            </div>
            <div className="space-y-2">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="bg-zinc-800/50 border border-zinc-700/50 rounded p-3 text-sm hover:bg-zinc-800/80 transition-all"
                  >
                    {task.title}
                  </div>
                ))}
              {tasks.filter((task) => task.status === column.id).length === 0 && (
                <p className="text-zinc-600 text-xs italic pl-3">No tasks</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
