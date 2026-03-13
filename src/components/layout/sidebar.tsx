'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Upload, BarChart3, List, Brain, GitCompare } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/', label: '파일 업로드', icon: Upload },
  { href: '/statistics', label: '통계 분석', icon: BarChart3 },
  { href: '/reviews', label: '리뷰 목록', icon: List },
  { href: '/analysis', label: 'AI 분석', icon: Brain },
  { href: '/comparison', label: '상품 비교', icon: GitCompare },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-[230px] bg-white border-r border-gray-200 shadow-sm z-40">
      <div className="p-6">
        <div className="mb-12">
          <Link href="/" className="text-xl font-bold text-gray-900">
            리뷰 분석 시스템
          </Link>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-gray-900 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
