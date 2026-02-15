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
    task: 'Connecting...',
    timestamp: Date.now()
  });
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Poll status every 2 seconds
    const pollStatus = async () => {
      try {
        const response = await fetch('/api/status');
        const data = await response.json();
        
        const prevTask = agentStatus.task;
        setAgentStatus(data);
        
        // Add activity log when task changes
        if (prevTask !== data.task && data.task !== 'Connecting...') {
          setActivities(prev => [{
            id: Date.now().toString(),
            timestamp: Date.now(),
            message: `Status: ${data.task}`,
            type: data.status === 'active' ? 'success' : 'info'
          }, ...prev.slice(0, 49)]);
        }
      } catch (error) {
        console.error('Failed to fetch status:', error);
        setAgentStatus({
          status: 'idle',
          task: 'Connection error',
          timestamp: Date.now()
        });
      }
    };

    pollStatus(); // Initial fetch
    const interval = setInterval(pollStatus, 2000);
    
    setActivities([{
      id: Date.now().toString(),
      timestamp: Date.now(),
      message: 'Dashboard loaded',
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
