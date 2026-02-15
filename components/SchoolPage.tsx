'use client';

import { useEffect, useState } from 'react';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  deadlineTime?: string | null;
  status: 'pending' | 'submitted' | 'graded';
  points?: number | null;
  note?: string | null;
}

export default function SchoolPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/assignments', { cache: 'no-store' });
        const data = await res.json();
        setAssignments(data.assignments || []);
      } catch {
        // ignore
      }
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

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
      case 'pending': return 'Venter';
      case 'submitted': return 'Afleveret';
      case 'graded': return 'Bedømt';
      default: return status;
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
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

          {assignments.length === 0 ? (
            <p className="text-zinc-500 text-sm">Ingen afleveringer endnu</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-zinc-500">#{assignment.id}</span>
                        <h4 className="text-sm font-medium text-zinc-200">{assignment.title}</h4>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{assignment.subject}</p>
                    </div>
                    <span className={`text-[10px] font-medium border rounded-full px-2 py-0.5 whitespace-nowrap ${getStatusBadge(assignment.status)}`}>
                      {getStatusLabel(assignment.status)}
                    </span>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2 text-[11px]">
                    <span className="text-zinc-500">Deadline:</span>
                    <span className={isOverdue(assignment.deadline) ? 'text-red-400 font-medium' : 'text-zinc-400'}>
                      {new Date(assignment.deadline).toLocaleDateString('da-DK')}
                      {assignment.deadlineTime && ` kl. ${assignment.deadlineTime}`}
                    </span>
                  </div>

                  {assignment.note && (
                    <div className="mt-2 text-[11px] text-zinc-500 bg-zinc-900/50 rounded px-2 py-1.5">
                      {assignment.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add new assignment hint */}
        <div className="border-t border-white/10 pt-4">
          <p className="text-[11px] text-zinc-500">
            Rediger <code className="bg-zinc-900 px-1 rounded">.cache/assignments.json</code> for at tilføje flere opgaver
          </p>
        </div>
      </div>
    </div>
  );
}
