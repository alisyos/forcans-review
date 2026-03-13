import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `당신은 한국어 상품 리뷰 분석 전문가입니다. 제공된 리뷰 데이터를 분석하여 다음 JSON 형식으로 결과를 반환해주세요.

응답은 반드시 아래 JSON 형식만 포함해야 합니다 (다른 텍스트 없이):
{
  "summary": "전체 리뷰에 대한 종합 분석 요약 (3-5문장)",
  "sentimentBreakdown": {
    "positive": 긍정 비율(숫자, 0-100),
    "neutral": 중립 비율(숫자, 0-100),
    "negative": 부정 비율(숫자, 0-100)
  },
  "keyIssues": [
    {
      "issue": "이슈 설명",
      "frequency": "빈도 설명 (예: '전체의 약 15%')",
      "severity": "high/medium/low"
    }
  ],
  "recommendations": [
    "개선 제안 1",
    "개선 제안 2"
  ]
}

분석 시 다음을 고려하세요:
1. 리뷰의 전반적인 감성 (긍정/부정/중립)
2. 반복적으로 언급되는 문제점
3. 고객이 가장 만족하는 부분
4. 구체적이고 실행 가능한 개선 방안`

interface ReviewSubset {
  content: string
  rating: number
  productName: string
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your-api-key-here') {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY가 설정되지 않았습니다. .env.local 파일에 API 키를 설정해주세요.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { reviews, config } = body as { reviews: ReviewSubset[]; config: { mode: string } }

    if (!reviews || reviews.length === 0) {
      return NextResponse.json({ error: '분석할 리뷰가 없습니다.' }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    if (config.mode === 'batch' && reviews.length > 100) {
      const batchSize = 100
      const batches: ReviewSubset[][] = []
      for (let i = 0; i < reviews.length; i += batchSize) {
        batches.push(reviews.slice(i, i + batchSize))
      }

      const batchResults = []
      for (const batch of batches) {
        const reviewText = batch
          .map((r, i) => `[리뷰 ${i + 1}] 상품: ${r.productName} | 평점: ${r.rating}점\n${r.content}`)
          .join('\n\n')

        const message = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: `다음 ${batch.length}개의 리뷰를 분석해주세요:\n\n${reviewText}` }],
        })

        const text = message.content[0].type === 'text' ? message.content[0].text : ''
        try {
          batchResults.push(JSON.parse(text))
        } catch {
          batchResults.push(null)
        }
      }

      const validResults = batchResults.filter(Boolean)
      if (validResults.length === 0) {
        return NextResponse.json({ error: '분석 결과를 파싱할 수 없습니다.' }, { status: 500 })
      }

      const merged = {
        summary: validResults.map((r: Record<string, unknown>) => r.summary).join(' '),
        sentimentBreakdown: {
          positive: Math.round(validResults.reduce((sum: number, r: Record<string, { positive: number }>) => sum + r.sentimentBreakdown.positive, 0) / validResults.length),
          neutral: Math.round(validResults.reduce((sum: number, r: Record<string, { neutral: number }>) => sum + r.sentimentBreakdown.neutral, 0) / validResults.length),
          negative: Math.round(validResults.reduce((sum: number, r: Record<string, { negative: number }>) => sum + r.sentimentBreakdown.negative, 0) / validResults.length),
        },
        keyIssues: validResults.flatMap((r: Record<string, unknown>) => r.keyIssues as unknown[]).slice(0, 10),
        recommendations: Array.from(new Set(validResults.flatMap((r: Record<string, unknown>) => r.recommendations as string[]))).slice(0, 10),
      }

      return NextResponse.json(merged)
    }

    const reviewText = reviews
      .map((r, i) => `[리뷰 ${i + 1}] 상품: ${r.productName} | 평점: ${r.rating}점\n${r.content}`)
      .join('\n\n')

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: `다음 ${reviews.length}개의 리뷰를 분석해주세요:\n\n${reviewText}` }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    try {
      const result = JSON.parse(text)
      return NextResponse.json(result)
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return NextResponse.json(JSON.parse(jsonMatch[0]))
      }
      return NextResponse.json({ error: '분석 결과를 파싱할 수 없습니다.', raw: text }, { status: 500 })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
