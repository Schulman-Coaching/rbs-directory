'use client'

import Link from 'next/link'
import { MessageSquare, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ExtractedEntity, SentimentType } from '@/types/whatsapp'

interface InsightCardProps {
  entity: ExtractedEntity
  providerName?: string
  className?: string
}

const sentimentConfig: Record<SentimentType, { label: string; color: string; icon: React.ElementType }> = {
  POSITIVE: { label: 'חיובי', color: 'bg-green-100 text-green-700', icon: ThumbsUp },
  NEUTRAL: { label: 'ניטרלי', color: 'bg-gray-100 text-gray-700', icon: MessageSquare },
  NEGATIVE: { label: 'שלילי', color: 'bg-red-100 text-red-700', icon: ThumbsDown },
}

export function InsightCard({ entity, providerName, className }: InsightCardProps) {
  const sentiment = entity.sentiment || 'NEUTRAL'
  const sentimentInfo = sentimentConfig[sentiment]
  const SentimentIcon = sentimentInfo.icon

  // Get display text based on entity type
  const getDisplayContent = () => {
    const data = entity.extractedData

    switch (data.type) {
      case 'RECOMMENDATION':
        return {
          title: providerName || data.businessName,
          subtitle: data.recommendationType === 'RECOMMEND'
            ? 'הומלץ על ידי חבר קהילה'
            : 'לא הומלץ',
          quote: data.reason || entity.rawText,
        }
      case 'PROVIDER_MENTION':
        return {
          title: providerName || data.businessName,
          subtitle: 'אוזכר בשיחה קהילתית',
          quote: data.context || entity.rawText,
        }
      case 'SERVICE_REQUEST':
        return {
          title: data.serviceType,
          subtitle: 'בקשה מהקהילה',
          quote: data.description,
        }
      default:
        return {
          title: 'תובנה קהילתית',
          subtitle: '',
          quote: entity.rawText,
        }
    }
  }

  const content = getDisplayContent()

  return (
    <Card className={cn('overflow-hidden hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold">{content.title}</h3>
            <p className="text-sm text-muted-foreground">{content.subtitle}</p>
          </div>
          <Badge variant="secondary" className={cn('gap-1', sentimentInfo.color)}>
            <SentimentIcon className="h-3 w-3" />
            {sentimentInfo.label}
          </Badge>
        </div>

        <blockquote className="border-r-2 border-muted pr-3 my-3 text-sm text-muted-foreground italic">
          "{content.quote}"
        </blockquote>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {entity.createdAt.toLocaleDateString('he-IL')}
          </span>

          {entity.providerId && (
            <Link
              href={`/providers/${entity.providerId}`}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              לפרופיל הספק
              <ArrowLeft className="h-3 w-3" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
