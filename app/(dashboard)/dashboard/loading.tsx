export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 skeleton rounded-lg w-48" />
          <div className="h-4 skeleton rounded w-32" />
        </div>
        <div className="h-10 skeleton rounded-lg w-32" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-3">
            <div className="flex justify-between">
              <div className="h-4 skeleton rounded w-24" />
              <div className="w-10 h-10 skeleton rounded-xl" />
            </div>
            <div className="h-8 skeleton rounded-lg w-20" />
            <div className="h-3 skeleton rounded w-32" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="glass-card p-6">
        <div className="h-5 skeleton rounded w-40 mb-6" />
        <div className="h-56 skeleton rounded-xl" />
      </div>

      {/* Table skeleton */}
      <div className="glass-card p-6 space-y-4">
        <div className="h-5 skeleton rounded w-32" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 skeleton rounded-lg" />
        ))}
      </div>
    </div>
  )
}
