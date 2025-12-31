/**
 * Admin Review API Routes
 * GET: Get pending listings for review
 * POST: Approve or reject a listing
 */

import { NextRequest, NextResponse } from 'next/server'
import { getListingsStore, findListingById, updateListing } from '@/app/api/listings/route'
import { ListingStatus, SourceType } from '@/types'

interface ReviewQuery {
  status?: ListingStatus
  sourceType?: SourceType
  categoryId?: string
  page?: number
  limit?: number
  sortBy?: 'submittedAt' | 'createdAt' | 'title'
  sortOrder?: 'asc' | 'desc'
}

interface ReviewAction {
  listingId: string
  action: 'APPROVE' | 'REJECT'
  notes?: string
  reviewedBy?: string
}

/**
 * GET /api/admin/review
 * Get listings pending review (or filter by status)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const query: ReviewQuery = {
      status: (searchParams.get('status') as ListingStatus) || 'PENDING',
      sourceType: searchParams.get('sourceType') as SourceType | undefined,
      categoryId: searchParams.get('categoryId') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      sortBy: (searchParams.get('sortBy') as ReviewQuery['sortBy']) || 'submittedAt',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    }

    let filtered = getListingsStore().filter(l => l.status === query.status)

    // Apply additional filters
    if (query.sourceType) {
      filtered = filtered.filter(l => l.sourceType === query.sourceType)
    }
    if (query.categoryId) {
      filtered = filtered.filter(l => l.categoryId === query.categoryId)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0
      switch (query.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'submittedAt':
          const aDate = a.submittedAt ? new Date(a.submittedAt).getTime() : 0
          const bDate = b.submittedAt ? new Date(b.submittedAt).getTime() : 0
          comparison = aDate - bDate
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

    // Get counts by status for dashboard
    const allListings = getListingsStore()
    const statusCounts = {
      PENDING: allListings.filter(l => l.status === 'PENDING').length,
      ACTIVE: allListings.filter(l => l.status === 'ACTIVE').length,
      REJECTED: allListings.filter(l => l.status === 'REJECTED').length,
      DRAFT: allListings.filter(l => l.status === 'DRAFT').length,
      ARCHIVED: allListings.filter(l => l.status === 'ARCHIVED').length,
    }

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
      statusCounts,
    })
  } catch (error) {
    console.error('Error fetching review queue:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review queue' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/review
 * Approve or reject a listing
 */
export async function POST(request: NextRequest) {
  try {
    const body: ReviewAction = await request.json()

    if (!body.listingId || !body.action) {
      return NextResponse.json(
        { success: false, error: 'listingId and action are required' },
        { status: 400 }
      )
    }

    if (!['APPROVE', 'REJECT'].includes(body.action)) {
      return NextResponse.json(
        { success: false, error: 'action must be APPROVE or REJECT' },
        { status: 400 }
      )
    }

    const listing = findListingById(body.listingId)

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    // Determine new status based on action
    const newStatus: ListingStatus = body.action === 'APPROVE' ? 'ACTIVE' : 'REJECTED'

    const updated = updateListing(body.listingId, {
      status: newStatus,
      reviewNotes: body.notes,
      reviewedAt: new Date(),
      reviewedBy: body.reviewedBy || 'admin',
    })

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Listing ${body.action === 'APPROVE' ? 'approved' : 'rejected'} successfully`,
    })
  } catch (error) {
    console.error('Error processing review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process review' },
      { status: 500 }
    )
  }
}
