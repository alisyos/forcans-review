'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductSummary } from '@/types/review'

interface Props {
  summaries: ProductSummary[]
}

export function BestReviewStats({ summaries }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">상품별 통계 요약</CardTitle>
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
            {summaries.map((s) => (
              <TableRow key={s.productId}>
                <TableCell className="max-w-[200px] truncate">{s.productName}</TableCell>
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
  )
}
