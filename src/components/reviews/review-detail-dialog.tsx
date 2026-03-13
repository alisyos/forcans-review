'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Review } from '@/types/review'
import { Star, Camera, MessageCircle, Award } from 'lucide-react'

interface Props {
  review: Review | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReviewDetailDialog({ review, open, onOpenChange }: Props) {
  if (!review) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>리뷰 상세</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-lg">{review.productName}</p>
              <p className="text-sm text-gray-500">상품 ID: {review.productId}</p>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 text-sm">
            <span className="text-gray-500">작성자: {review.author}</span>
            <span className="text-gray-500">작성일: {review.createdAt}</span>
          </div>

          <div className="flex gap-2">
            {review.hasMedia && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                <Camera className="w-3 h-3" /> 포토/영상
              </span>
            )}
            {review.hasReply && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                <MessageCircle className="w-3 h-3" /> 답글 있음
              </span>
            )}
            {review.isBestReview && (
              <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                <Award className="w-3 h-3" /> 베스트 리뷰
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm border-t pt-3">
            <div className="flex justify-between">
              <span className="text-gray-500">리뷰구분</span>
              <span className="font-medium">{review.reviewType || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">리뷰도움수</span>
              <span className="font-medium">{review.helpfulCount ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">전시상태</span>
              <span className="font-medium">{review.displayStatus || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">답글여부</span>
              <span className="font-medium">{review.hasReply ? 'Y' : 'N'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">베스트리뷰</span>
              <span className="font-medium">{review.isBestReview ? 'Y' : 'N'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">포토/영상</span>
              <span className="font-medium">{review.hasMedia ? 'Y' : 'N'}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{review.content}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
