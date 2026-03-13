# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고할 가이드를 제공합니다.

## 언어 설정
**중요**: Claude는 이 프로젝트에서 모든 답변과 커뮤니케이션을 한국어로 해야 합니다.

## 프로젝트 개요

네이버 쇼핑 리뷰 분석 시스템입니다. Excel 파일로 리뷰 데이터를 업로드하면 JavaScript 기반 통계 분석과 Claude API를 활용한 AI 분석을 제공합니다.

## 개발 명령어

```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start

# 린팅 실행
npm run lint
```

개발 서버는 http://localhost:3000 에서 실행됩니다.

## 아키텍처 및 핵심 패턴

### 기술 스택
- **Core**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI 컴포넌트**: Radix UI 기반 커스텀 컴포넌트
- **아이콘**: Lucide React
- **상태 관리**: Zustand (전역), useState (로컬)
- **데이터 시각화**: Recharts
- **Excel 파싱**: SheetJS (xlsx)
- **AI 분석**: Anthropic SDK (Claude API)
- **폼**: React Hook Form + Zod 검증
- **데이터 페칭**: TanStack React Query
- **알림**: React Toastify
- **날짜 처리**: date-fns
- **스타일링 유틸리티**: clsx, tailwind-merge, class-variance-authority

### 레이아웃 구조
- **사이드바 레이아웃**: 230px 고정 사이드바 + 메인 콘텐츠 영역
- **사이드바 컴포넌트**: `src/components/layout/sidebar.tsx`에 위치
- **루트 레이아웃**: `src/app/layout.tsx`에서 사이드바를 포함한 전체 레이아웃 구성

### 컴포넌트 시스템
- **커스텀 UI 컴포넌트**: `src/components/ui/`에 위치 (Radix UI 기반)
- **스타일링**: 조건부 클래스를 위한 `cn()` 유틸리티와 Tailwind CSS
- **임포트 패턴**: `import { Button } from '@/components/ui/button'`

### 데이터 흐름
1. **Excel 업로드**: 사용자가 Excel 파일 업로드 → `lib/excel-parser.ts`에서 파싱
2. **상태 저장**: 파싱된 리뷰 데이터가 Zustand 스토어(`store/review-store.ts`)에 저장
3. **통계 계산**: `lib/statistics.ts`와 `lib/keyword-extractor.ts`에서 JS 기반 통계 산출
4. **차트 렌더링**: Recharts 컴포넌트(`components/statistics/`)에서 시각화
5. **AI 분석**: `POST /api/analyze` API 라우트를 통해 Claude API 호출 → 감성 분석, 이슈 도출

## 폴더 구조

```
src/
├── app/                        # Next.js App Router 페이지 및 API 라우트
│   ├── api/analyze/route.ts    # Claude API 분석 엔드포인트
│   ├── analysis/page.tsx       # AI 분석 페이지
│   ├── comparison/page.tsx     # 상품 비교 페이지
│   ├── reviews/page.tsx        # 리뷰 목록 페이지
│   ├── statistics/page.tsx     # 통계 페이지
│   ├── upload/page.tsx         # 업로드 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 대시보드
├── components/
│   ├── analysis/               # 분석 설정/결과 컴포넌트
│   ├── comparison/             # 상품 비교 컴포넌트
│   ├── dashboard/              # 대시보드 요약 카드
│   ├── layout/                 # 사이드바
│   ├── reviews/                # 리뷰 테이블, 필터, 상세 다이얼로그
│   ├── statistics/             # 차트 컴포넌트 (평점, 트렌드, 키워드 등)
│   ├── ui/                     # Radix UI 기반 공통 컴포넌트
│   └── upload/                 # 파일 업로더
├── hooks/
│   ├── use-analysis.ts         # AI 분석 API 호출 훅
│   └── use-statistics.ts       # 통계 계산 훅 (메모이제이션)
├── lib/
│   ├── excel-parser.ts         # Excel 파싱 (컬럼 매핑, 정규화)
│   ├── keyword-extractor.ts    # 키워드 추출 (한국어 불용어 처리)
│   ├── statistics.ts           # 통계 계산 유틸리티
│   └── utils.ts                # cn() 클래스명 유틸리티
├── store/
│   └── review-store.ts         # Zustand 스토어 (리뷰, 필터, 통계, 분석 결과)
└── types/
    └── review.ts               # TypeScript 인터페이스 및 타입 정의
```

## 핵심 패턴

### Excel 파싱 → Zustand → 통계/차트
- Excel 업로드 시 `excel-parser.ts`가 한국어/영어 컬럼 헤더를 자동 매핑
- 파싱 결과는 Zustand 스토어에 저장되며 동시에 통계가 자동 계산됨
- 통계 데이터는 Recharts 기반 차트 컴포넌트에서 렌더링

### API Route를 통한 Claude API 연동
- `POST /api/analyze` 엔드포인트에서 Anthropic SDK로 Claude API 호출
- 한국어 프롬프트로 감성 분석, 핵심 이슈, 개선 권고사항 생성
- 100개 이상 리뷰는 배치 처리 지원

## 환경 변수

```env
ANTHROPIC_API_KEY=   # Claude API 키 (AI 분석 기능에 필요)
```

`.env.local` 파일에 설정합니다.

## 가이드라인

### 사용해야 할 것
- Zustand를 통한 전역 상태 관리
- `src/components/ui/`의 Radix UI 기반 커스텀 컴포넌트
- Tailwind CSS를 통한 스타일링
- React Hook Form + Zod를 통한 폼 검증
- `cn()` 유틸리티를 통한 조건부 클래스 결합

### 사용하지 말아야 할 것
- Context API (대신 Zustand 사용)
- shadcn/ui CLI (Radix UI 기반 커스텀 컴포넌트를 직접 사용)
- 불필요한 외부 라이브러리 추가
