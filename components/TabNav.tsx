'use client';

import { useState } from 'react';

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'content', label: 'Content', icon: '🎬' },
  { id: 'revenue', label: 'Revenue', icon: '💰' },
  { id: 'leads', label: 'Leads', icon: '🎯' },
  { id: 'actions', label: 'Actions', icon: '⚡' },
  { id: 'build', label: 'Build', icon: '🚀' },
  { id: 'school', label: 'School', icon: '📚' },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeTabData = tabs.find(t => t.id === activeTab);

  return (
    <div className="w-full">
      {/* Desktop: Horizontal tabs */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="flex items-center gap-1 px-1 py-1 bg-zinc-900/60 border border-white/10 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={
                "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap " +
                (activeTab === tab.id
                  ? "bg-zinc-800 text-white border border-white/10"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50")
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: Dropdown */}
      <div className="sm:hidden relative">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900/60 border border-white/10 rounded-lg text-sm font-medium text-zinc-100"
        >
          <span className="flex items-center gap-2">
            <span>{activeTabData?.icon}</span>
            <span>{activeTabData?.label}</span>
          </span>
          <svg 
            className={`w-4 h-4 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden z-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={
                  "w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors " +
                  (activeTab === tab.id
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200")
                }
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="ml-auto text-emerald-400">✓</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
