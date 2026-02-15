export default function SchoolPage() {
  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">School</h2>
          <p className="text-xs text-zinc-400">Learning resources and progress</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">No school data yet</p>
      </div>
    </div>
  );
}
