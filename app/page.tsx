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
import LoginPage from '@/components/LoginPage';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agentStatus, setAgentStatus] = useState<AgentStatus>({
    status: 'idle',
    task: 'Connecting…',
    timestamp: Date.now()
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const lastTaskRef = useRef<string>('__INITIAL__');
  const initialLoadRef = useRef(true);

  // Check auth on load
  useEffect(() => {
    const token = localStorage.getItem('mesi_auth_token');
    if (token) {
      // Verify token with server
      fetch('/api/auth', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        setIsAuthenticated(res.ok);
        if (!res.ok) {
          localStorage.removeItem('mesi_auth_token');
        }
      }).catch(() => {
        setIsAuthenticated(false);
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

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
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mesi_auth_token');
    setIsAuthenticated(false);
  };

  // Show loading while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(16,185,129,0.08),transparent_55%),linear-gradient(to_bottom_right,#050608,#070A0F,#050608)]">
        <div className="text-zinc-500 text-sm">Loading...</div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderDashboardContent = () => (
    <>
      <div className="flex-1 min-h-0 flex flex-col gap-4 sm:gap-5">
        {/* Centered Agent Card */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="w-full max-w-[240px] sm:max-w-xs">
            <AgentStatusCard
              name="Mesi Agent"
              role="SQUAD LEAD"
              status={agentStatus.status}
              task={agentStatus.task}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 flex-1 min-h-0 w-full">
          <div className="lg:col-span-2 min-h-0 order-2 lg:order-1">
            <ActivityFeed activities={activities} />
          </div>
          <div className="lg:col-span-1 min-h-0 order-1 lg:order-2">
            <TaskBoard />
          </div>
        </div>
      </div>
    </>
  );

  const renderTabContent = () => {
    const compactCard = (
      <div className="flex-shrink-0 mb-3 sm:mb-4 flex justify-start sm:justify-end">
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
          <div className="h-full flex flex-col min-h-0">
            {compactCard}
            <RevenuePage />
          </div>
        );
      case 'leads':
        return (
          <div className="h-full flex flex-col min-h-0">
            {compactCard}
            <LeadsPage />
          </div>
        );
      case 'actions':
        return (
          <div className="h-full flex flex-col min-h-0">
            {compactCard}
            <ActionsPage />
          </div>
        );
      case 'build':
        return (
          <div className="h-full flex flex-col min-h-0">
            {compactCard}
            <BuildQueuePage />
          </div>
        );
      case 'school':
        return (
          <div className="h-full flex flex-col min-h-0">
            {compactCard}
            <SchoolPage />
          </div>
        );
      default:
        return renderDashboardContent();
    }
  };

  return (
    <main className="h-screen overflow-hidden bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(16,185,129,0.08),transparent_55%),linear-gradient(to_bottom_right,#050608,#070A0F,#050608)] text-white p-3 sm:p-6">
      <div className="h-full w-full flex flex-col gap-4 sm:gap-5 min-h-0">
        <div className="relative flex items-center justify-center">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          <button
            onClick={handleLogout}
            className="absolute right-0 text-[10px] sm:text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 sm:px-3 py-1.5 rounded-md hover:bg-zinc-800/50"
          >
            Log out
          </button>
        </div>
        
        {activeTab === 'dashboard' ? (
          <div className="h-full w-full flex flex-col min-h-0 overflow-y-auto lg:overflow-visible">
            {renderDashboardContent()}
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto">
            {renderTabContent()}
          </div>
        )}
      </div>
    </main>
  );
}
