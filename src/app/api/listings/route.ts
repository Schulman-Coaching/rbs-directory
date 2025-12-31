/**
 * Listings API Routes
 * GET: List listings with filtering and pagination
 * POST: Create a new listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { listings as mockListings } from '@/lib/mock-data/listings'
import { processListingBatch, IngestionOptions } from '@/services/ingestion'
import { ListingInput } from '@/services/ingestion/validation'
import { Listing, ListingStatus, SourceType } from '@/types'

// In-memory store for development (will be replaced with Prisma)
let listingsStore: Listing[] = [...mockListings]
let idCounter = 100

interface ListingsQuery {
  status?: ListingStatus
  categoryId?: string
  providerId?: string
  sourceType?: SourceType
  neighborhood?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'price'
  sortOrder?: 'asc' | 'desc'
}

/**
 * GET /api/listings
 * List listings with optional filtering and pagination
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query: ListingsQuery = {
      status: searchParams.get('status') as ListingStatus | undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      providerId: searchParams.get('providerId') || undefined,
      sourceType: searchParams.get('sourceType') as SourceType | undefined,
      neighborhood: searchParams.get('neighborhood') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: (searchParams.get('sortBy') as ListingsQuery['sortBy']) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    }

    let filtered = [...listingsStore]

    // Apply filters
    if (query.status) {
      filtered = filtered.filter(l => l.status === query.status)
    }
    if (query.categoryId) {
      filtered = filtered.filter(l => l.categoryId === query.categoryId)
    }
    if (query.providerId) {
      filtered = filtered.filter(l => l.providerId === query.providerId)
    }
    if (query.sourceType) {
      filtered = filtered.filter(l => l.sourceType === query.sourceType)
    }
    if (query.neighborhood) {
      filtered = filtered.filter(l => l.neighborhood === query.neighborhood)
    }
    if (query.search) {
      const searchLower = query.search.toLowerCase()
      filtered = filtered.filter(l =>
        l.title.toLowerCase().includes(searchLower) ||
        l.titleHe?.toLowerCase().includes(searchLower) ||
        l.description.toLowerCase().includes(searchLower) ||
        l.descriptionHe?.toLowerCase().includes(searchLower)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (query.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'price':
          comparison = (a.price || 0) - (b.price || 0)
          break
        case 'updatedAt':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
      }
      return query.sortOrder === 'asc' ? comparison : -comparison
    })

    // Apply pagination
    const page = query.page || 1
    const limit = Math.min(query.limit || 20, 100)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginated = filtered.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNext: endIndex < filtered.length,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/listings
 * Create a new listing (goes through ingestion pipeline)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check if it's a single listing or batch
    const isBatch = Array.isArray(body.listings)
    const inputs: ListingInput[] = isBatch ? body.listings : [body]

    // Build ingestion options
    const options: IngestionOptions = {
      sourceType: body.sourceType || 'MANUAL',
      sourceId: body.sourceId,
      sourceUrl: body.sourceUrl,
      skipDuplicates: body.skipDuplicates ?? true,
      autoApprove: body.autoApprove ?? false,
      existingListings: listingsStore.map(l => ({
        title: l.title,
        titleHe: l.titleHe,
        providerId: l.providerId,
      })),
    }

    // Process through ingestion pipeline
    const result = processListingBatch(inputs, options)

    // If successful, add to store
    if (result.listings.length > 0) {
      const newListings: Listing[] = result.listings.map(partial => ({
        id: `listing-${++idCounter}`,
        title: partial.title || '',
        titleHe: partial.titleHe,
        description: partial.description || '',
        descriptionHe: partial.descriptionHe,
        categoryId: partial.categoryId || 'cat-other',
        providerId: partial.providerId || 'provider-unknown',
        price: partial.price,
        priceType: partial.priceType || 'CONTACT',
        location: partial.location,
        neighborhood: partial.neighborhood,
        ageMin: partial.ageMin,
        ageMax: partial.ageMax,
        gender: partial.gender || 'ALL',
        instructorGender: partial.instructorGender,
        language: partial.language || ['he'],
        maxParticipants: partial.maxParticipants,
        duration: partial.duration,
        isOnline: partial.isOnline,
        imageUrl: partial.imageUrl,
        images: partial.images || [],
        subsidies: partial.subsidies || [],
        tags: partial.tags || [],
        status: partial.status || 'PENDING',
        featured: false,
        rating: 0,
        reviewCount: 0,
        viewCount: 0,
        sourceType: partial.sourceType || 'MANUAL',
        sourceId: partial.sourceId,
        sourceUrl: partial.sourceUrl,
        syncEnabled: partial.syncEnabled || false,
        submittedAt: partial.submittedAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      listingsStore.push(...newListings)

      return NextResponse.json({
        success: true,
        data: isBatch ? newListings : newListings[0],
        stats: {
          created: result.created,
          skipped: result.skipped,
          errors: result.errors.length,
          warnings: result.warnings.length,
        },
        errors: result.errors,
        warnings: result.warnings,
      }, { status: 201 })
    }

    // If no listings were created, return errors
    return NextResponse.json({
      success: false,
      error: 'No listings were created',
      stats: {
        created: 0,
        skipped: result.skipped,
        errors: result.errors.length,
        warnings: result.warnings.length,
      },
      errors: result.errors,
      warnings: result.warnings,
    }, { status: 400 })

  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    )
  }
}

// Export store getter/setter for other routes to use
export function getListingsStore(): Listing[] {
  return listingsStore
}

export function updateListingsStore(listings: Listing[]): void {
  listingsStore = listings
}

export function findListingById(id: string): Listing | undefined {
  return listingsStore.find(l => l.id === id)
}

export function updateListing(id: string, updates: Partial<Listing>): Listing | null {
  const index = listingsStore.findIndex(l => l.id === id)
  if (index === -1) return null

  listingsStore[index] = {
    ...listingsStore[index],
    ...updates,
    updatedAt: new Date(),
  }
  return listingsStore[index]
}

export function deleteListing(id: string): boolean {
  const index = listingsStore.findIndex(l => l.id === id)
  if (index === -1) return false

  listingsStore.splice(index, 1)
  return true
}
