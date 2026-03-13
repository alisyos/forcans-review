'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, FileSpreadsheet, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { parseExcel } from '@/lib/excel-parser'
import { useReviewStore } from '@/store/review-store'

export function FileUploader() {
  const { reviews, uploadState, uploadError, setReviews, clearReviews, setUploadState, setUploadError } = useReviewStore()
  const [isDragging, setIsDragging] = useState(false)
  const [parseErrors, setParseErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setUploadError('Excel 파일(.xlsx)만 업로드 가능합니다.')
      return
    }

    setUploadState('parsing')
    setParseErrors([])

    try {
      const arrayBuffer = await file.arrayBuffer()
      const { reviews: parsed, errors } = parseExcel(arrayBuffer)
      setParseErrors(errors)

      if (parsed.length === 0) {
        setUploadError('파싱된 데이터가 없습니다.')
        setUploadState('error')
        return
      }

      setReviews(parsed)
    } catch {
      setUploadError('파일 파싱 중 오류가 발생했습니다.')
      setUploadState('error')
    }
  }, [setReviews, setUploadState, setUploadError])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const previewReviews = reviews.slice(0, 10)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Excel 파일 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleInputChange}
              className="hidden"
            />
            {uploadState === 'parsing' ? (
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900" />
                <p className="text-gray-600">파일을 분석하고 있습니다...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-10 h-10 text-gray-400" />
                <div>
                  <p className="text-gray-700 font-medium">파일을 드래그하거나 클릭하여 업로드</p>
                  <p className="text-sm text-gray-500 mt-1">Excel 파일(.xlsx)만 지원합니다</p>
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{uploadError}</p>
            </div>
          )}

          {parseErrors.length > 0 && (
            <div className="mt-4 bg-yellow-50 p-3 rounded-lg">
              {parseErrors.map((err, i) => (
                <p key={i} className="text-sm text-yellow-700">{err}</p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {uploadState === 'parsed' && reviews.length > 0 && (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">파싱 결과</CardTitle>
              <Button variant="outline" size="sm" onClick={clearReviews}>
                <X className="w-4 h-4 mr-1" />
                데이터 초기화
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{reviews.length.toLocaleString()}</p>
                  <p className="text-sm text-blue-600">총 리뷰 수</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">
                    {new Set(reviews.map(r => r.productId || r.productName)).size}
                  </p>
                  <p className="text-sm text-green-600">상품 수</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <FileSpreadsheet className="w-6 h-6 mx-auto text-purple-500 mb-1" />
                  <p className="text-sm text-purple-600">파싱 완료</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">미리보기 (상위 10행)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead className="w-16">평점</TableHead>
                    <TableHead>리뷰 내용</TableHead>
                    <TableHead className="w-24">작성자</TableHead>
                    <TableHead className="w-28">작성일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="text-gray-500">{review.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{review.productName}</TableCell>
                      <TableCell>{'⭐'.repeat(review.rating)}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{review.content}</TableCell>
                      <TableCell>{review.author}</TableCell>
                      <TableCell>{review.createdAt}</TableCell>
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
