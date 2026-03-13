'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, Loader2 } from 'lucide-react'
import { AnalysisConfig as AnalysisConfigType } from '@/types/review'
import { useReviewStore } from '@/store/review-store'

interface Props {
  onAnalyze: (config: AnalysisConfigType) => void
  isLoading: boolean
}

export function AnalysisConfig({ onAnalyze, isLoading }: Props) {
  const products = useReviewStore((s) => s.getProductList())
  const [config, setConfig] = useState<AnalysisConfigType>({
    mode: 'sampling',
    samplingStrategy: 'random',
    sampleSize: 50,
    targetProductId: undefined,
  })

  const handleSubmit = () => {
    onAnalyze(config)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5" />
          AI 분석 설정
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">분석 모드</Label>
          <RadioGroup
            value={config.mode}
            onValueChange={(v) => setConfig(prev => ({ ...prev, mode: v as AnalysisConfigType['mode'] }))}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sampling" id="sampling" />
              <Label htmlFor="sampling">샘플링 분석 - 무작위 샘플 추출 후 분석</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="batch" id="batch" />
              <Label htmlFor="batch">배치 분석 - 전체 리뷰를 배치로 나눠 분석</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="per-product" id="per-product" />
              <Label htmlFor="per-product">상품별 분석 - 특정 상품의 리뷰만 분석</Label>
            </div>
          </RadioGroup>
        </div>

        {config.mode === 'sampling' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium mb-1 block">샘플링 전략</Label>
              <Select
                value={config.samplingStrategy}
                onValueChange={(v) => setConfig(prev => ({ ...prev, samplingStrategy: v as AnalysisConfigType['samplingStrategy'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="random">무작위</SelectItem>
                  <SelectItem value="recent">최신순</SelectItem>
                  <SelectItem value="low-rating">저평점 우선</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">샘플 크기</Label>
              <Input
                type="number"
                value={config.sampleSize}
                onChange={(e) => setConfig(prev => ({ ...prev, sampleSize: Number(e.target.value) }))}
                min={10}
                max={500}
              />
            </div>
          </div>
        )}

        {config.mode === 'per-product' && (
          <div>
            <Label className="text-sm font-medium mb-1 block">분석 대상 상품</Label>
            <Select
              value={config.targetProductId || ''}
              onValueChange={(v) => setConfig(prev => ({ ...prev, targetProductId: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="상품을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button onClick={handleSubmit} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              분석 중...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              AI 분석 시작
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
