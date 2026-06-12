import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export interface LinkItem {
  id: string
  slug: string
  originalUrl: string
  title?: string | null
  clickCount: number
  uniqueCount: number
  isActive: boolean
  expiresAt?: string | null
  tags?: string[]
  category?: string | null
  createdAt: string
  shortUrl?: string
}

interface UseLinksOptions {
  page?: number
  limit?: number
  search?: string
  sort?: string
}

export function useLinks(opts: UseLinksOptions = {}) {
  const { page = 1, limit = 10, search = '', sort = 'createdAt' } = opts
  const [links, setLinks] = useState<LinkItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchLinks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sortBy: sort,
        sortOrder: 'desc',
        ...(search && { search }),
      })
      const res = await fetch(`/api/shorten?${params}`)
      if (!res.ok) throw new Error('Failed to fetch links')
      const data = await res.json()
      // API returns { success, data: [...], meta: { total, page, limit, pages } }
      setLinks(data.data || [])
      setTotal(data.meta?.total || 0)
    } catch {
      toast.error('Failed to load links')
    } finally {
      setLoading(false)
    }
  }, [page, limit, search, sort])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const deleteLink = async (id: string) => {
    try {
      const res = await fetch(`/api/shorten?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast.success('Link deleted')
      setLinks(prev => prev.filter(l => l.id !== id))
      setTotal(prev => prev - 1)
    } catch {
      toast.error('Failed to delete link')
    }
  }

  const toggleLink = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch('/api/shorten', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive }),
      })
      if (!res.ok) throw new Error('Update failed')
      setLinks(prev => prev.map(l => l.id === id ? { ...l, isActive } : l))
      toast.success(isActive ? 'Link enabled' : 'Link disabled')
    } catch {
      toast.error('Failed to update link')
    }
  }

  return { links, total, loading, refetch: fetchLinks, deleteLink, toggleLink }
}
