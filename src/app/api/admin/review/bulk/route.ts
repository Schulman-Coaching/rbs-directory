/**
 * Admin Bulk Review API Route
 * POST: Approve or reject multiple listings at once
 */

import { NextRequest, NextResponse } from 'next/server'
import { findListingById, updateListing } from '@/app/api/listings/route'
import { ListingStatus } from '@/types'

interface BulkReviewAction {
  listingIds: string[]
  action: 'APPROVE' | 'REJECT'
  notes?: string
  reviewedBy?: string
}

interface BulkResult {
  id: string
  success: boolean
  error?: string
}

/**
 * POST /api/admin/review/bulk
 * Bulk approve or reject listings
 */
export async function POST(request: NextRequest) {
  try {
    const body: BulkReviewAction = await request.json()

    if (!body.listingIds || !Array.isArray(body.listingIds) || body.listingIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'listingIds array is required and must not be empty' },
        { status: 400 }
      )
    }

    if (!body.action || !['APPROVE', 'REJECT'].includes(body.action)) {
      return NextResponse.json(
        { success: false, error: 'action must be APPROVE or REJECT' },
        { status: 400 }
      )
    }

    // Limit bulk operations
    if (body.listingIds.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Maximum 100 listings per bulk operation' },
        { status: 400 }
      )
    }

    const newStatus: ListingStatus = body.action === 'APPROVE' ? 'ACTIVE' : 'REJECTED'
    const results: BulkResult[] = []
    let successCount = 0
    let failCount = 0

    for (const listingId of body.listingIds) {
      const listing = findListingById(listingId)

      if (!listing) {
        results.push({
          id: listingId,
          success: false,
          error: 'Listing not found',
        })
        failCount++
        continue
      }

      try {
        updateListing(listingId, {
          status: newStatus,
          reviewNotes: body.notes,
          reviewedAt: new Date(),
          reviewedBy: body.reviewedBy || 'admin',
        })

        results.push({
          id: listingId,
          success: true,
        })
        successCount++
      } catch (err) {
        results.push({
          id: listingId,
          success: false,
          error: 'Failed to update listing',
        })
        failCount++
      }
    }

    const allSucceeded = failCount === 0

    return NextResponse.json({
      success: allSucceeded,
      message: `${successCount} listing(s) ${body.action === 'APPROVE' ? 'approved' : 'rejected'}, ${failCount} failed`,
      stats: {
        total: body.listingIds.length,
        success: successCount,
        failed: failCount,
      },
      results,
    }, { status: allSucceeded ? 200 : 207 }) // 207 Multi-Status if partial success
  } catch (error) {
    console.error('Error in bulk review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process bulk review' },
      { status: 500 }
    )
  }
}
