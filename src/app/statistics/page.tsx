'use client'

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronDown } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { RatingDistribution } from '@/components/statistics/rating-distribution'
import { DateTrendChart } from '@/components/statistics/date-trend-chart'
import { PhotoReviewStats } from '@/components/statistics/photo-review-stats'
import { ReviewTypeStats } from '@/components/statistics/review-type-stats'
import { ProductTop10Chart } from '@/components/statistics/product-top10-chart'
import { KeywordFrequency } from '@/components/statistics/keyword-frequency'
import { BestReviewStats } from '@/components/statistics/best-review-stats'
import { SummaryCards } from '@/components/dashboard/summary-cards'
import { useReviewStore } from '@/store/review-store'
import { calculateAllStatistics } from '@/lib/statistics'

export default function StatisticsPage() {
  const { reviews, statistics, getProductList } = useReviewStore()
  const [productFilterMode, setProductFilterMode] = useState<'all' | 'select'>('all')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const products = getProductList()

  const handleProductToggle = (productId: string, checked: boolean) => {
    setSelectedProducts(prev =>
      checked ? [...prev, productId] : prev.filter(id => id !== productId)
    )
  }

  const handleReset = () => {
    setProductFilterMode('all')
    setSelectedProducts([])
    setDateFrom('')
    setDateTo('')
  }

  const filteredReviews = useMemo(() => {
    const noProductFilter = productFilterMode === 'all'
    const noDateFilter = !dateFrom && !dateTo
    if (noProductFilter && noDateFilter) return reviews

    return reviews.filter(r => {
      if (!noProductFilter && selectedProducts.length > 0 && !selectedProducts.includes(r.productId)) return false
      if (dateFrom && r.createdAt < dateFrom) return false
      if (dateTo && r.createdAt > dateTo) return false
      return true
    })
  }, [reviews, productFilterMode, selectedProducts, dateFrom, dateTo])

  const filteredStats = useMemo(() => {
    if (filteredReviews === reviews && statistics) return statistics
    return calculateAllStatistics(filteredReviews)
  }, [filteredReviews, reviews, statistics])

  if (!filteredStats || reviews.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">통계 분석</h1>
        <div className="flex items-center justify-center h-64 text-gray-500">
          데이터가 없습니다. 먼저 파일을 업로드해주세요.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">통계 분석</h1>

      <div className="bg-white border rounded-lg p-4 mb-6 space-y-4">
        <div>
          <Label className="text-sm font-semibold mb-3 block">상품 필터</Label>
          <div className="flex items-center gap-4">
            <RadioGroup
              value={productFilterMode}
              onValueChange={(value: 'all' | 'select') => {
                setProductFilterMode(value)
                if (value === 'all') setSelectedProducts([])
              }}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="filter-all" />
                <Label htmlFor="filter-all" className="text-sm cursor-pointer">전체 상품</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="select" id="filter-select" />
                <Label htmlFor="filter-select" className="text-sm cursor-pointer">상품 선택</Label>
              </div>
            </RadioGroup>
            {productFilterMode === 'select' && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-between w-56">
                    {selectedProducts.length === 0
                      ? '상품을 선택하세요'
                      : `${selectedProducts.length}개 상품 선택됨`}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>상품 선택</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {products.map((p) => (
                        <div key={p.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`product-${p.id}`}
                            checked={selectedProducts.includes(p.id)}
                            onCheckedChange={(checked) =>
                              handleProductToggle(p.id, checked === true)
                            }
                          />
                          <Label htmlFor={`product-${p.id}`} className="text-sm cursor-pointer truncate">
                            {p.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => setDialogOpen(false)}>확인</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">기간 필터</Label>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="date-from" className="text-sm whitespace-nowrap">시작일</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="date-to" className="text-sm whitespace-nowrap">종료일</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              필터 초기화
            </Button>
          </div>
        </div>
      </div>

      <SummaryCards statistics={filteredStats} />

      <div className="grid grid-cols-2 gap-6 mt-6">
        <RatingDistribution data={filteredStats.ratingDistribution} />
        <DateTrendChart data={filteredStats.dateTrends} reviews={filteredReviews} />
        <ReviewTypeStats reviews={filteredReviews} />
        <PhotoReviewStats photoRatio={filteredStats.photoReviewRatio} reviews={filteredReviews} />
        <KeywordFrequency data={filteredStats.topKeywords} />
        <ProductTop10Chart summaries={filteredStats.productSummaries} />
      </div>

      <div className="mt-6">
        <BestReviewStats summaries={filteredStats.productSummaries} />
      </div>
    </div>
  )
}
