'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Globe, CheckCircle2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import type { Provider } from '@/types'

interface ProviderCardProps {
  provider: Provider
  listingsCount?: number
  className?: string
}

export function ProviderCard({ provider, listingsCount, className }: ProviderCardProps) {
  const logoUrl = provider.logo || provider.images?.[0]?.url

  return (
    <Card className={cn('group overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <Link href={`/providers/${provider.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 rounded-lg">
              {logoUrl ? (
                <AvatarImage src={logoUrl} alt={provider.businessName} />
              ) : null}
              <AvatarFallback className="rounded-lg text-lg">
                {getInitials(provider.businessName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                  {provider.businessName}
                </h3>
                {provider.isVerified && (
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>

              {provider.shortDescription && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {provider.shortDescription}
                </p>
              )}

              <div className="flex flex-wrap gap-3 mt-3">
                {provider.neighborhood && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{provider.neighborhood}</span>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    <span dir="ltr">{provider.phone}</span>
                  </div>
                )}
                {provider.website && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <span>אתר</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex gap-2">
              {provider.subscriptionTier === 'PREMIUM' && (
                <Badge className="bg-amber-500 hover:bg-amber-600">פרימיום</Badge>
              )}
              {provider.subscriptionTier === 'STANDARD' && (
                <Badge variant="secondary">סטנדרט</Badge>
              )}
            </div>
            {listingsCount !== undefined && (
              <span className="text-sm text-muted-foreground">
                {listingsCount} שירותים
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
