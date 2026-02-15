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
    
    setActivities([{
      id: 'init',
      timestamp: Date.now(),
      message: 'Dashboard connected',
      type: 'success'
    }]);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto h-screen flex flex-col gap-6">
        <AgentStatusCard
          name="Mesi Agent"
          role="SQUAD LEAD"
          status={agentStatus.status}
          task={agentStatus.task}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-hidden">
          <div className="h-full">
            <ActivityFeed activities={activities} />
          </div>
          <div className="h-full">
            <TaskBoard />
          </div>
        </div>
      </div>
    </main>
  );
}
