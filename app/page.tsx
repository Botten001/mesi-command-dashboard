'use client';

import { useEffect, useState, useRef } from 'react';
import AgentStatusCard from '@/components/AgentStatusCard';
import ActivityFeed from '@/components/ActivityFeed';
import TaskBoard from '@/components/TaskBoard';

interface AgentStatus {
  status: 'idle' | 'active';
  task: string;
  timestamp: number;
}

interface Activity {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

export default function Dashboard() {
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    status: 'idle',
    task: 'Connecting...',
    timestamp: Date.now()
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const lastTaskRef = useRef<string>('__INITIAL__');
  const initialLoadRef = useRef(true);

  useEffect(() => {
    // Load persisted activity history
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/activity');
        const data = await res.json();
        const items = (data.activities || []).map((a: any) => ({
          id: a.id,
          timestamp: a.timestamp,
          message: a.message,
          type: a.level || 'info'
        }));
        // newest first
        setActivities(items.reverse());
      } catch {
        // ignore
      }
    };

    loadHistory();

    const pollStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();

        setAgentStatus(data);

        if (initialLoadRef.current) {
          initialLoadRef.current = false;
          lastTaskRef.current = data.task;
          return;
        }

        if (lastTaskRef.current !== data.task) {
          lastTaskRef.current = data.task;
          setActivities(prev => [{
            id: Date.now().toString(),
            timestamp: Date.now(),
            message: data.task,
            type: data.status === 'active' ? 'success' : 'info'
          }, ...prev.slice(0, 49)]);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black text-white p-6">
      <div className="h-full w-full flex flex-col gap-6">
        <div className="flex-shrink-0 flex justify-center">
          <div className="w-full max-w-md">
            <AgentStatusCard
              name="Mesi Agent"
              role="SQUAD LEAD"
              status={agentStatus.status}
              task={agentStatus.task}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 w-full">
          <div className="lg:col-span-2 h-full">
            <ActivityFeed activities={activities} />
          </div>
          <div className="lg:col-span-1 h-full">
            <TaskBoard />
          </div>
        </div>
      </div>
    </main>
  );
}
