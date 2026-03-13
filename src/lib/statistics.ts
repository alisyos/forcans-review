import { Review, RatingDistribution, DateTrend, ProductSummary, ReviewStatistics } from '@/types/review'
import { extractKeywords } from './keyword-extractor'

export function calculateRatingDistribution(reviews: Review[]): RatingDistribution[] {
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      dist[r.rating]++
    }
  })
  return [1, 2, 3, 4, 5].map(rating => ({ rating, count: dist[rating] }))
}

export function calculateDateTrends(reviews: Review[]): DateTrend[] {
  const map = new Map<string, { count: number; totalRating: number }>()

  reviews.forEach(r => {
    if (!r.createdAt) return
    const month = r.createdAt.substring(0, 7)
    const entry = map.get(month) || { count: 0, totalRating: 0 }
    entry.count++
    entry.totalRating += r.rating
    map.set(month, entry)
  })

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { count, totalRating }]) => ({
      date,
      count,
      avgRating: Math.round((totalRating / count) * 10) / 10,
    }))
}

export function calculatePhotoReviewRatio(reviews: Review[]): number {
  if (reviews.length === 0) return 0
  const photoCount = reviews.filter(r => r.hasMedia).length
  return Math.round((photoCount / reviews.length) * 1000) / 10
}

export function calculateProductSummaries(reviews: Review[]): ProductSummary[] {
  const map = new Map<string, Review[]>()

  reviews.forEach(r => {
    const key = r.productId || r.productName
    if (!key) return
    const arr = map.get(key) || []
    arr.push(r)
    map.set(key, arr)
  })

  return Array.from(map.entries()).map(([, productReviews]) => {
    const first = productReviews[0]
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0)
    const photoCount = productReviews.filter(r => r.hasMedia).length
    const bestCount = productReviews.filter(r => r.isBestReview).length
    const noReplyCount = productReviews.filter(r => !r.hasReply).length

    return {
      productId: first.productId,
      productName: first.productName,
      reviewCount: productReviews.length,
      avgRating: Math.round((totalRating / productReviews.length) * 10) / 10,
      photoReviewRatio: Math.round((photoCount / productReviews.length) * 1000) / 10,
      bestReviewCount: bestCount,
      noReplyCount,
    }
  }).sort((a, b) => b.reviewCount - a.reviewCount)
}

export function calculateAllStatistics(reviews: Review[]): ReviewStatistics {
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0)
  const allContent = reviews.map(r => r.content).filter(Boolean).join(' ')

  return {
    ratingDistribution: calculateRatingDistribution(reviews),
    dateTrends: calculateDateTrends(reviews),
    photoReviewRatio: calculatePhotoReviewRatio(reviews),
    bestReviewCount: reviews.filter(r => r.isBestReview).length,
    noReplyCount: reviews.filter(r => !r.hasReply).length,
    productSummaries: calculateProductSummaries(reviews),
    topKeywords: extractKeywords(allContent, 20),
    totalReviews: reviews.length,
    avgRating: reviews.length > 0 ? Math.round((totalRating / reviews.length) * 10) / 10 : 0,
  }
}
