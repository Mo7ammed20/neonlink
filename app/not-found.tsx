import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Glitch number */}
        <div className="relative">
          <h1 className="text-[10rem] font-display font-black leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #00BFFF 0%, #8A2BE2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 40px rgba(0,191,255,0.3))',
            }}
          >
            404
          </h1>
          {/* Glow effect */}
          <div className="absolute inset-0 blur-3xl opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #00BFFF 0%, transparent 70%)' }}
          />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white">Link Not Found</h2>
          <p className="text-dark-muted">
            This short link doesn&apos;t exist or has been removed.
            Double-check the URL and try again.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="btn-neon px-6 py-3 flex items-center gap-2"
          >
            ← Go Home
          </Link>
          <Link
            href="/dashboard"
            className="btn-ghost px-6 py-3"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
