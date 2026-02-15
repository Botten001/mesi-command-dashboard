'use client';

import { useEffect, useState } from 'react';
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
    task: 'Waiting for task',
    timestamp: Date.now()
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

    ws.onopen = () => {
      console.log('WebSocket connected');
      setActivities(prev => [{
        id: Date.now().toString(),
        timestamp: Date.now(),
        message: 'Dashboard connected to Mesi Agent',
        type: 'success'
      }, ...prev]);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'status') {
        setAgentStatus({
          status: data.status,
          task: data.task,
          timestamp: data.timestamp
        });
      } else if (data.type === 'activity') {
        setActivities(prev => [{
          id: data.id || Date.now().toString(),
          timestamp: data.timestamp,
          message: data.message,
          type: data.level || 'info'
        }, ...prev.slice(0, 49)]);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting in 3s...');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    };

    return () => {
      ws.close();
    };
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
