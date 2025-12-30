// Mock Data Exports
export * from './categories'
export * from './providers'
export * from './listings'

// Re-export commonly used functions
import { categories, getFeaturedCategories, getMainCategories, getCategoryBySlug, getSubcategories } from './categories'
import { providers, getProviderById, getFeaturedProviders } from './providers'
import {
  listings,
  getListingById,
  getListingsByCategory,
  getListingsByProvider,
  getFeaturedListings,
  getPopularListings,
  getNewListings,
  searchListings,
  filterListings
} from './listings'

export const mockData = {
  categories,
  providers,
  listings,

  // Category helpers
  getFeaturedCategories,
  getMainCategories,
  getCategoryBySlug,
  getSubcategories,

  // Provider helpers
  getProviderById,
  getFeaturedProviders,

  // Listing helpers
  getListingById,
  getListingsByCategory,
  getListingsByProvider,
  getFeaturedListings,
  getPopularListings,
  getNewListings,
  searchListings,
  filterListings,
}

export default mockData
