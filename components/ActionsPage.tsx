export default function ActionsPage() {
  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">Actions</h2>
          <p className="text-xs text-zinc-400">Quick actions and shortcuts</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No actions configured</p>
      </div>
    </div>
  );
}
