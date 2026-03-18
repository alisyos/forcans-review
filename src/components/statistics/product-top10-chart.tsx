'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ProductSummary } from '@/types/review'

interface Props {
  summaries: ProductSummary[]
}

type SortCriteria = 'reviewCount' | 'avgRating'

export function ProductTop10Chart({ summaries }: Props) {
  const [criteria, setCriteria] = useState<SortCriteria>('reviewCount')

  const chartData = useMemo(() => {
    const sorted = [...summaries].sort((a, b) =>
      criteria === 'reviewCount'
        ? b.reviewCount - a.reviewCount
        : b.avgRating - a.avgRating
    )
    return sorted.slice(0, 10).map(s => ({
      name: s.productName.length > 15 ? s.productName.substring(0, 15) + '…' : s.productName,
      value: criteria === 'reviewCount' ? s.reviewCount : s.avgRating,
    }))
  }, [summaries, criteria])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">상품 Top 10</CardTitle>
        <div className="flex gap-1">
          <Button
            variant={criteria === 'reviewCount' ? 'default' : 'outline'}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setCriteria('reviewCount')}
          >
            리뷰 수
          </Button>
          <Button
            variant={criteria === 'avgRating' ? 'default' : 'outline'}
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setCriteria('avgRating')}
          >
            평점
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} fontSize={12} />
            <Tooltip />
            <Bar
              dataKey="value"
              fill={criteria === 'reviewCount' ? '#8b5cf6' : '#f59e0b'}
              name={criteria === 'reviewCount' ? '리뷰 수' : '평균 평점'}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
