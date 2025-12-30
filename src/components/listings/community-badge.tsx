'use client'

import Link from 'next/link'
import { MessageSquare, ThumbsUp, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ProviderCommunityStats } from '@/types/whatsapp'

interface CommunityBadgeProps {
  stats: ProviderCommunityStats
  providerId: string
  size?: 'sm' | 'md'
  showLink?: boolean
  className?: string
}

export function CommunityBadge({
  stats,
  providerId,
  size = 'md',
  showLink = true,
  className,
}: CommunityBadgeProps) {
  if (stats.totalMentions === 0) return null

  const isPositive = stats.positiveCount > stats.negativeCount
  const sentimentPercent = Math.round((stats.positiveCount / stats.totalMentions) * 100)

  const content = (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-blue-50 to-blue-100 border border-blue-200',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
        showLink && 'hover:from-blue-100 hover:to-blue-150 transition-colors cursor-pointer',
        className
      )}
    >
      <MessageSquare className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4', 'text-blue-600')} />
      <span className="font-medium text-blue-900">
        {stats.totalMentions} אזכורים בקהילה
      </span>
      {isPositive && stats.positiveCount > 0 && (
        <Badge variant="secondary" className="bg-green-100 text-green-700 gap-1 text-xs px-1.5 py-0">
          <ThumbsUp className="h-3 w-3" />
          {sentimentPercent}%
        </Badge>
      )}
      {stats.recommendationCount > 0 && (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 gap-1 text-xs px-1.5 py-0">
          <TrendingUp className="h-3 w-3" />
          {stats.recommendationCount} המלצות
        </Badge>
      )}
    </div>
  )

  if (showLink) {
    return (
      <Link href={`/providers/${providerId}#community`}>
        {content}
      </Link>
    )
  }

  return content
}
