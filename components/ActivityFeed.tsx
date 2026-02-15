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
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400 border-green-500/50 bg-green-500/5';
      case 'warning': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/5';
      default: return 'text-zinc-400 border-zinc-700/50 bg-zinc-800/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur border border-zinc-800 rounded-lg p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        Live Activity Feed
      </h2>
      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {activities.length === 0 ? (
          <p className="text-zinc-500 text-sm">No activity yet...</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`border-l-2 pl-4 py-3 rounded-r ${getTypeColor(activity.type)} transition-all`}
            >
              <p className="text-sm font-medium">{activity.message}</p>
              <span className="text-xs text-zinc-600">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
