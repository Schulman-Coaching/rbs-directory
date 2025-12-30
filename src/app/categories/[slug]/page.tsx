'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowRight, Grid3X3, List } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { ListingCard } from '@/components/cards/listing-card'
import { CategoryCard } from '@/components/cards/category-card'
import { FilterPanel, FilterValues } from '@/components/search/filter-panel'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  getCategoryBySlug,
  getSubcategories,
  getListingsByCategory,
  filterListings,
  getProviderById
} from '@/lib/mock-data'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const category = getCategoryBySlug(slug)
  const [filters, setFilters] = useState<FilterValues>({})
  const [sortBy, setSortBy] = useState('recommended')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  if (!category) {
    return (
      <div className="min-h-screen pb-20 lg:pb-0">
        <Header />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">קטגוריה לא נמצאה</h1>
          <Button asChild>
            <Link href="/categories">חזרה לקטגוריות</Link>
          </Button>
        </div>
        <MobileNav />
      </div>
    )
  }

  const subcategories = getSubcategories(category.id)
  const allListings = getListingsByCategory(category.id)

  // Also get listings from subcategories
  const subcategoryListings = subcategories.flatMap(sub => getListingsByCategory(sub.id))
  const combinedListings = [...allListings, ...subcategoryListings]

  // Apply filters
  const filteredListings = filterListings({
    ...filters,
    categoryId: undefined // We already filtered by category
  }).filter(l => combinedListings.some(cl => cl.id === l.id))

  // Sort
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0)
      case 'price-high':
        return (b.price || 0) - (a.price || 0)
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'popular':
        return b.viewCount - a.viewCount
      default:
        return b.isFeatured ? 1 : -1
    }
  })

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
            <Link href="/categories" className="text-muted-foreground hover:text-foreground">
              קטגוריות
            </Link>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{category.nameHe}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-b from-primary/5 to-background py-8">
        <div className="container">
          <h1 className="text-3xl font-bold mb-2">{category.nameHe}</h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>
      </div>

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="border-b">
          <div className="container py-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/categories/${sub.slug}`}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-muted hover:bg-accent transition-colors text-sm"
                >
                  {sub.nameHe}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold mb-4">סינון</h2>
              <FilterPanel values={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <FilterPanel
                  values={filters}
                  onChange={setFilters}
                  className="lg:hidden"
                />
                <span className="text-sm text-muted-foreground">
                  {sortedListings.length} תוצאות
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">מומלצים</SelectItem>
                    <SelectItem value="popular">פופולריים</SelectItem>
                    <SelectItem value="newest">חדשים</SelectItem>
                    <SelectItem value="price-low">מחיר: נמוך לגבוה</SelectItem>
                    <SelectItem value="price-high">מחיר: גבוה לנמוך</SelectItem>
                  </SelectContent>
                </Select>
                <div className="hidden sm:flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {sortedListings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">לא נמצאו תוצאות</p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  נקה סינון
                </Button>
              </div>
            ) : (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}>
                {sortedListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    provider={getProviderById(listing.providerId)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
