'use client'

import { ParticleBackground } from '@/components/particles/ParticleBackground'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-base flex flex-col relative overflow-hidden">
      <ParticleBackground />

      {/* Top bar */}
      <header className="relative z-10 p-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
            <span className="text-white font-bold text-sm font-mono">N</span>
          </div>
          <span className="text-gradient font-display font-bold text-xl">NeonLink</span>
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom */}
      <footer className="relative z-10 p-6 text-center text-dark-muted text-sm">
        © {new Date().getFullYear()} NeonLink. All rights reserved.
      </footer>
    </div>
  )
}
