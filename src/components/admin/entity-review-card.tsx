'use client'

import { useState } from 'react'
import { Check, X, MessageSquare, Phone, DollarSign, Search, ThumbsUp, Link2, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { ExtractedEntity, EntityType, SentimentType } from '@/types/whatsapp'
import type { Provider } from '@/types'

interface EntityReviewCardProps {
  entity: ExtractedEntity
  providers?: Provider[]
  onApprove?: (entityId: string, providerId?: string) => void
  onReject?: (entityId: string) => void
  className?: string
}

const entityTypeConfig: Record<EntityType, {
  label: string
  icon: React.ElementType
  color: string
}> = {
  PROVIDER_MENTION: {
    label: 'אזכור ספק',
    icon: Building2,
    color: 'bg-blue-500',
  },
  CONTACT_INFO: {
    label: 'פרטי קשר',
    icon: Phone,
    color: 'bg-purple-500',
  },
  PRICING: {
    label: 'מחיר',
    icon: DollarSign,
    color: 'bg-green-500',
  },
  SERVICE_REQUEST: {
    label: 'בקשת שירות',
    icon: Search,
    color: 'bg-orange-500',
  },
  RECOMMENDATION: {
    label: 'המלצה',
    icon: ThumbsUp,
    color: 'bg-pink-500',
  },
}

const sentimentConfig: Record<SentimentType, { label: string; color: string }> = {
  POSITIVE: { label: 'חיובי', color: 'bg-green-100 text-green-700' },
  NEUTRAL: { label: 'ניטרלי', color: 'bg-gray-100 text-gray-700' },
  NEGATIVE: { label: 'שלילי', color: 'bg-red-100 text-red-700' },
}

export function EntityReviewCard({
  entity,
  providers = [],
  onApprove,
  onReject,
  className,
}: EntityReviewCardProps) {
  const [selectedProviderId, setSelectedProviderId] = useState<string | undefined>(
    entity.providerId
  )

  const typeConfig = entityTypeConfig[entity.entityType]
  const TypeIcon = typeConfig.icon

  // Get extracted data details based on type
  const renderExtractedData = () => {
    const data = entity.extractedData

    switch (data.type) {
      case 'PROVIDER_MENTION':
        return (
          <div className="space-y-1">
            <p className="font-medium">{data.businessName}</p>
            <p className="text-sm text-muted-foreground">{data.context}</p>
            <Badge variant="outline" className="text-xs">
              {data.mentionType === 'DIRECT' ? 'אזכור ישיר' : 'אזכור עקיף'}
            </Badge>
          </div>
        )

      case 'CONTACT_INFO':
        return (
          <div className="space-y-1">
            {data.phone && <p className="font-mono">{data.phone}</p>}
            {data.email && <p className="font-mono text-sm">{data.email}</p>}
            {data.website && <p className="font-mono text-sm">{data.website}</p>}
            {data.associatedName && (
              <p className="text-sm text-muted-foreground">
                קשור ל: {data.associatedName}
              </p>
            )}
          </div>
        )

      case 'PRICING':
        return (
          <div className="space-y-1">
            <p className="font-medium text-lg">
              ₪{data.amount?.toLocaleString()}
              {data.priceType && (
                <span className="text-sm text-muted-foreground mr-1">
                  / {data.priceType === 'MONTHLY' ? 'חודש' :
                     data.priceType === 'HOURLY' ? 'שעה' :
                     data.priceType === 'PER_SESSION' ? 'שיעור' : ''}
                </span>
              )}
            </p>
            {data.serviceDescription && (
              <p className="text-sm text-muted-foreground">{data.serviceDescription}</p>
            )}
          </div>
        )

      case 'SERVICE_REQUEST':
        return (
          <div className="space-y-1">
            <p className="font-medium">{data.description}</p>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline">{data.serviceType}</Badge>
              {data.ageRange && <Badge variant="outline">גיל: {data.ageRange}</Badge>}
              {data.neighborhood && <Badge variant="outline">{data.neighborhood}</Badge>}
              {data.urgency && (
                <Badge variant={data.urgency === 'HIGH' ? 'destructive' : 'secondary'}>
                  {data.urgency === 'HIGH' ? 'דחוף' :
                   data.urgency === 'MEDIUM' ? 'בינוני' : 'נמוך'}
                </Badge>
              )}
            </div>
          </div>
        )

      case 'RECOMMENDATION':
        return (
          <div className="space-y-1">
            <p className="font-medium">{data.businessName}</p>
            <Badge
              variant="outline"
              className={cn(
                data.recommendationType === 'RECOMMEND' && 'bg-green-50 text-green-700 border-green-200',
                data.recommendationType === 'NOT_RECOMMEND' && 'bg-red-50 text-red-700 border-red-200'
              )}
            >
              {data.recommendationType === 'RECOMMEND' ? 'ממליץ' :
               data.recommendationType === 'NOT_RECOMMEND' ? 'לא ממליץ' : 'ניטרלי'}
            </Badge>
            {data.reason && (
              <p className="text-sm text-muted-foreground">{data.reason}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className={cn('relative', className)}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn('p-1.5 rounded', typeConfig.color)}>
              <TypeIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium text-sm">{typeConfig.label}</span>
          </div>

          <div className="flex items-center gap-2">
            {entity.sentiment && (
              <Badge variant="secondary" className={sentimentConfig[entity.sentiment].color}>
                {sentimentConfig[entity.sentiment].label}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {Math.round(entity.confidence * 100)}% confidence
            </Badge>
          </div>
        </div>

        {/* Original Text */}
        <div className="bg-muted/50 rounded p-3 mb-3">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm" dir="auto">{entity.rawText}</p>
          </div>
        </div>

        {/* Extracted Data */}
        <div className="mb-4">
          {renderExtractedData()}
        </div>

        {/* Provider Link */}
        {(entity.entityType === 'PROVIDER_MENTION' ||
          entity.entityType === 'RECOMMENDATION') && (
          <div className="mb-4">
            <label className="text-sm text-muted-foreground block mb-1.5">
              <Link2 className="h-3 w-3 inline ml-1" />
              קשר לספק קיים:
            </label>
            <Select
              value={selectedProviderId || ''}
              onValueChange={(value) => setSelectedProviderId(value || undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר ספק..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ללא קישור</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          {onReject && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(entity.id)}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4 ml-1" />
              דחה
            </Button>
          )}
          {onApprove && (
            <Button
              size="sm"
              onClick={() => onApprove(entity.id, selectedProviderId)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 ml-1" />
              אשר
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
