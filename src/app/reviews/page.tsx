'use client'

import { useMemo } from 'react'
import { ReviewFilters } from '@/components/reviews/review-filters'
import { ReviewTable } from '@/components/reviews/review-table'
import { useReviewStore } from '@/store/review-store'

export default function ReviewsPage() {
  const { reviews, getFilteredReviews } = useReviewStore()
  const filteredReviews = useMemo(() => getFilteredReviews(), [getFilteredReviews])

  if (reviews.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">리뷰 목록</h1>
        <div className="flex items-center justify-center h-64 text-gray-500">
          데이터가 없습니다. 먼저 파일을 업로드해주세요.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">리뷰 목록</h1>
      <div className="space-y-4">
        <ReviewFilters />
        <ReviewTable reviews={filteredReviews} />
      </div>
    </div>
  )
}
