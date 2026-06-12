'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-base flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto">
          <span className="text-4xl">⚠️</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold text-white">Something went wrong</h2>
          <p className="text-dark-muted text-sm">
            An unexpected error occurred. The issue has been logged.
          </p>
          {error.digest && (
            <p className="text-xs font-mono text-dark-muted bg-white/5 px-3 py-1 rounded-lg inline-block">
              Error ID: {error.digest}
            </p>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-neon px-6 py-3">
            Try Again
          </button>
          <Link href="/" className="btn-ghost px-6 py-3">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
