'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Heart, MapPin, Clock, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn, formatPrice, formatAgeRange } from '@/lib/utils'
import type { Listing, Provider } from '@/types'

interface ListingCardProps {
  listing: Listing
  provider?: Provider
  showProvider?: boolean
  className?: string
}

export function ListingCard({ listing, provider, showProvider = true, className }: ListingCardProps) {
  const locale = useLocale()
  const t = useTranslations('common')
  const imageUrl = listing.images?.[0]?.url || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800'

  // Use Hebrew title for Hebrew locale, English otherwise
  const title = locale === 'he' ? (listing.titleHe || listing.title) : listing.title

  return (
    <Card className={cn('group overflow-hidden hover:shadow-lg transition-shadow', className)}>
      <Link href={`/listings/${listing.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {listing.isFeatured && (
            <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
              {t('featured')}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.preventDefault()
              // Handle favorite toggle
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/listings/${listing.id}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        {showProvider && provider && (
          <Link
            href={`/providers/${provider.id}`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {provider.businessName}
          </Link>
        )}

        <div className="flex flex-wrap gap-2 mt-3">
          {listing.ageMin !== undefined && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{formatAgeRange(listing.ageMin, listing.ageMax)}</span>
            </div>
          )}
          {listing.neighborhood && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{listing.neighborhood}</span>
            </div>
          )}
          {listing.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{listing.duration} {t('duration')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            {listing.price !== undefined && listing.priceType !== 'FREE' && listing.priceType !== 'CONTACT' ? (
              <div className="font-bold text-primary">
                {formatPrice(listing.price)}
                <span className="text-xs font-normal text-muted-foreground ltr:ml-1 rtl:mr-1">
                  {listing.priceType === 'MONTHLY' && `/${t('perMonth')}`}
                  {listing.priceType === 'HOURLY' && `/${t('perHour')}`}
                  {listing.priceType === 'PER_SESSION' && `/${t('perSession')}`}
                </span>
              </div>
            ) : listing.priceType === 'FREE' ? (
              <Badge variant="secondary">{t('free')}</Badge>
            ) : (
              <span className="text-sm text-muted-foreground">{t('contactForPrice')}</span>
            )}
          </div>

          {listing.subsidies && listing.subsidies.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {listing.subsidies[0]}
            </Badge>
          )}
        </div>

        {/* Language badges */}
        <div className="flex gap-1 mt-2">
          {listing.language.includes('en') && (
            <Badge variant="outline" className="text-xs">EN</Badge>
          )}
          {listing.language.includes('he') && (
            <Badge variant="outline" className="text-xs">עב</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
