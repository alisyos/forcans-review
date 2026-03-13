'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnalysisResult as AnalysisResultType } from '@/types/review'
import { AlertTriangle, Lightbulb, Clock } from 'lucide-react'

interface Props {
  result: AnalysisResultType
}

const SENTIMENT_COLORS = ['#22c55e', '#94a3b8', '#ef4444']

export function AnalysisResultView({ result }: Props) {
  const sentimentData = [
    { name: '긍정', value: result.sentimentBreakdown.positive },
    { name: '중립', value: result.sentimentBreakdown.neutral },
    { name: '부정', value: result.sentimentBreakdown.negative },
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">분석 결과</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {new Date(result.timestamp).toLocaleString('ko-KR')}
              <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{result.reviewCount}건 분석</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{result.summary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">감성 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              주요 이슈
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.keyIssues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                    issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {issue.severity === 'high' ? '높음' : issue.severity === 'medium' ? '보통' : '낮음'}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{issue.issue}</p>
                    <p className="text-xs text-gray-500 mt-0.5">빈도: {issue.frequency}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            개선 제안
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
