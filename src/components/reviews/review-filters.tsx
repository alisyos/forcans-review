'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useReviewStore } from '@/store/review-store'
import { RotateCcw, Search } from 'lucide-react'

export function ReviewFilters() {
  const { filters, setFilters, resetFilters, getProductList } = useReviewStore()
  const products = getProductList()

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">상품</label>
          <Select value={filters.productId || 'all'} onValueChange={(v) => setFilters({ productId: v === 'all' ? '' : v })}>
            <SelectTrigger>
              <SelectValue placeholder="전체 상품" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상품</SelectItem>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">평점</label>
          <Select value={filters.rating?.toString() || 'all'} onValueChange={(v) => setFilters({ rating: v === 'all' ? null : Number(v) })}>
            <SelectTrigger>
              <SelectValue placeholder="전체 평점" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 평점</SelectItem>
              {[5, 4, 3, 2, 1].map((r) => (
                <SelectItem key={r} value={r.toString()}>{r}점</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">시작일</label>
          <Input type="date" value={filters.dateFrom} onChange={(e) => setFilters({ dateFrom: e.target.value })} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">종료일</label>
          <Input type="date" value={filters.dateTo} onChange={(e) => setFilters({ dateTo: e.target.value })} />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">답글 여부</label>
          <Select value={filters.hasReply} onValueChange={(v) => setFilters({ hasReply: v as 'all' | 'yes' | 'no' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="yes">답글 있음</SelectItem>
              <SelectItem value="no">답글 없음</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-500 mb-1 block">미디어</label>
          <Select value={filters.hasMedia} onValueChange={(v) => setFilters({ hasMedia: v as 'all' | 'yes' | 'no' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              <SelectItem value="yes">미디어 있음</SelectItem>
              <SelectItem value="no">미디어 없음</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              placeholder="검색..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon" onClick={resetFilters} title="필터 초기화">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
