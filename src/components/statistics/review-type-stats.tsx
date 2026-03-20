'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Review } from '@/types/review'

interface Props {
  reviews: Review[]
}

const COLORS = ['#3b82f6', '#f97316']

export function ReviewTypeStats({ reviews }: Props) {
  const data = useMemo(() => {
    let normalCount = 0
    let monthUseCount = 0

    reviews.forEach(r => {
      if (r.reviewType === '한달사용') {
        monthUseCount++
      } else {
        normalCount++
      }
    })

    const total = reviews.length
    const normalRatio = total > 0 ? Math.round((normalCount / total) * 1000) / 10 : 0
    const monthUseRatio = total > 0 ? Math.round((monthUseCount / total) * 1000) / 10 : 0

    return [
      { name: '일반', value: normalRatio, count: normalCount },
      { name: '한달사용', value: monthUseRatio, count: monthUseCount },
    ]
  }, [reviews])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">일반/한달사용 비율</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label={({ name, value, count }) => `${name}: ${count}건(${value}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number, name: string, props: { payload?: { count: number } }) => props.payload ? `${props.payload.count}건(${value}%)` : `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
