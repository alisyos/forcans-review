'use client'

import { useState, useMemo } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ProductSummary } from '@/types/review'

interface Props {
  summaries: ProductSummary[]
}

type SortField = 'reviewCount' | 'avgRating' | 'photoReviewRatio' | 'bestReviewCount' | 'noReplyCount'
type SortDirection = 'asc' | 'desc'

const SORTABLE_COLUMNS: { field: SortField; label: string }[] = [
  { field: 'reviewCount', label: '리뷰 수' },
  { field: 'avgRating', label: '평균 평점' },
  { field: 'photoReviewRatio', label: '포토 비율' },
  { field: 'bestReviewCount', label: '베스트' },
  { field: 'noReplyCount', label: '미답글' },
]

export function BestReviewStats({ summaries }: Props) {
  const [sortField, setSortField] = useState<SortField>('reviewCount')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedSummaries = useMemo(() => {
    return [...summaries].sort((a, b) => {
      const diff = a[sortField] - b[sortField]
      return sortDirection === 'asc' ? diff : -diff
    })
  }, [summaries, sortField, sortDirection])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 inline ml-1" />
      : <ArrowDown className="w-3 h-3 inline ml-1" />
  }

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
              {SORTABLE_COLUMNS.map(col => (
                <TableHead
                  key={col.field}
                  className="text-right cursor-pointer select-none hover:bg-gray-50"
                  onClick={() => handleSort(col.field)}
                >
                  {col.label}
                  <SortIcon field={col.field} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedSummaries.map((s) => (
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
