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
      case 'success': return 'text-green-400 border-green-500/30';
      case 'warning': return 'text-yellow-400 border-yellow-500/30';
      default: return 'text-zinc-400 border-zinc-700/30';
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Live Activity Feed</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {activities.length === 0 ? (
          <p className="text-zinc-500 text-sm">No activity yet...</p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`border-l-2 pl-4 py-2 ${getTypeColor(activity.type)}`}
            >
              <p className="text-sm">{activity.message}</p>
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
