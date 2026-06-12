import { useState, useEffect, useCallback } from 'react'

export interface AnalyticsSummary {
  totalClicks: number
  uniqueVisitors: number
  countries: { name: string; clicks: number }[]
  browsers: { name: string; clicks: number }[]
  devices: { name: string; clicks: number }[]
  sources: { name: string; clicks: number }[]
}

export interface ChartDataPoint {
  date: string
  clicks: number
  unique: number
}

export function useAnalytics(period: number = 30, linkId?: string) {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ period: String(period) })
      if (linkId) params.set('linkId', linkId)

      const [summaryRes, chartRes] = await Promise.all([
        fetch(`/api/analytics/summary?${params}`),
        fetch(`/api/analytics/chart?${params}`),
      ])

      if (!summaryRes.ok || !chartRes.ok) throw new Error('Failed to fetch analytics')

      const [summaryData, chartDataRes] = await Promise.all([
        summaryRes.json(),
        chartRes.json(),
      ])

      setSummary(summaryData)
      setChartData(chartDataRes.chartData || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Analytics failed to load')
    } finally {
      setLoading(false)
    }
  }, [period, linkId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { summary, chartData, loading, error, refetch: fetchData }
}
