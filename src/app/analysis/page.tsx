'use client'

import { useState } from 'react'
import { AnalysisConfig } from '@/components/analysis/analysis-config'
import { AnalysisResultView } from '@/components/analysis/analysis-result'
import { useReviewStore } from '@/store/review-store'
import { useAnalysis } from '@/hooks/use-analysis'
import { AnalysisConfig as AnalysisConfigType } from '@/types/review'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'

export default function AnalysisPage() {
  const { reviews, analysisResults } = useReviewStore()
  const { analyze, isLoading } = useAnalysis()

  const handleAnalyze = (config: AnalysisConfigType) => {
    analyze(config)
  }

  if (reviews.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">AI 분석</h1>
        <div className="flex items-center justify-center h-64 text-gray-500">
          데이터가 없습니다. 먼저 파일을 업로드해주세요.
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">AI 분석</h1>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <AnalysisConfig onAnalyze={handleAnalyze} isLoading={isLoading} />

          {analysisResults.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  분석 히스토리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysisResults.map((result) => (
                    <div key={result.id} className="text-xs p-2 bg-gray-50 rounded">
                      <p className="font-medium">{new Date(result.timestamp).toLocaleString('ko-KR')}</p>
                      <p className="text-gray-500">{result.reviewCount}건 분석 | {result.config.mode}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="col-span-2">
          {analysisResults.length > 0 ? (
            <AnalysisResultView result={analysisResults[0]} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-lg">
              분석을 실행하면 결과가 여기에 표시됩니다
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
