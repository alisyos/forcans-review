import type { Metadata } from "next"
import "./globals.css"
import { Sidebar } from "@/components/layout/sidebar"

export const metadata: Metadata = {
  title: "리뷰 분석 시스템",
  description: "네이버 쇼핑 리뷰 분석 시스템",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Sidebar />
        <main className="ml-[230px] min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
