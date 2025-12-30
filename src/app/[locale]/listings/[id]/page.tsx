'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {
  ArrowRight, Heart, Share2, MapPin, Clock, Users, Phone,
  MessageCircle, Calendar, Globe, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ListingCard } from '@/components/cards/listing-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn, formatPrice, formatAgeRange, getInitials } from '@/lib/utils'
import {
  getListingById,
  getProviderById,
  getCategoryBySlug,
  getListingsByCategory,
  getFlatCategories
} from '@/lib/mock-data'
import { getProviderStats } from '@/lib/mock-data/whatsapp-imports'
import { CommunityBadge } from '@/components/listings/community-badge'

const dayNames: Record<string, string> = {
  sunday: 'ראשון',
  monday: 'שני',
  tuesday: 'שלישי',
  wednesday: 'רביעי',
  thursday: 'חמישי',
  friday: 'שישי',
  saturday: 'שבת',
}

export default function ListingPage() {
  const params = useParams()
  const id = params.id as string
  const listing = getListingById(id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!listing) {
    return (
      <div className="min-h-screen pb-20 lg:pb-0">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">הפריט לא נמצא</h1>
          <Button asChild>
            <Link href="/">חזרה לדף הבית</Link>
          </Button>
        </div>
        <MobileNav />
      </div>
    )
  }

  const provider = getProviderById(listing.providerId)
  const category = getFlatCategories().find(c => c.id === listing.categoryId)
  const relatedListings = getListingsByCategory(listing.categoryId)
    .filter(l => l.id !== listing.id)
    .slice(0, 4)
  const communityStats = provider ? getProviderStats(provider.id) : null

  const images = listing.images?.length
    ? listing.images
    : [{ id: 'default', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800', alt: listing.title, order: 0 }]

  const nextImage = () => setCurrentImageIndex((i) => (i + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              בית
            </Link>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            {category && (
              <>
                <Link href={`/categories/${category.slug}`} className="text-muted-foreground hover:text-foreground">
                  {category.nameHe}
                </Link>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </>
            )}
            <span className="font-medium truncate">{listing.titleHe || listing.title}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
              <Image
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].alt || listing.title}
                fill
                className="object-cover"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        className={cn(
                          'w-2 h-2 rounded-full transition-colors',
                          i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        )}
                        onClick={() => setCurrentImageIndex(i)}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 hover:bg-white"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={cn('h-5 w-5', isFavorite && 'fill-red-500 text-red-500')} />
                </Button>
                <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              {listing.isFeatured && (
                <Badge className="absolute top-4 right-4 bg-amber-500">מומלץ</Badge>
              )}
            </div>

            {/* Title & Quick Info */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-4">
                {listing.titleHe || listing.title}
              </h1>
              <div className="flex flex-wrap gap-4">
                {listing.ageMin !== undefined && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>גילאים: {formatAgeRange(listing.ageMin, listing.ageMax)}</span>
                  </div>
                )}
                {listing.neighborhood && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{listing.neighborhood}</span>
                  </div>
                )}
                {listing.duration && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{listing.duration} דקות</span>
                  </div>
                )}
              </div>

              {/* Community Badge */}
              {communityStats && communityStats.totalMentions > 0 && provider && (
                <CommunityBadge
                  stats={communityStats}
                  providerId={provider.id}
                  className="mt-4"
                />
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-4">תיאור</h2>
              <p className="text-muted-foreground whitespace-pre-line">
                {listing.descriptionHe || listing.description}
              </p>
            </div>

            {/* Schedule */}
            {listing.schedule && Object.keys(listing.schedule).length > 0 && (
              <>
                <Separator />
                <div>
                  <h2 className="text-xl font-semibold mb-4">לוח זמנים</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(listing.schedule).map(([day, slots]) => (
                      <div key={day} className="p-3 rounded-lg bg-muted">
                        <div className="font-medium mb-1">יום {dayNames[day]}</div>
                        {(slots as Array<{ start: string; end: string }>).map((slot, i) => (
                          <div key={i} className="text-sm text-muted-foreground" dir="ltr">
                            {slot.start} - {slot.end}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Details */}
            <Separator />
            <div>
              <h2 className="text-xl font-semibold mb-4">פרטים נוספים</h2>
              <div className="grid grid-cols-2 gap-4">
                {listing.gender && listing.gender !== 'ALL' && (
                  <div>
                    <div className="text-sm text-muted-foreground">מיועד ל</div>
                    <div className="font-medium">{listing.gender === 'MALE' ? 'בנים' : 'בנות'}</div>
                  </div>
                )}
                {listing.instructorGender && (
                  <div>
                    <div className="text-sm text-muted-foreground">מדריך/ה</div>
                    <div className="font-medium">{listing.instructorGender === 'MALE' ? 'גבר' : 'אישה'}</div>
                  </div>
                )}
                {listing.maxParticipants && (
                  <div>
                    <div className="text-sm text-muted-foreground">מקסימום משתתפים</div>
                    <div className="font-medium">{listing.maxParticipants}</div>
                  </div>
                )}
                {listing.language && listing.language.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground">שפות</div>
                    <div className="flex gap-1">
                      {listing.language.map(lang => (
                        <Badge key={lang} variant="outline">
                          {lang === 'he' ? 'עברית' : lang === 'en' ? 'English' : lang}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {listing.subsidies && listing.subsidies.length > 0 && (
                  <div className="col-span-2">
                    <div className="text-sm text-muted-foreground">סבסוד קופות חולים</div>
                    <div className="flex gap-1 mt-1">
                      {listing.subsidies.map(sub => (
                        <Badge key={sub} variant="secondary">{sub}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Actions Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  {listing.price !== undefined && listing.priceType !== 'FREE' && listing.priceType !== 'CONTACT' ? (
                    <div>
                      <div className="text-3xl font-bold text-primary">
                        {formatPrice(listing.price)}
                      </div>
                      <div className="text-muted-foreground">
                        {listing.priceType === 'MONTHLY' && 'לחודש'}
                        {listing.priceType === 'HOURLY' && 'לשעה'}
                        {listing.priceType === 'PER_SESSION' && 'לשיעור'}
                        {listing.priceType === 'FIXED' && 'מחיר כולל'}
                      </div>
                    </div>
                  ) : listing.priceType === 'FREE' ? (
                    <Badge className="text-lg py-2 px-4">חינם</Badge>
                  ) : (
                    <div className="text-muted-foreground">צרו קשר למחיר</div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <MessageCircle className="h-4 w-4 ml-2" />
                    שלח הודעה
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Phone className="h-4 w-4 ml-2" />
                    התקשר
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <Calendar className="h-4 w-4 ml-2" />
                    הוסף ללוח שנה
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Provider Card */}
            {provider && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">אודות הספק</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/providers/${provider.id}`} className="block">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        {provider.logo && <AvatarImage src={provider.logo} />}
                        <AvatarFallback>{getInitials(provider.businessName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{provider.businessName}</span>
                          {provider.isVerified && (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        {provider.neighborhood && (
                          <div className="text-sm text-muted-foreground">
                            {provider.neighborhood}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                  {provider.shortDescription && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {provider.shortDescription}
                    </p>
                  )}
                  <div className="space-y-2 text-sm">
                    {provider.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span dir="ltr">{provider.phone}</span>
                      </div>
                    )}
                    {provider.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={provider.website} target="_blank" rel="noopener" className="text-primary hover:underline">
                          אתר
                        </a>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href={`/providers/${provider.id}`}>
                      צפה בכל השירותים
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            {listing.location && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">מיקום</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span>{listing.location}</span>
                  </div>
                  {/* Map placeholder */}
                  <div className="mt-4 aspect-video rounded-lg bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">מפה תופיע כאן</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">אולי יעניין אותך גם</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedListings.map((related) => (
                <ListingCard
                  key={related.id}
                  listing={related}
                  provider={getProviderById(related.providerId)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <MobileNav />
    </div>
  )
}
