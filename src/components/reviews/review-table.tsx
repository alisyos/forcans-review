'use client'

import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Review } from '@/types/review'
import { ReviewDetailDialog } from './review-detail-dialog'
import { Camera, MessageCircle, Award, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  reviews: Review[]
}

const PAGE_SIZE = 50

export function ReviewTable({ reviews }: Props) {
  const [page, setPage] = useState(0)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE)
  const pagedReviews = useMemo(
    () => reviews.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [reviews, page]
  )

  const handleRowClick = (review: Review) => {
    setSelectedReview(review)
    setDialogOpen(true)
  }

  return (
    <div>
      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>상품명</TableHead>
              <TableHead className="w-20">구분</TableHead>
              <TableHead className="w-24">평점</TableHead>
              <TableHead>리뷰 내용</TableHead>
              <TableHead className="w-20">작성자</TableHead>
              <TableHead className="w-28">작성일</TableHead>
              <TableHead className="w-20 text-center">상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedReviews.map((review) => (
              <TableRow
                key={review.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(review)}
              >
                <TableCell className="text-gray-500 text-xs">{review.id}</TableCell>
                <TableCell className="max-w-[180px] truncate text-sm">{review.productName}</TableCell>
                <TableCell className="text-xs text-gray-500">{review.reviewType || '-'}</TableCell>
                <TableCell>
                  <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-sm">{review.content}</TableCell>
                <TableCell className="text-sm">{review.author}</TableCell>
                <TableCell className="text-sm text-gray-500">{review.createdAt}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    {review.hasMedia && <Camera className="w-3.5 h-3.5 text-green-500" />}
                    {review.hasReply && <MessageCircle className="w-3.5 h-3.5 text-blue-500" />}
                    {review.isBestReview && <Award className="w-3.5 h-3.5 text-yellow-500" />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            총 {reviews.length.toLocaleString()}건 중 {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, reviews.length)}건
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <ReviewDetailDialog
        review={selectedReview}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
