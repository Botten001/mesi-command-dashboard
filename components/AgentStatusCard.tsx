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
        "relative rounded-xl px-6 py-5 transition-all border bg-zinc-950/40 backdrop-blur-sm " +
        (active
          ? "border-emerald-500/35 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_0_18px_rgba(16,185,129,0.10)]"
          : "border-white/10")
      }
    >
      <div className="absolute top-4 right-4">
        <div
          className={
            `w-2.5 h-2.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-zinc-500'} ` +
            `shadow ${active ? 'shadow-emerald-500/30' : ''}`
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-zinc-100">{name}</h1>
          <span className="text-[11px] font-medium text-zinc-200 border border-white/10 bg-white/[0.03] rounded-full px-2 py-0.5">
            {role}
          </span>
        </div>
        <p className="text-sm text-zinc-300 leading-snug">{task}</p>
      </div>
    </div>
  );
}
