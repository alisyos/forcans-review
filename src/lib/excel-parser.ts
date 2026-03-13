import * as XLSX from 'xlsx'
import { Review } from '@/types/review'

const COLUMN_MAPPINGS: Record<string, keyof Review> = {
  '상품ID': 'productId',
  '상품번호': 'productId',
  '상품명': 'productName',
  '평점': 'rating',
  '구매자평점': 'rating',
  '리뷰내용': 'content',
  '리뷰상세내용': 'content',
  '작성자': 'author',
  '등록자': 'author',
  '작성일': 'createdAt',
  '리뷰등록일': 'createdAt',
  '답글여부': 'hasReply',
  '베스트리뷰': 'isBestReview',
  '미디어': 'hasMedia',
  '포토': 'hasMedia',
  '사진': 'hasMedia',
  '포토/영상': 'hasMedia',
  'productId': 'productId',
  'productName': 'productName',
  'rating': 'rating',
  'content': 'content',
  'author': 'author',
  'createdAt': 'createdAt',
  'hasReply': 'hasReply',
  'isBestReview': 'isBestReview',
  'hasMedia': 'hasMedia',
  '리뷰구분': 'reviewType',
  '리뷰도움수': 'helpfulCount',
  '전시상태': 'displayStatus',
}

function normalizeDate(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'number') {
    const date = XLSX.SSF.parse_date_code(value)
    if (date) {
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`
    }
  }
  const str = String(value)
  const dateMatch = str.match(/(\d{4})[-.\/](\d{1,2})[-.\/](\d{1,2})/)
  if (dateMatch) {
    return `${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`
  }
  return str
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  const str = String(value).toLowerCase().trim()
  if (!str || str === 'n' || str === 'no' || str === 'false' || str === '0' || str === '아니오' || str === '없음') return false
  return true
}

function normalizeRating(value: unknown): number {
  const num = Number(value)
  if (isNaN(num)) return 0
  return Math.max(1, Math.min(5, Math.round(num)))
}

export function parseExcel(arrayBuffer: ArrayBuffer): { reviews: Review[]; errors: string[] } {
  const errors: string[] = []
  const workbook = XLSX.read(arrayBuffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    return { reviews: [], errors: ['시트를 찾을 수 없습니다.'] }
  }

  const sheet = workbook.Sheets[sheetName]
  const rawData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet)

  if (rawData.length === 0) {
    return { reviews: [], errors: ['데이터가 없습니다.'] }
  }

  const headers = Object.keys(rawData[0])
  const columnMap: Record<string, string> = {}
  headers.forEach(header => {
    const trimmed = header.trim()
    const mapped = COLUMN_MAPPINGS[trimmed]
    if (mapped) {
      columnMap[header] = mapped
    }
  })

  const reviews: Review[] = rawData.map((row, index) => {
    const review: Partial<Review> = {}
    Object.entries(columnMap).forEach(([originalKey, mappedKey]) => {
      const value = row[originalKey]
      switch (mappedKey) {
        case 'rating':
          review.rating = normalizeRating(value)
          break
        case 'hasMedia':
          review.hasMedia = normalizeBoolean(value)
          break
        case 'hasReply':
          review.hasReply = normalizeBoolean(value)
          break
        case 'isBestReview':
          review.isBestReview = normalizeBoolean(value)
          break
        case 'createdAt':
          review.createdAt = normalizeDate(value)
          break
        case 'helpfulCount':
          review.helpfulCount = Number(value) || 0
          break
        default:
          (review as Record<string, unknown>)[mappedKey] = String(value ?? '')
      }
    })

    return {
      id: String(index + 1),
      productId: review.productId || '',
      productName: review.productName || '',
      rating: review.rating || 0,
      hasMedia: review.hasMedia || false,
      content: review.content || '',
      author: review.author || '',
      createdAt: review.createdAt || '',
      hasReply: review.hasReply || false,
      isBestReview: review.isBestReview || false,
      reviewType: review.reviewType || '',
      helpfulCount: review.helpfulCount || 0,
      displayStatus: review.displayStatus || '',
    }
  })

  const invalidCount = reviews.filter(r => !r.content && !r.rating).length
  if (invalidCount > 0) {
    errors.push(`${invalidCount}개의 불완전한 행이 포함되어 있습니다.`)
  }

  return { reviews, errors }
}
