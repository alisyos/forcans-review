import { useState } from 'react'
import { useReviewStore } from '@/store/review-store'
import { AnalysisConfig, AnalysisResult } from '@/types/review'

export function useAnalysis() {
  const { reviews, addAnalysisResult } = useReviewStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (config: AnalysisConfig) => {
    setIsLoading(true)
    setError(null)

    try {
      let targetReviews = [...reviews]

      if (config.mode === 'per-product' && config.targetProductId) {
        targetReviews = reviews.filter(r => r.productId === config.targetProductId)
      }

      if (config.mode === 'sampling') {
        let sorted = [...targetReviews]
        switch (config.samplingStrategy) {
          case 'recent':
            sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            break
          case 'low-rating':
            sorted.sort((a, b) => a.rating - b.rating)
            break
          default:
            sorted = sorted.sort(() => Math.random() - 0.5)
        }
        targetReviews = sorted.slice(0, config.sampleSize)
      }

      const reviewSubset = targetReviews.map(r => ({
        content: r.content,
        rating: r.rating,
        productName: r.productName,
      }))

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: reviewSubset, config }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '분석에 실패했습니다.')
      }

      const data = await response.json()

      const result: AnalysisResult = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        config,
        summary: data.summary,
        sentimentBreakdown: data.sentimentBreakdown,
        keyIssues: data.keyIssues,
        recommendations: data.recommendations,
        reviewCount: targetReviews.length,
      }

      addAnalysisResult(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return { analyze, isLoading, error }
}
