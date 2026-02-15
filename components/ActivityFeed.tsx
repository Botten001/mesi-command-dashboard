interface Activity {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200';
      case 'warning':
        return 'border-amber-500/30 bg-amber-500/5 text-amber-200';
      default:
        return 'border-white/10 bg-white/[0.03] text-zinc-200';
    }
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex-shrink-0">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-zinc-100">Live Activity</h2>
          <p className="text-[10px] sm:text-xs text-zinc-400 hidden sm:block">Latest updates from Mesi Agent</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="space-y-2">
          {activities.length === 0 ? (
            <p className="text-zinc-500 text-xs sm:text-sm px-2">No activity yet…</p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className={`rounded-lg border px-3 sm:px-4 py-2.5 sm:py-3 ${getTypeStyles(activity.type)}`}
              >
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <p className="text-xs sm:text-sm leading-snug">{activity.message}</p>
                  <span className="text-[10px] sm:text-[11px] text-zinc-500 whitespace-nowrap">
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
