# 리뷰 분석 시스템 (forcans-review)

네이버 쇼핑 리뷰 Excel 파일을 업로드하여 JavaScript 기반 통계 분석과 Claude API를 활용한 AI 분석을 제공하는 웹 애플리케이션입니다.

## 기술 스택

- **프레임워크**: Next.js 14 (App Router), TypeScript
- **스타일링**: Tailwind CSS, Class Variance Authority
- **UI 컴포넌트**: Radix UI 기반 커스텀 컴포넌트
- **아이콘**: Lucide React
- **상태 관리**: Zustand
- **데이터 시각화**: Recharts
- **Excel 파싱**: SheetJS (xlsx)
- **AI 분석**: Anthropic SDK (Claude API)
- **폼 관리**: React Hook Form + Zod
- **데이터 페칭**: TanStack React Query
- **HTTP 클라이언트**: Axios
- **날짜 처리**: date-fns
- **알림**: React Toastify

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속합니다.

### 기타 명령어

```bash
npm run build    # 프로덕션 빌드
npm start        # 프로덕션 서버 시작
npm run lint     # 린팅 실행
```

## 프로젝트 구조

```
src/
├── app/                        # Next.js App Router 페이지
│   ├── api/analyze/            # Claude API 분석 엔드포인트
│   │   └── route.ts
│   ├── analysis/               # AI 분석 페이지
│   │   └── page.tsx
│   ├── comparison/             # 상품 비교 페이지
│   │   └── page.tsx
│   ├── reviews/                # 리뷰 목록 페이지
│   │   └── page.tsx
│   ├── statistics/             # 통계 페이지
│   │   └── page.tsx
│   ├── upload/                 # 업로드 페이지
│   │   └── page.tsx
│   ├── layout.tsx              # 루트 레이아웃 (사이드바 포함)
│   └── page.tsx                # 대시보드 (홈)
├── components/
│   ├── analysis/               # AI 분석 설정 및 결과 컴포넌트
│   ├── comparison/             # 상품 비교 컴포넌트
│   ├── dashboard/              # 대시보드 요약 카드
│   ├── layout/                 # 사이드바 레이아웃
│   ├── reviews/                # 리뷰 테이블, 필터, 상세 다이얼로그
│   ├── statistics/             # 통계 차트 컴포넌트
│   ├── ui/                     # Radix UI 기반 공통 UI 컴포넌트
│   └── upload/                 # 파일 업로더 컴포넌트
├── hooks/                      # 커스텀 훅 (분석, 통계)
├── lib/                        # 유틸리티 (Excel 파싱, 통계 계산, 키워드 추출)
├── store/                      # Zustand 스토어
└── types/                      # TypeScript 타입 정의
```

## 주요 기능

### 대시보드 (`/`)
업로드된 리뷰 데이터의 전체 요약 정보를 카드 형태로 보여줍니다.

### 업로드 (`/upload`)
네이버 쇼핑 리뷰 Excel 파일(.xlsx, .xls)을 드래그 앤 드롭 또는 파일 선택으로 업로드합니다.

### 통계 (`/statistics`)
평점 분포, 날짜별 트렌드, 포토리뷰 비율, 베스트리뷰 통계, 키워드 빈도 등을 차트로 시각화합니다.

### 리뷰 목록 (`/reviews`)
업로드된 리뷰를 테이블 형태로 조회하며 필터링 및 상세 보기를 지원합니다.

### AI 분석 (`/analysis`)
Claude API를 활용하여 리뷰 데이터에 대한 감성 분석, 핵심 이슈 도출, 개선 권고사항을 생성합니다.

### 상품 비교 (`/comparison`)
여러 상품의 리뷰 통계를 비교 분석합니다.

## Excel 파일 형식

업로드할 Excel 파일은 다음 컬럼 헤더를 지원합니다:

| 컬럼 | 설명 |
|------|------|
| 상품ID / productId | 상품 고유 식별자 |
| 상품명 / productName | 상품 이름 |
| 평점 / rating | 리뷰 평점 (1~5) |
| 리뷰내용 / content | 리뷰 본문 텍스트 |
| 작성자 / author | 리뷰 작성자 |
| 작성일 / date | 리뷰 작성 날짜 |
| 답글여부 / hasReply | 판매자 답글 여부 |
| 베스트리뷰 / isBest | 베스트리뷰 선정 여부 |
| 미디어 / media | 이미지/동영상 첨부 여부 |
