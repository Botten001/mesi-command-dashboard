interface AgentStatusCardProps {
  name: string;
  role: string;
  status: 'idle' | 'active';
  task: string;
}

export default function AgentStatusCard({ name, role, status, task }: AgentStatusCardProps) {
  return (
    <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-md mx-auto">
      <div className="absolute top-4 right-4">
        <div className={`w-3 h-3 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-gray-500'} animate-pulse`} />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">{name}</h1>
        <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 text-sm font-semibold">
          {role}
        </div>
        <p className="text-zinc-400 text-sm mt-4">{task}</p>
      </div>
    </div>
  );
}
