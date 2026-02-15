'use client';

import { useState } from 'react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  status: 'pending' | 'submitted' | 'graded';
}

export default function SchoolPage() {
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Mathematics Problem Set 3',
      subject: 'Mathematics',
      deadline: '2026-02-20',
      status: 'pending'
    },
    {
      id: '2',
      title: 'History Essay: Industrial Revolution',
      subject: 'History',
      deadline: '2026-02-18',
      status: 'submitted'
    },
    {
      id: '3',
      title: 'Physics Lab Report',
      subject: 'Physics',
      deadline: '2026-02-15',
      status: 'graded'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-500/10 text-amber-200 border-amber-500/20';
      case 'submitted':
        return 'bg-blue-500/10 text-blue-200 border-blue-500/20';
      case 'graded':
        return 'bg-emerald-500/10 text-emerald-200 border-emerald-500/20';
      default:
        return 'bg-white/[0.04] text-zinc-200 border-white/10';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Afventer';
      case 'submitted': return 'Afleveret';
      case 'graded': return 'Bedømt';
      default: return status;
    }
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">School</h2>
          <p className="text-xs text-zinc-400">Learning resources and progress</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Afleveringer Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Afleveringer
            </h3>
            <span className="text-[11px] text-zinc-500">{assignments.length} total</span>
          </div>

          <div className="space-y-2">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-zinc-200">{assignment.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1">{assignment.subject}</p>
                  </div>
                  <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 whitespace-nowrap ${getStatusBadge(assignment.status)}`}>
                    {getStatusLabel(assignment.status)}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500">
                  <span>Deadline:</span>
                  <span className={new Date(assignment.deadline) < new Date() ? 'text-red-400' : 'text-zinc-400'}>
                    {new Date(assignment.deadline).toLocaleDateString('da-DK')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state for other sections */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-zinc-500 text-sm text-center">Flere sektioner kommer snart...</p>
        </div>
      </div>
    </div>
  );
}
