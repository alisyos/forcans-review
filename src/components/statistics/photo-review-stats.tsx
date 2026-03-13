'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  photoRatio: number
}

const COLORS = ['#22c55e', '#e5e7eb']

export function PhotoReviewStats({ photoRatio }: Props) {
  const data = [
    { name: '포토/영상 리뷰', value: photoRatio },
    { name: '텍스트 리뷰', value: Math.round((100 - photoRatio) * 10) / 10 },
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
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
