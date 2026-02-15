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
        
        // Skip logging on initial load
        if (initialLoadRef.current) {
          initialLoadRef.current = false;
          lastTaskRef.current = data.task;
          return;
        }
        
        // Only log when task actually changes
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
    
    // Only log initial connect once
    setActivities([{
      id: 'init',
      timestamp: Date.now(),
      message: 'Dashboard connected',
      type: 'success'
    }]);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <AgentStatusCard
          name="Mesi Agent"
          role="SQUAD LEAD"
          status={agentStatus.status}
          task={agentStatus.task}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <ActivityFeed activities={activities} />
          </div>
          <div className="lg:col-span-1">
            <TaskBoard />
          </div>
        </div>
      </div>
    </main>
  );
}
