'use client'

import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useReviewStore } from '@/store/review-store'

const COLORS = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export function ProductComparison() {
  const statistics = useReviewStore((s) => s.statistics)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const summaries = statistics?.productSummaries || []

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedSummaries = useMemo(
    () => summaries.filter(s => selectedIds.has(s.productId)),
    [summaries, selectedIds]
  )

  const comparisonChartData = useMemo(() => {
    if (selectedSummaries.length === 0) return []
    return selectedSummaries.map(s => ({
      name: s.productName.length > 10 ? s.productName.substring(0, 10) + '...' : s.productName,
      '리뷰 수': s.reviewCount,
      '평균 평점': s.avgRating,
      '포토 비율': s.photoReviewRatio,
    }))
  }, [selectedSummaries])

  if (summaries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        데이터가 없습니다. 먼저 파일을 업로드해주세요.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">비교할 상품 선택</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {summaries.map((s) => (
              <label
                key={s.productId}
                className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedIds.has(s.productId) ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
              >
                <Checkbox
                  checked={selectedIds.has(s.productId)}
                  onCheckedChange={() => toggleProduct(s.productId)}
                />
                <span className="text-sm truncate">{s.productName}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedSummaries.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">리뷰 수 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="리뷰 수" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">평균 평점 비교</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="평균 평점" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">상세 비교 테이블</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>상품명</TableHead>
                    <TableHead className="text-right">리뷰 수</TableHead>
                    <TableHead className="text-right">평균 평점</TableHead>
                    <TableHead className="text-right">포토 비율</TableHead>
                    <TableHead className="text-right">베스트</TableHead>
                    <TableHead className="text-right">미답글</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSummaries.map((s, i) => (
                    <TableRow key={s.productId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          {s.productName}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{s.reviewCount}</TableCell>
                      <TableCell className="text-right">{s.avgRating}</TableCell>
                      <TableCell className="text-right">{s.photoReviewRatio}%</TableCell>
                      <TableCell className="text-right">{s.bestReviewCount}</TableCell>
                      <TableCell className="text-right">{s.noReplyCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
