interface AgentStatusCardProps {
  name: string;
  role: string;
  status: 'idle' | 'active';
  task: string;
  compact?: boolean;
}

export default function AgentStatusCard({ name, role, status, task, compact }: AgentStatusCardProps) {
  const active = status === 'active';

  if (compact) {
    return (
      <div
        className={
          "relative rounded-lg px-3 sm:px-4 py-2 sm:py-3 transition-all border bg-zinc-950/40 backdrop-blur-sm max-w-[200px] sm:max-w-xs " +
          (active
            ? "border-emerald-500/35 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
            : "border-white/10")
        }
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={
              `w-2 h-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-zinc-500'} ` +
              `shadow ${active ? 'shadow-emerald-500/30' : ''}`
            }
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-sm font-semibold text-zinc-100 truncate">{name}</h1>
              <span className="text-[9px] sm:text-[10px] font-medium text-zinc-300 border border-white/10 bg-white/[0.03] rounded-full px-1.5 py-0.5 flex-shrink-0">
                {role}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 truncate">{task}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        "relative rounded-xl px-4 sm:px-6 py-4 sm:py-5 transition-all border bg-zinc-950/40 backdrop-blur-sm " +
        (active
          ? "border-emerald-500/35 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_0_18px_rgba(16,185,129,0.10)]"
          : "border-white/10")
      }
    >
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
        <div
          className={
            `w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-zinc-500'} ` +
            `shadow ${active ? 'shadow-emerald-500/30' : ''}`
          }
        />
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-sm sm:text-base font-semibold text-zinc-100">{name}</h1>
          <span className="text-[10px] sm:text-[11px] font-medium text-zinc-200 border border-white/10 bg-white/[0.03] rounded-full px-1.5 sm:px-2 py-0.5">
            {role}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-300 leading-snug">{task}</p>
      </div>
    </div>
  );
}
