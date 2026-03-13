import { useMemo } from 'react'
import { useReviewStore } from '@/store/review-store'
import { calculateAllStatistics } from '@/lib/statistics'

export function useStatistics(productId?: string) {
  const reviews = useReviewStore((s) => s.reviews)
  const globalStatistics = useReviewStore((s) => s.statistics)

  const statistics = useMemo(() => {
    if (!productId || productId === 'all') return globalStatistics
    const filtered = reviews.filter(r => r.productId === productId)
    if (filtered.length === 0) return null
    return calculateAllStatistics(filtered)
  }, [reviews, globalStatistics, productId])

  return statistics
}
