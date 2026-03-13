export interface Review {
  id: string
  productId: string
  productName: string
  rating: number
  hasMedia: boolean
  content: string
  author: string
  createdAt: string
  hasReply: boolean
  isBestReview: boolean
  reviewType: string
  helpfulCount: number
  displayStatus: string
}

export interface RatingDistribution {
  rating: number
  count: number
}

export interface DateTrend {
  date: string
  count: number
  avgRating: number
}

export interface ProductSummary {
  productId: string
  productName: string
  reviewCount: number
  avgRating: number
  photoReviewRatio: number
  bestReviewCount: number
  noReplyCount: number
}

export interface KeywordItem {
  keyword: string
  count: number
}

export interface ReviewStatistics {
  ratingDistribution: RatingDistribution[]
  dateTrends: DateTrend[]
  photoReviewRatio: number
  bestReviewCount: number
  noReplyCount: number
  productSummaries: ProductSummary[]
  topKeywords: KeywordItem[]
  totalReviews: number
  avgRating: number
}

export interface AnalysisConfig {
  mode: 'sampling' | 'batch' | 'per-product'
  samplingStrategy: 'random' | 'recent' | 'low-rating'
  sampleSize: number
  targetProductId?: string
}

export interface SentimentBreakdown {
  positive: number
  neutral: number
  negative: number
}

export interface KeyIssue {
  issue: string
  frequency: string
  severity: string
}

export interface AnalysisResult {
  id: string
  timestamp: string
  config: AnalysisConfig
  summary: string
  sentimentBreakdown: SentimentBreakdown
  keyIssues: KeyIssue[]
  recommendations: string[]
  reviewCount: number
}

export type UploadState = 'idle' | 'parsing' | 'parsed' | 'error'

export interface ReviewFilters {
  productId: string
  rating: number | null
  dateFrom: string
  dateTo: string
  hasReply: 'all' | 'yes' | 'no'
  hasMedia: 'all' | 'yes' | 'no'
  searchQuery: string
}
