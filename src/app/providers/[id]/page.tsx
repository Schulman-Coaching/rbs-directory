'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowRight, Phone, Mail, Globe, MapPin, Clock,
  CheckCircle2, MessageCircle
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ListingCard } from '@/components/cards/listing-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { getInitials } from '@/lib/utils'
import { getProviderById, getListingsByProvider } from '@/lib/mock-data'

const dayNames: Record<string, string> = {
  sunday: 'ראשון',
  monday: 'שני',
  tuesday: 'שלישי',
  wednesday: 'רביעי',
  thursday: 'חמישי',
  friday: 'שישי',
  saturday: 'שבת',
}

export default function ProviderPage() {
  const params = useParams()
  const id = params.id as string
  const provider = getProviderById(id)

  if (!provider) {
    return (
      <div className="min-h-screen pb-20 lg:pb-0">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">הספק לא נמצא</h1>
          <Button asChild>
            <Link href="/">חזרה לדף הבית</Link>
          </Button>
        </div>
        <MobileNav />
      </div>
    )
  }

  const listings = getListingsByProvider(provider.id)

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
            <span className="font-medium truncate">{provider.businessName}</span>
          </nav>
        </div>
      </div>

      {/* Provider Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 rounded-xl">
              {provider.logo && <AvatarImage src={provider.logo} />}
              {provider.images?.[0]?.url && <AvatarImage src={provider.images[0].url} />}
              <AvatarFallback className="rounded-xl text-2xl">
                {getInitials(provider.businessName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold">{provider.businessName}</h1>
                {provider.isVerified && (
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                )}
              </div>
              {provider.shortDescription && (
                <p className="text-muted-foreground mb-4">{provider.shortDescription}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {provider.subscriptionTier === 'PREMIUM' && (
                  <Badge className="bg-amber-500 hover:bg-amber-600">ספק פרימיום</Badge>
                )}
                {provider.neighborhood && (
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 ml-1" />
                    {provider.neighborhood}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <Button className="flex-1 md:flex-none">
                <MessageCircle className="h-4 w-4 ml-2" />
                שלח הודעה
              </Button>
              {provider.phone && (
                <Button variant="outline" asChild>
                  <a href={`tel:${provider.phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {provider.description && (
              <section>
                <h2 className="text-xl font-semibold mb-4">אודות</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {provider.description}
                </p>
              </section>
            )}

            {/* Listings */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                שירותים ({listings.length})
              </h2>
              {listings.length === 0 ? (
                <p className="text-muted-foreground">אין שירותים להצגה</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      showProvider={false}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">פרטי התקשרות</h3>
                <div className="space-y-3">
                  {provider.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${provider.phone}`}
                        className="hover:text-primary"
                        dir="ltr"
                      >
                        {provider.phone}
                      </a>
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${provider.email}`}
                        className="hover:text-primary"
                      >
                        {provider.email}
                      </a>
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        אתר
                      </a>
                    </div>
                  )}
                  {provider.location && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                      <span>{provider.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            {provider.hours && Object.keys(provider.hours).length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">שעות פעילות</h3>
                  <div className="space-y-2">
                    {Object.entries(provider.hours).map(([day, hours]) => {
                      const h = hours as { open: string; close: string; isClosed?: boolean }
                      return (
                        <div key={day} className="flex justify-between text-sm">
                          <span>יום {dayNames[day]}</span>
                          <span className="text-muted-foreground" dir="ltr">
                            {h.isClosed ? 'סגור' : `${h.open} - ${h.close}`}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location Map Placeholder */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">מיקום</h3>
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">מפה תופיע כאן</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
