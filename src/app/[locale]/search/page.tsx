'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { SearchBar } from '@/components/search/search-bar'
import { FilterPanel, FilterValues } from '@/components/search/filter-panel'
import { ListingCard } from '@/components/cards/listing-card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { searchListings, filterListings, getProviderById } from '@/lib/mock-data'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [filters, setFilters] = useState<FilterValues>({})
  const [sortBy, setSortBy] = useState('recommended')

  // Get results based on query and filters
  let results = query ? searchListings(query) : filterListings(filters)

  // Apply additional filters if there's a query
  if (query && Object.keys(filters).length > 0) {
    const filteredIds = filterListings(filters).map(l => l.id)
    results = results.filter(r => filteredIds.includes(r.id))
  }

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
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

      <div className="container py-8">
        {/* Search Header */}
        <div className="max-w-2xl mb-8">
          <h1 className="text-2xl font-bold mb-4">חיפוש</h1>
          <SearchBar
            defaultValue={query}
            onSearch={setQuery}
            size="lg"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="font-semibold mb-4">סינון</h2>
              <FilterPanel values={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Results */}
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
                  {sortedResults.length} תוצאות
                  {query && ` עבור "${query}"`}
                </span>
              </div>
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
            </div>

            {/* Results Grid */}
            {sortedResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {query ? `לא נמצאו תוצאות עבור "${query}"` : 'לא נמצאו תוצאות'}
                </p>
                <Button variant="outline" onClick={() => { setQuery(''); setFilters({}) }}>
                  נקה חיפוש
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedResults.map((listing) => (
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
