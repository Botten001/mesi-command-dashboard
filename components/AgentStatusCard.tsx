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
        "relative rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-4 transition-all border bg-zinc-950/40 backdrop-blur-sm text-center " +
        (active
          ? "border-emerald-500/50 shadow-[0_0_0_2px_rgba(16,185,129,0.3),0_0_20px_rgba(16,185,129,0.15)] animate-pulse-border"
          : "border-white/10")
      }
    >
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
        <div
          className={
            `w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${active ? 'bg-emerald-400' : 'bg-zinc-500'} ` +
            `shadow ${active ? 'shadow-emerald-500/30' : ''}`
          }
        />
      </div>

      <div className="space-y-1 sm:space-y-1.5">
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <h1 className="text-xs sm:text-sm font-semibold text-zinc-100">{name}</h1>
          <span className="text-[9px] sm:text-[10px] font-medium text-zinc-300 border border-white/10 bg-white/[0.03] rounded-full px-1.5 py-0.5">
            {role}
          </span>
        </div>
        <p className="text-[10px] sm:text-xs text-zinc-400 leading-snug">{task}</p>
      </div>
    </div>
  );
}
