'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Review } from '@/types/review'

interface Props {
  photoRatio: number
  reviews?: Review[]
}

const COLORS = ['#22c55e', '#9ca3af']

export function PhotoReviewStats({ photoRatio, reviews }: Props) {
  const photoCount = reviews ? reviews.filter(r => r.hasMedia).length : 0
  const textCount = reviews ? reviews.length - photoCount : 0
  const textRatio = Math.round((100 - photoRatio) * 10) / 10

  const data = [
    { name: '포토/영상 리뷰', value: photoRatio, count: photoCount },
    { name: '텍스트 리뷰', value: textRatio, count: textCount },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">포토/영상 리뷰 비율</CardTitle>
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
              label={({ name, value, count }) =>
                reviews ? `${name}: ${count}건(${value}%)` : `${name}: ${value}%`
              }
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props: { payload: { count: number } }) =>
                reviews ? `${props.payload.count}건(${value}%)` : `${value}%`
              }
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
