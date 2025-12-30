import Link from 'next/link'
import { ArrowLeft, Star, TrendingUp, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { SearchBar } from '@/components/search/search-bar'
import { ListingCard } from '@/components/cards/listing-card'
import { CategoryCard } from '@/components/cards/category-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  getFeaturedCategories,
  getFeaturedListings,
  getPopularListings,
  getNewListings,
  getProviderById
} from '@/lib/mock-data'

export default function HomePage() {
  const featuredCategories = getFeaturedCategories()
  const featuredListings = getFeaturedListings().slice(0, 4)
  const popularListings = getPopularListings(6)
  const newListings = getNewListings(4)

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-12 lg:py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 ml-1" />
              הפלטפורמה החדשה של רמת בית שמש
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              כל החוגים, העסקים והשירותים
              <br />
              <span className="text-primary">במקום אחד</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              מצאו את החוג המושלם לילדים, שירותים לשמחות, בעלי מקצוע ועוד - הכל ברמת בית שמש
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar size="lg" placeholder="מה אתם מחפשים?" />
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Link href="/categories/kids-teens">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">חוגים לילדים</Badge>
              </Link>
              <Link href="/categories/simcha">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">שירותי שמחות</Badge>
              </Link>
              <Link href="/categories/health-wellness">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">בריאות</Badge>
              </Link>
              <Link href="/categories/home-improvement">
                <Badge variant="outline" className="cursor-pointer hover:bg-accent">שיפוצים</Badge>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">קטגוריות מובילות</h2>
            <Button variant="ghost" asChild>
              <Link href="/categories">
                כל הקטגוריות
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                variant="large"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <h2 className="text-2xl font-bold">מומלצים</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/search?featured=true">
                הכל
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                provider={getProviderById(listing.providerId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Listings */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">הכי פופולריים</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/search?sort=popular">
                הכל
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                provider={getProviderById(listing.providerId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New This Week */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-500" />
              <h2 className="text-2xl font-bold">חדש השבוע</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/search?sort=newest">
                הכל
                <ArrowLeft className="h-4 w-4 mr-2" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                provider={getProviderById(listing.providerId)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Providers */}
      <section className="py-16">
        <div className="container">
          <div className="bg-primary rounded-2xl p-8 lg:p-12 text-center text-primary-foreground">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              יש לכם עסק או חוג?
            </h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              הצטרפו למדריך רמב״ש והגיעו לאלפי משפחות. רישום בחינם, שליטה מלאה על הפרופיל שלכם.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register?type=provider">
                הצטרפו עכשיו - חינם
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <MobileNav />
    </div>
  )
}
