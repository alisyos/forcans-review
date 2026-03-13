'use client'

import { MessageSquare, Star, Camera, MessageCircleOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useReviewStore } from '@/store/review-store'
import type { ReviewStatistics } from '@/types/review'

interface SummaryCardsProps {
  statistics?: ReviewStatistics | null
}

export function SummaryCards({ statistics: propStatistics }: SummaryCardsProps = {}) {
  const storeStatistics = useReviewStore((s) => s.statistics)
  const statistics = propStatistics ?? storeStatistics

  if (!statistics) return null

  const cards = [
    {
      label: '총 리뷰 수',
      value: statistics.totalReviews.toLocaleString(),
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: '평균 평점',
      value: `${statistics.avgRating}점`,
      icon: Star,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      label: '포토 리뷰 비율',
      value: `${statistics.photoReviewRatio}%`,
      icon: Camera,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: '미답글 수',
      value: statistics.noReplyCount.toLocaleString(),
      icon: MessageCircleOff,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
