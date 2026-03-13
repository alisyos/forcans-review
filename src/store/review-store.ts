import { create } from 'zustand'
import { Review, ReviewFilters, ReviewStatistics, AnalysisResult, UploadState } from '@/types/review'
import { calculateAllStatistics } from '@/lib/statistics'

interface ReviewStore {
  reviews: Review[]
  uploadState: UploadState
  uploadError: string | null
  filters: ReviewFilters
  statistics: ReviewStatistics | null
  analysisResults: AnalysisResult[]

  setReviews: (reviews: Review[]) => void
  clearReviews: () => void
  setUploadState: (state: UploadState) => void
  setUploadError: (error: string | null) => void
  setFilters: (filters: Partial<ReviewFilters>) => void
  resetFilters: () => void
  addAnalysisResult: (result: AnalysisResult) => void
  getFilteredReviews: () => Review[]
  getProductList: () => { id: string; name: string }[]
}

const defaultFilters: ReviewFilters = {
  productId: '',
  rating: null,
  dateFrom: '',
  dateTo: '',
  hasReply: 'all',
  hasMedia: 'all',
  searchQuery: '',
}

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: [],
  uploadState: 'idle',
  uploadError: null,
  filters: { ...defaultFilters },
  statistics: null,
  analysisResults: [],

  setReviews: (reviews) => {
    const statistics = calculateAllStatistics(reviews)
    set({ reviews, statistics, uploadState: 'parsed', uploadError: null })
  },

  clearReviews: () => {
    set({
      reviews: [],
      statistics: null,
      uploadState: 'idle',
      uploadError: null,
      filters: { ...defaultFilters },
      analysisResults: [],
    })
  },

  setUploadState: (uploadState) => set({ uploadState }),
  setUploadError: (uploadError) => set({ uploadError }),

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }))
  },

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  addAnalysisResult: (result) => {
    set((state) => ({
      analysisResults: [result, ...state.analysisResults],
    }))
  },

  getFilteredReviews: () => {
    const { reviews, filters } = get()
    return reviews.filter((review) => {
      if (filters.productId && review.productId !== filters.productId) return false
      if (filters.rating !== null && review.rating !== filters.rating) return false
      if (filters.dateFrom && review.createdAt < filters.dateFrom) return false
      if (filters.dateTo && review.createdAt > filters.dateTo) return false
      if (filters.hasReply === 'yes' && !review.hasReply) return false
      if (filters.hasReply === 'no' && review.hasReply) return false
      if (filters.hasMedia === 'yes' && !review.hasMedia) return false
      if (filters.hasMedia === 'no' && review.hasMedia) return false
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase()
        if (!review.content.toLowerCase().includes(q) && !review.author.toLowerCase().includes(q)) {
          return false
        }
      }
      return true
    })
  },

  getProductList: () => {
    const { reviews } = get()
    const map = new Map<string, string>()
    reviews.forEach((r) => {
      if (r.productId && !map.has(r.productId)) {
        map.set(r.productId, r.productName)
      }
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  },
}))
