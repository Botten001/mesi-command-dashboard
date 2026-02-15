'use client';

import { useEffect, useState } from 'react';

interface Deployment {
  id: string;
  name: string;
  url: string;
  state: 'READY' | 'ERROR' | 'BUILDING' | 'QUEUED' | 'CANCELED';
  createdAt: number;
  branch: string;
  commit: string;
  commitSha: string;
  creator: string;
}

export default function BuildQueuePage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/builds', { cache: 'no-store' });
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setDeployments(data.deployments || []);
          setError('');
        }
      } catch {
        setError('Failed to load builds');
      } finally {
        setLoading(false);
      }
    };

    load();
    const interval = setInterval(load, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const getStateStyles = (state: string) => {
    switch (state) {
      case 'READY':
        return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300';
      case 'ERROR':
        return 'border-red-500/30 bg-red-500/5 text-red-300';
      case 'BUILDING':
        return 'border-blue-500/30 bg-blue-500/5 text-blue-300';
      case 'QUEUED':
        return 'border-amber-500/30 bg-amber-500/5 text-amber-300';
      default:
        return 'border-zinc-700/30 bg-zinc-800/30 text-zinc-400';
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case 'READY': return 'Ready';
      case 'ERROR': return 'Failed';
      case 'BUILDING': return 'Building';
      case 'QUEUED': return 'Queued';
      case 'CANCELED': return 'Canceled';
      default: return state;
    }
  };

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'READY': return '✓';
      case 'ERROR': return '✗';
      case 'BUILDING': return '⚡';
      case 'QUEUED': return '⏳';
      default: return '○';
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const activeBuilds = deployments.filter(d => d.state === 'BUILDING' || d.state === 'QUEUED');
  const recentBuilds = deployments.filter(d => d.state === 'READY' || d.state === 'ERROR').slice(0, 5);

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Build queue</h2>
          <p className="text-xs text-zinc-400">Vercel deployments & build status</p>
        </div>
        <div className="flex items-center gap-3">
          {activeBuilds.length > 0 && (
            <span className="flex items-center gap-1.5 text-xs text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              {activeBuilds.length} active
            </span>
          )}
        </div>
      </div>

      {loading && deployments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500 text-sm">Loading builds...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-500 text-sm mb-2">{error}</p>
          <p className="text-zinc-600 text-xs">
            Set VERCEL_TOKEN in Vercel environment variables to see builds
          </p>
        </div>
      ) : deployments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-500 text-sm">No recent builds</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Active builds */}
          {activeBuilds.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                Active
              </h3>
              <div className="space-y-2">
                {activeBuilds.map((build) => (
                  <div
                    key={build.id}
                    className={`rounded-lg border p-4 ${getStateStyles(build.state)}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getStateIcon(build.state)}</span>
                          <span className="text-sm font-medium truncate">{build.name}</span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate">{build.commit}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500">
                          <span className="bg-zinc-800/50 px-2 py-0.5 rounded">{build.branch}</span>
                          <span>{build.commitSha}</span>
                          <span>{formatTime(build.createdAt)}</span>
                        </div>
                      </div>
                      <span className="text-xs font-medium whitespace-nowrap">
                        {getStateLabel(build.state)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent builds */}
          {recentBuilds.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                Recent
              </h3>
              <div className="space-y-2">
                {recentBuilds.map((build) => (
                  <div
                    key={build.id}
                    className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-lg ${build.state === 'READY' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {getStateIcon(build.state)}
                          </span>
                          <span className="text-sm font-medium text-zinc-200 truncate">{build.name}</span>
                        </div>
                        <p className="text-xs text-zinc-500 truncate">{build.commit}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-zinc-500">
                          <span className="bg-zinc-800/50 px-2 py-0.5 rounded">{build.branch}</span>
                          <span>{build.commitSha}</span>
                          <span>{formatTime(build.createdAt)}</span>
                        </div>
                      </div>
                      <a
                        href={`https://${build.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-[10px] text-zinc-500">
          Auto-refreshes every 10 seconds • Connect VERCEL_TOKEN for live data
        </p>
      </div>
    </div>
  );
}
