'use client';

import { useEffect, useState, useRef } from 'react';
import AgentStatusCard from '@/components/AgentStatusCard';
import ActivityFeed from '@/components/ActivityFeed';
import TaskBoard from '@/components/TaskBoard';
import TabNav from '@/components/TabNav';
import RevenuePage from '@/components/RevenuePage';
import LeadsPage from '@/components/LeadsPage';
import ActionsPage from '@/components/ActionsPage';
import BuildQueuePage from '@/components/BuildQueuePage';
import SchoolPage from '@/components/SchoolPage';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    status: 'idle',
    task: 'Connecting…',
    timestamp: Date.now()
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const lastTaskRef = useRef<string>('__INITIAL__');
  const initialLoadRef = useRef(true);

  useEffect(() => {
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
        setActivities(items.reverse());
      } catch {}
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
      } catch {
        // ignore
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const renderDashboardContent = () => (
    <>
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
    </>
  );

  const renderTabContent = () => {
    const compactCard = (
      <div className="flex-shrink-0 mb-4">
        <AgentStatusCard
          name="Mesi Agent"
          role="SQUAD LEAD"
          status={agentStatus.status}
          task={agentStatus.task}
          compact
        />
      </div>
    );

    switch (activeTab) {
      case 'revenue':
        return (
          <div className="h-full flex flex-col">
            {compactCard}
            <RevenuePage />
          </div>
        );
      case 'leads':
        return (
          <div className="h-full flex flex-col">
            {compactCard}
            <LeadsPage />
          </div>
        );
      case 'actions':
        return (
          <div className="h-full flex flex-col">
            {compactCard}
            <ActionsPage />
          </div>
        );
      case 'build':
        return (
          <div className="h-full flex flex-col">
            {compactCard}
            <BuildQueuePage />
          </div>
        );
      case 'school':
        return (
          <div className="h-full flex flex-col">
            {compactCard}
            <SchoolPage />
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(16,185,129,0.08),transparent_55%),linear-gradient(to_bottom_right,#050608,#070A0F,#050608)] text-white p-6">
      <div className="h-full w-full flex flex-col gap-6">
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'dashboard' ? (
          <div className="h-full w-full flex flex-col gap-6">
            {renderDashboardContent()}
          </div>
        ) : (
          <div className="flex-1 min-h-0">
            {renderTabContent()}
          </div>
        )}
      </div>
    </main>
  );
}
