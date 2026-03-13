'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { KeywordItem } from '@/types/review'

interface Props {
  data: KeywordItem[]
}

export function KeywordFrequency({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">키워드 빈도 Top 20</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="keyword" width={80} fontSize={12} />
            <Tooltip />
            <Bar dataKey="count" fill="#f59e0b" radius={[0, 4, 4, 0]} name="빈도" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
