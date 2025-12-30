import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import { CategoryCard } from '@/components/cards/category-card'
import { getMainCategories, getListingsByCategory } from '@/lib/mock-data'

export default function CategoriesPage() {
  const categories = getMainCategories()

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <Header />

      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-2">כל הקטגוריות</h1>
        <p className="text-muted-foreground mb-8">
          גלו את כל השירותים, החוגים והעסקים ברמת בית שמש
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const listingsCount = getListingsByCategory(category.id).length
            return (
              <CategoryCard
                key={category.id}
                category={category}
                listingsCount={listingsCount}
              />
            )
          })}
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
