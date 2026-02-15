'use client';

interface TabNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'revenue', label: 'Revenue' },
  { id: 'leads', label: 'Leads' },
  { id: 'actions', label: 'Actions' },
  { id: 'build', label: 'Build' },
  { id: 'school', label: 'School' },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <div className="flex items-center gap-1 px-1 py-1 bg-zinc-900/60 border border-white/10 rounded-lg w-fit mx-auto max-w-full overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={
            "px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap flex-shrink-0 " +
            (activeTab === tab.id
              ? "bg-zinc-800 text-white border border-white/10"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50")
          }
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
