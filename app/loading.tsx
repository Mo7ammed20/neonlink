export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-neon-blue/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-neon-blue animate-spin" />
        </div>
        <p className="text-dark-muted text-sm font-mono">Loading...</p>
      </div>
    </div>
  )
}
