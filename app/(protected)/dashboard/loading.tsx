export default function DashboardLoading() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-4 w-44 bg-white/10 rounded" />
      <div className="h-12 w-[70%] bg-white/10 rounded-lg" />
      <div className="h-4 w-full max-w-2xl bg-white/5 rounded" />

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="h-11 w-full sm:w-72 bg-white/10 rounded-xl" />
        <div className="h-11 w-full sm:w-72 bg-white/5 rounded-xl" />
      </div>

      <div className="cb-panel p-6">
        <div className="h-4 w-40 bg-white/5 rounded" />
        <div className="mt-6 grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-3 w-20 bg-white/5 rounded" />
              <div className="h-7 w-24 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="cb-panel p-6">
        <div className="h-4 w-44 bg-white/5 rounded" />
        <div className="mt-3 h-8 w-[75%] bg-white/10 rounded-lg" />
        <div className="mt-3 h-4 w-full bg-white/5 rounded" />
        <div className="mt-5 h-8 w-44 bg-white/10 rounded-xl" />
      </div>

      <div className="cb-panel p-6">
        <div className="h-4 w-44 bg-white/5 rounded" />
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-white/5 border border-[var(--border)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
