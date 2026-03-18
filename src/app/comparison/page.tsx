'use client'

import { ProductComparison } from '@/components/comparison/product-comparison'

export default function ComparisonPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">상품 비교 분석</h1>
      <ProductComparison />
    </div>
  )
}
