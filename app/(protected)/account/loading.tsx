export default function AccountLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-4 w-36 bg-white/10 rounded" />
      <div className="h-10 w-64 bg-white/10 rounded-lg" />
      <div className="h-4 w-full max-w-2xl bg-white/5 rounded" />
      <div className="cb-panel p-6 sm:p-7 max-w-2xl">
        <div className="flex gap-4">
          <div className="h-12 w-12 rounded-full bg-white/10" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-28 bg-white/5 rounded" />
            <div className="h-6 w-56 bg-white/10 rounded" />
            <div className="h-4 w-48 bg-white/5 rounded" />
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-32 rounded-2xl bg-white/5 border border-[var(--border)]" />
          <div className="h-32 rounded-2xl bg-white/5 border border-[var(--border)]" />
        </div>
      </div>
    </div>
  );
}
