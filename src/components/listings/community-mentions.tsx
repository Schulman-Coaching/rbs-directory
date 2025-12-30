'use client'

import Link from 'next/link'
import { MessageSquare, ThumbsUp, ThumbsDown, TrendingUp, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProviderCommunityStats, ExtractedEntity } from '@/types/whatsapp'

interface CommunityMentionsProps {
  stats: ProviderCommunityStats
  recentMentions: ExtractedEntity[]
  providerId: string
  className?: string
}

export function CommunityMentions({
  stats,
  recentMentions,
  providerId,
  className,
}: CommunityMentionsProps) {
  if (stats.totalMentions === 0) return null

  const sentimentPercent = Math.round((stats.positiveCount / stats.totalMentions) * 100)

  return (
    <Card id="community" className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-l from-blue-50 to-blue-100 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <MessageSquare className="h-5 w-5" />
              מה אומרים בקהילה
            </CardTitle>
            <CardDescription className="text-blue-700">
              תובנות מקבוצות וואטסאפ קהילתיות
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="border-blue-200 text-blue-700 hover:bg-blue-50">
            <Link href="/community">
              לכל התובנות
              <ArrowLeft className="h-4 w-4 mr-1" />
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Stats Bar */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-bold">{stats.totalMentions}</div>
              <div className="text-xs text-muted-foreground">אזכורים</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{sentimentPercent}%</div>
              <div className="text-xs text-muted-foreground">חיוביים</div>
            </div>
          </div>

          {stats.recommendationCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-amber-600">{stats.recommendationCount}</div>
                <div className="text-xs text-muted-foreground">המלצות</div>
              </div>
            </div>
          )}
        </div>

        {/* Sentiment Bar */}
        <div className="mb-6">
          <div className="flex gap-1 h-2 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${(stats.positiveCount / stats.totalMentions) * 100}%` }}
            />
            <div
              className="bg-gray-300 h-full"
              style={{ width: `${(stats.neutralCount / stats.totalMentions) * 100}%` }}
            />
            <div
              className="bg-red-400 h-full"
              style={{ width: `${(stats.negativeCount / stats.totalMentions) * 100}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-green-500" />
              חיובי ({stats.positiveCount})
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-gray-300" />
              ניטרלי ({stats.neutralCount})
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded bg-red-400" />
              שלילי ({stats.negativeCount})
            </span>
          </div>
        </div>

        {/* Recent Mentions */}
        {recentMentions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">אזכורים אחרונים</h4>
            {recentMentions.slice(0, 3).map((mention) => {
              const sentimentColor = {
                POSITIVE: 'border-r-green-500',
                NEUTRAL: 'border-r-gray-300',
                NEGATIVE: 'border-r-red-400',
              }[mention.sentiment || 'NEUTRAL']

              return (
                <blockquote
                  key={mention.id}
                  className={cn(
                    'border-r-2 pr-3 text-sm text-muted-foreground italic',
                    sentimentColor
                  )}
                >
                  "{mention.rawText}"
                  <footer className="text-xs mt-1 not-italic">
                    {mention.createdAt.toLocaleDateString('he-IL')}
                  </footer>
                </blockquote>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
