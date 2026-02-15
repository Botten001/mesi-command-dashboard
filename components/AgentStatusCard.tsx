interface AgentStatusCardProps {
  name: string;
  role: string;
  status: 'idle' | 'active';
  task: string;
}

export default function AgentStatusCard({ name, role, status, task }: AgentStatusCardProps) {
  const active = status === 'active';

  return (
    <div
      className={
        "relative rounded-lg p-6 transition-all " +
        (active
          ? "bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-green-500/70 shadow-[0_0_0_1px_rgba(34,197,94,0.6),0_0_24px_rgba(34,197,94,0.20)]"
          : "bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 border border-zinc-700")
      }
    >
      <div className="absolute top-4 right-4">
        <div
          className={
            `w-3 h-3 rounded-full ${active ? 'bg-green-500' : 'bg-gray-500'} ` +
            `animate-pulse shadow-lg ${active ? 'shadow-green-500/50' : ''}`
          }
        />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">{name}</h1>
        <div className="inline-block px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded text-cyan-400 text-sm font-semibold">
          {role}
        </div>
        <p className="text-zinc-400 text-sm mt-4">{task}</p>
      </div>
    </div>
  );
}
