'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, Link2, Megaphone,
<<<<<<< HEAD
  Settings, BarChart2, ChevronLeft, ShieldAlert, BookOpen,
} from 'lucide-react'

const navItems = [
  { href: '/admin',           label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/admin/users',     label: 'Users',        icon: Users },
  { href: '/admin/links',     label: 'All Links',    icon: Link2 },
  { href: '/admin/ads',       label: 'Ads Manager',  icon: Megaphone },
  { href: '/admin/article',   label: 'Article',      icon: BookOpen },   // ← new
  { href: '/admin/reports',   label: 'Reports',      icon: BarChart2 },
  { href: '/admin/settings',  label: 'Settings',     icon: Settings },
=======
  Settings, BarChart2, ChevronLeft, ShieldAlert,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/links', label: 'All Links', icon: Link2 },
  { href: '/admin/ads', label: 'Ads Manager', icon: Megaphone },
  { href: '/admin/reports', label: 'Reports', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
]

export function AdminSidebar() {
  const pathname = usePathname()
<<<<<<< HEAD
  return (
    <aside className="w-64 min-h-screen bg-dark-card border-r border-white/5 flex flex-col">
=======

  return (
    <aside className="w-64 min-h-screen bg-dark-card border-r border-white/5 flex flex-col">
      {/* Logo */}
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-neon-purple flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-white font-display font-bold text-sm">Admin Panel</div>
            <div className="text-dark-muted text-xs">NeonLink</div>
          </div>
        </Link>
      </div>

<<<<<<< HEAD
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}>
              <motion.div whileHover={{ x: 2 }}
                className={`sidebar-item ${isActive ? 'active' : ''}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div layoutId="admin-active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400" />
=======
      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="admin-active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-red-400"
                  />
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

<<<<<<< HEAD
=======
      {/* Back to user dashboard */}
>>>>>>> 12c6bf03fe9795bf758f24028704f070af22a889
      <div className="p-4 border-t border-white/5">
        <Link href="/dashboard" className="sidebar-item text-dark-muted hover:text-white">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back to Dashboard</span>
        </Link>
      </div>
    </aside>
  )
}
