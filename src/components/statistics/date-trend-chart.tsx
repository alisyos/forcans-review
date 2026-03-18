'use client'

import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Review, DateTrend } from '@/types/review'
import { calculateDateTrends, DateGranularity } from '@/lib/statistics'

interface Props {
  data: DateTrend[]
  reviews?: Review[]
  mini?: boolean
}

const GRANULARITY_OPTIONS: { value: DateGranularity; label: string }[] = [
  { value: 'daily', label: '일간' },
  { value: 'weekly', label: '주간' },
  { value: 'monthly', label: '월간' },
]

export function DateTrendChart({ data, reviews, mini }: Props) {
  const [granularity, setGranularity] = useState<DateGranularity>('daily')

  const chartData = useMemo(() => {
    if (!reviews || reviews.length === 0) return data
    return calculateDateTrends(reviews, granularity)
  }, [reviews, granularity, data])

  if (mini) {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">날짜별 리뷰 추이</CardTitle>
        {reviews && (
          <div className="flex gap-1">
            {GRANULARITY_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={granularity === opt.value ? 'default' : 'outline'}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setGranularity(opt.value)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} name="리뷰 수" />
            <Line yAxisId="right" type="monotone" dataKey="avgRating" stroke="#f59e0b" strokeWidth={2} name="평균 평점" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
